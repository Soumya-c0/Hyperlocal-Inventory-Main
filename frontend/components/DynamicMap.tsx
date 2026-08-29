"use client";

import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons failing to load in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DynamicMap() {
    // Hyderabad bounding box center based on our OpenStreetMap ingestion
    const centerPosition: [number, number] = [17.44, 78.38];
    
    // Static polygon representing the Downtown Hub territory
    const warehouseTerritory: [number, number][] = [
        [17.442, 78.382],
        [17.442, 78.378],
        [17.438, 78.378],
        [17.438, 78.382]
    ];

    return (
        <MapContainer center={centerPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Polygon positions={warehouseTerritory} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }}>
                <Popup>
                    <strong>Downtown Hub</strong><br/>
                    Capacity: 5000 units
                </Popup>
            </Polygon>

            <Marker position={[17.44, 78.38]}>
                <Popup>Courier C-492<br/>Status: DISPATCHED</Popup>
            </Marker>
        </MapContainer>
    );
}