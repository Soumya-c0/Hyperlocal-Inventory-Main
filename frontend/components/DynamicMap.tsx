"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDashboardStore } from '../store/dashboardStore';
import { mainWarehouseIcon, localWarehouseIcon } from './mapIcons';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DynamicMap() {
    const courierLocations = useDashboardStore((state) => state.courierLocations);

    const centerPosition: [number, number] = [17.442, 78.368];
    const mainWarehousePos: [number, number] = [17.445, 78.355];
    const localWarehousePos: [number, number] = [17.440, 78.380];
    const deliveryRadiusMeters = 3000;

    return (
        <MapContainer center={centerPosition} zoom={14} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={mainWarehousePos} icon={mainWarehouseIcon}>
                <Popup><strong>Main Warehouse</strong><br/>Gachibowli Hub</Popup>
            </Marker>

            <Marker position={localWarehousePos} icon={localWarehouseIcon}>
                <Popup><strong>Local Warehouse</strong><br/>Mindspace Downtown</Popup>
            </Marker>

            <Circle
                center={localWarehousePos}
                radius={deliveryRadiusMeters}
                pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.12,
                    weight: 2,
                    dashArray: '6, 6',
                }}
            >
                <Tooltip direction="top" permanent opacity={0.9}>
                    Local Delivery Zone (~3km)
                </Tooltip>
            </Circle>

            {Object.values(courierLocations).map((courier) => (
                <Marker key={courier.courierId} position={[courier.lat, courier.lon]}>
                    <Popup>Courier: {courier.courierId}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}