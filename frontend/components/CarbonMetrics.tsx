"use client";

import { useDashboardStore } from '../store/dashboardStore';

export default function CarbonMetrics() {
    // Subscribing to the Zustand store
    const carbonSavedTotal = useDashboardStore((state) => state.carbonSavedTotal);

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-700">Emissions Saved</h2>
            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-green-600">
                    {carbonSavedTotal.toFixed(2)}
                </span>
                <span className="text-gray-500 font-medium">grams CO2e</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Calculated via ML route optimization</p>
        </div>
    );
}