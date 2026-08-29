"use client";

import dynamic from 'next/dynamic';

// Dynamically import the Leaflet map and force SSR to false
const DynamicMap = dynamic(() => import('./DynamicMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400 mb-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-slate-500 font-medium">Loading Map Tiles...</p>
            </div>
        </div>
    )
});

export default function MapViewer() {
    return (
        <div className="w-full h-full relative z-0">
            <DynamicMap />
        </div>
    );
}