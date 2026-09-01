"use client";

import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDashboardStore } from '../store/dashboardStore';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DynamicMap() {
    const courierLocations = useDashboardStore((state) => state.courierLocations);
    
    const centerPosition: [number, number] = [17.442, 78.368]; // Centered between both hubs

    // 1. Main Warehouse Boundary (Gachibowli)
    const mainWarehouseTerritory: [number, number][] = [
        [17.447, 78.357], [17.447, 78.353], [17.443, 78.353], [17.443, 78.357]
    ];

    // 2. Local Warehouse Boundary (Mindspace)
    const localWarehouseTerritory: [number, number][] = [
        [17.442, 78.382], [17.442, 78.378], [17.438, 78.378], [17.438, 78.382]
    ];

    return (
        <MapContainer center={centerPosition} zoom={14} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Render Main Warehouse (Orange) */}
            <Polygon positions={mainWarehouseTerritory} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.3 }}>
                <Popup><strong>Main Warehouse</strong><br/>Gachibowli Hub</Popup>
            </Polygon>

            {/* Render Local Warehouse (Blue) */}
            <Polygon positions={localWarehouseTerritory} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.3 }}>
                <Popup><strong>Local Warehouse</strong><br/>Mindspace Downtown</Popup>
            </Polygon>

            {Object.values(courierLocations).map((courier) => (
                <Marker key={courier.courierId} position={[courier.lat, courier.lon]}>
                    <Popup>Courier: {courier.courierId}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}