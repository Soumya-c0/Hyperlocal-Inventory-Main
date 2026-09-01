"use client";

import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function CourierMap({ start, end, routeGeometry }: { start: [number, number], end: [number, number], routeGeometry: any }) {
    const center: [number, number] = [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2
    ];

    return (
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <Marker position={start}><Popup>Main Warehouse (Start)</Popup></Marker>
            <Marker position={end}><Popup>Local Hub (Destination)</Popup></Marker>

            {/* If a route is selected, Leaflet natively renders the OSRM street path */}
            {routeGeometry && (
                <GeoJSON 
                    key={JSON.stringify(routeGeometry)} // Forces map refresh when route changes
                    data={routeGeometry} 
                    style={{ color: '#3b82f6', weight: 6, opacity: 0.7 }} 
                />
            )}
        </MapContainer>
    );
}