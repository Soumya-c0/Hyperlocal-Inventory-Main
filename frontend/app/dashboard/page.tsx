"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '../../store/dashboardStore';
import CarbonMetrics from '../../components/CarbonMetrics';
import OrderManifest from '../../components/OrderManifest';

// Dynamically import the map to prevent Server-Side Rendering (SSR) issues with Leaflet
const MapViewer = dynamic(() => import('../../components/MapViewer'), { ssr: false });

export default function Dashboard() {
    useEffect(() => {
        const { setOrders, setCarbonSavedTotal, updateCourierLocation } = useDashboardStore.getState();
        
        // 1 & 3. Inject Active Dispatch Manifest & Connect to Inventory SKUs
        setOrders([
            { orderId: 1042, status: 'DISPATCHED', inventorySku: { skuId: 1, name: 'Industrial Router AX', category: 'Hardware', weightKg: 2.5, stockLevel: 44 } },
            { orderId: 1043, status: 'DISPATCHED', inventorySku: { skuId: 2, name: 'Copper Wiring 50m', category: 'Hardware', weightKg: 12.0, stockLevel: 15 } },
            { orderId: 1044, status: 'PENDING', inventorySku: { skuId: 3, name: 'Server Rack Mounts', category: 'Infrastructure', weightKg: 8.2, stockLevel: 8 } }
        ]);

        // 2. Inject Carbon Emissions KPI
        setCarbonSavedTotal(1452.85);

        // 3. Inject Live Courier GPS Locations around Hyderabad
        updateCourierLocation({ courierId: 'C-492', lat: 17.445, lon: 78.385 });
        updateCourierLocation({ courierId: 'C-118', lat: 17.435, lon: 78.375 });
        updateCourierLocation({ courierId: 'C-077', lat: 17.439, lon: 78.388 });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Manager Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
                {/* Left Column: Spatial Map */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                    <MapViewer />
                </div>

                {/* Right Column: KPIs and Manifests */}
                <div className="flex flex-col gap-6 overflow-y-auto">
                    <CarbonMetrics />
                    <OrderManifest />
                    
                    {/* 4. Warehouse Stock Component */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-800 mb-4">Warehouse Stock (Downtown Hub)</h3>
                        <ul className="flex flex-col gap-3">
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Industrial Router AX</span>
                                <span className="font-medium text-emerald-600">44 units</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Copper Wiring 50m</span>
                                <span className="font-medium text-amber-500">15 units</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Server Rack Mounts</span>
                                <span className="font-medium text-red-500">8 units</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}