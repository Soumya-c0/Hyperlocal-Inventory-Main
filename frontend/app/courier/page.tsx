"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically load the Courier Map to prevent SSR Leaflet errors
const CourierMap = dynamic(() => import('../../components/CourierMap'), { ssr: false });

export default function CourierDashboard() {
    const [routes, setRoutes] = useState<any[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
    const [slaTimer, setSlaTimer] = useState<number>(0);
    const [deliveryStatus, setDeliveryStatus] = useState<'PENDING' | 'EN_ROUTE' | 'DELIVERED'>('PENDING');
    const [emissionsSaved, setEmissionsSaved] = useState<number | null>(null);

    // Hardcoded dispatch parameters to feed the routing engine
    const dispatchParams = {
        weight: 6050, // 6000kg van + 50kg server rack
        startLat: 17.445, startLon: 78.355, // Main Warehouse (Gachibowli)
        endLat: 17.440, endLon: 78.380      // Local Warehouse (Mindspace)
    };

    // Fetch live routes from Java Spring Boot on load
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
                const url = `${API_BASE}/api/routing/options?weight=${dispatchParams.weight}&startLat=${dispatchParams.startLat}&startLon=${dispatchParams.startLon}&endLat=${dispatchParams.endLat}&endLon=${dispatchParams.endLon}`;
                const res = await fetch(url);
                const data = await res.json();
                setRoutes(data);
            } catch (error) {
                console.error("Failed to fetch routes from Java backend:", error);
            }
        };
        fetchRoutes();
    }, []);

    // SLA Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (deliveryStatus === 'EN_ROUTE' && slaTimer > 0) {
            interval = setInterval(() => setSlaTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [deliveryStatus, slaTimer]);

    const handleRouteSelection = (route: any) => {
        setSelectedRoute(route);
        setSlaTimer(route.estimatedTimeMins * 60);
        setDeliveryStatus('EN_ROUTE');
    };

    const handleConfirmDropoff = () => {
    setDeliveryStatus('DELIVERED');
    const standardRoute = routes.reduce((worst, r) => (r.projectedCo2 > worst.projectedCo2 ? r : worst), routes[0]);
    const savings = Math.max(0, standardRoute.projectedCo2 - selectedRoute.projectedCo2);
    setEmissionsSaved(savings);
    };

    const formatTime = (sec: number) => `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;

    return (
        <div className="min-h-screen bg-slate-100 p-4 flex flex-col md:flex-row gap-6">
            
            {/* Left Side: Map UI visualizing the GeoJSON */}
            <div className="w-full md:w-2/3 h-[50vh] md:h-[90vh] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                <CourierMap 
                    start={[dispatchParams.startLat, dispatchParams.startLon]}
                    end={[dispatchParams.endLat, dispatchParams.endLon]}
                    routeGeometry={selectedRoute?.geometry || null}
                />
            </div>

            {/* Right Side: Interaction Panel */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-slate-900 text-white p-5 rounded-xl text-center">
                    <h1 className="text-xl font-bold">Active Assignment</h1>
                    <p className="text-sm text-slate-300">Gachibowli ➔ Mindspace</p>
                    <p className="text-xs text-slate-400 mt-1">Payload: 50.0 kg</p>
                </div>

                {deliveryStatus === 'PENDING' && (
                    <div className="flex flex-col gap-3">
                        <h2 className="font-semibold text-slate-700">Select OSRM Route</h2>
                        {routes.length === 0 ? <p className="text-sm text-slate-500">Loading live ML routes...</p> : null}
                        
                        {routes.map((route) => (
                            <div key={route.routeId} onClick={() => handleRouteSelection(route)}
                                className={`border-2 rounded-xl p-4 cursor-pointer ${route.isGreenest ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-slate-800">{route.description}</h3>
                                    {route.isGreenest && <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">ECO</span>}
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 mt-2">
                                    <span>{route.distanceKm} km • {route.estimatedTimeMins} min</span>
                                    <span className={route.isGreenest ? 'text-emerald-700 font-bold' : ''}>{route.projectedCo2}g CO2</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {deliveryStatus === 'EN_ROUTE' && (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
                        <h2 className="text-slate-500 font-medium">SLA Countdown</h2>
                        <div className={`text-5xl font-black tabular-nums my-4 ${slaTimer < 300 ? 'text-red-500' : 'text-slate-800'}`}>
                            {formatTime(slaTimer)}
                        </div>
                        <button onClick={handleConfirmDropoff} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg text-lg">
                            Confirm Drop-Off
                        </button>
                    </div>
                )}

                {deliveryStatus === 'DELIVERED' && (
                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
                        <h2 className="text-2xl font-bold text-emerald-800 mb-2">Delivery Complete</h2>
                        <div className="bg-white rounded-xl p-4 mt-4 shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-600 mb-1">XGBoost ML Savings</h3>
                            <div className="text-3xl font-black text-emerald-600">{emissionsSaved?.toFixed(1)}g CO2e</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}