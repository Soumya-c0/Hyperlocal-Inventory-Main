package com.example.demo.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;

@Service
public class RoutingEngineService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String ML_API_URL = "http://localhost:8000/predict-emissions";
    private final String ELEVATION_API_URL = "https://api.open-elevation.com/api/v1/lookup";

    public List<Map<String, Object>> calculateLiveRoutes(double currentWeightKg, double startLat, double startLon, double endLat, double endLon) {
        List<Map<String, Object>> routeOptions = new ArrayList<>();

        // Route(s) 1: OSRM's direct/fastest path, plus any alternatives it happens to find
        String directUrl = String.format(Locale.US,
            "http://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?alternatives=true&geometries=geojson",
            startLon, startLat, endLon, endLat);
        routeOptions.addAll(fetchAndProcessRoutes(directUrl, currentWeightKg, "OSRM-RT-Direct"));

        // Route 2: a real, deliberately different path via a detour waypoint,
        // so we ALWAYS have a genuine second route to compare emissions against
        double[] viaPoint = calculateDetourWaypoint(startLat, startLon, endLat, endLon);
        String detourUrl = String.format(Locale.US,
            "http://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f;%f,%f?geometries=geojson",
            startLon, startLat, viaPoint[1], viaPoint[0], endLon, endLat);
        routeOptions.addAll(fetchAndProcessRoutes(detourUrl, currentWeightKg, "OSRM-RT-Detour"));

        if (routeOptions.isEmpty()) {
            return routeOptions;
        }

        routeOptions.sort(Comparator.comparingDouble(r -> (double) r.get("projectedCo2")));
        routeOptions.get(0).put("isGreenest", true);
        routeOptions.get(0).put("description", "Eco-Route (Lowest Emissions)");
        if (routeOptions.size() > 1) {
            routeOptions.get(routeOptions.size() - 1).put("description", "Standard Route");
        }

        return routeOptions;
    }

    // Picks a real point offset sideways from the direct line, so OSRM has to
    // route through a genuinely different set of streets. OSRM snaps this to
    // the nearest actual road automatically.
    private double[] calculateDetourWaypoint(double startLat, double startLon, double endLat, double endLon) {
        double midLat = (startLat + endLat) / 2.0;
        double midLon = (startLon + endLon) / 2.0;

        double dLat = endLat - startLat;
        double dLon = endLon - startLon;

        double offsetLat = midLat + (-dLon) * 0.3;
        double offsetLon = midLon + (dLat) * 0.3;

        return new double[]{offsetLat, offsetLon};
    }

    private List<Map<String, Object>> fetchAndProcessRoutes(String osrmUrl, double currentWeightKg, String idPrefix) {
        List<Map<String, Object>> results = new ArrayList<>();
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(osrmUrl, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode routesNode = root.path("routes");

            int i = 1;
            for (JsonNode route : routesNode) {
                double distanceKm = route.path("distance").asDouble() / 1000.0;
                double distanceMeters = route.path("distance").asDouble();
                int durationMins = route.path("duration").asInt() / 60;
                JsonNode geometry = route.path("geometry");

                double liveGradientDeg;
                try {
                    List<double[]> samplePoints = extractSamplePoints(geometry, 8);
                    List<Double> elevations = fetchElevations(samplePoints);
                    liveGradientDeg = calculateGradientDegrees(elevations, distanceMeters);
                } catch (Exception e) {
                    System.err.println("Elevation lookup failed, using fallback gradient: " + e.getMessage());
                    liveGradientDeg = 2.0;
                }

                double projectedCo2 = fetchCo2Prediction(currentWeightKg, liveGradientDeg, distanceKm);

                Map<String, Object> routeData = new HashMap<>();
                routeData.put("routeId", idPrefix + "-" + i);
                routeData.put("distanceKm", Math.round(distanceKm * 10.0) / 10.0);
                routeData.put("estimatedTimeMins", durationMins);
                routeData.put("projectedCo2", Math.round(projectedCo2 * 10.0) / 10.0);
                routeData.put("gradientDeg", Math.round(liveGradientDeg * 100.0) / 100.0);
                routeData.put("geometry", objectMapper.convertValue(geometry, Map.class));
                routeData.put("isGreenest", false);
                routeData.put("description", "Route Option " + i);

                results.add(routeData);
                i++;
            }
        } catch (Exception e) {
            System.err.println("OSRM request failed for " + idPrefix + ": " + e.getMessage());
        }
        return results;
    }

    private List<double[]> extractSamplePoints(JsonNode geometry, int numSamples) {
        List<double[]> allPoints = new ArrayList<>();
        JsonNode coordinates = geometry.path("coordinates");

        for (JsonNode coord : coordinates) {
            double lon = coord.get(0).asDouble();
            double lat = coord.get(1).asDouble();
            allPoints.add(new double[]{lat, lon});
        }

        if (allPoints.size() <= numSamples) {
            return allPoints;
        }

        List<double[]> sampled = new ArrayList<>();
        int step = allPoints.size() / numSamples;
        for (int i = 0; i < allPoints.size(); i += step) {
            sampled.add(allPoints.get(i));
        }
        sampled.add(allPoints.get(allPoints.size() - 1));
        return sampled;
    }

    @SuppressWarnings("unchecked")
    private List<Double> fetchElevations(List<double[]> points) {
        List<Map<String, Double>> locations = new ArrayList<>();
        for (double[] p : points) {
            Map<String, Double> loc = new HashMap<>();
            loc.put("latitude", p[0]);
            loc.put("longitude", p[1]);
            locations.add(loc);
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("locations", locations);

        ResponseEntity<Map> response = restTemplate.postForEntity(ELEVATION_API_URL, requestBody, Map.class);

        List<Double> elevations = new ArrayList<>();
        List<Map<String, Object>> results = (List<Map<String, Object>>) response.getBody().get("results");
        for (Map<String, Object> result : results) {
            elevations.add(((Number) result.get("elevation")).doubleValue());
        }
        return elevations;
    }

    private double calculateGradientDegrees(List<Double> elevations, double routeDistanceMeters) {
        if (elevations.size() < 2 || routeDistanceMeters <= 0) {
            return 1.0;
        }

        double totalElevationChange = 0;
        for (int i = 1; i < elevations.size(); i++) {
            totalElevationChange += Math.abs(elevations.get(i) - elevations.get(i - 1));
        }

        double gradeRatio = totalElevationChange / routeDistanceMeters;
        return Math.toDegrees(Math.atan(gradeRatio));
    }

    private double fetchCo2Prediction(double weight, double gradient, double distanceKm) {
    Map<String, Double> payload = new HashMap<>();
    payload.put("vehicle_weight_kg", weight);
    payload.put("road_gradient_deg", gradient);
    payload.put("distance_km", distanceKm);

    ResponseEntity<Map> response = restTemplate.postForEntity(ML_API_URL, payload, Map.class);

    if (response.getBody() != null && response.getBody().containsKey("projected_co2_g")) {
        return ((Number) response.getBody().get("projected_co2_g")).doubleValue();
    }
    return 0.0;
}
}