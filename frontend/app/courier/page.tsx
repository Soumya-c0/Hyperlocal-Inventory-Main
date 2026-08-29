"use client";

import { useState, useEffect } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';

export default function CourierView() {
    const activeCourier = useDashboardStore((state) => state.activeCourier);
    const deductCourierPayload = useDashboardStore((state) => state.deductCourierPayload);
    
    const [slaMinutes, setSlaMinutes] = useState(42);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deliveryStatus, setDeliveryStatus] = useState("EN_ROUTE");

    // Decrement the SLA timer every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setSlaMinutes((prev) => (prev > 0 ? prev - 1 : 0));
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const handleDropOff = async () => {
        if (!activeCourier.assignedOrderId) return;
        
        setIsProcessing(true);
        // PASTE YOUR CODESPACE URL HERE
        const BACKEND_URL = "https://reimagined-potato-4jwx74w9p7gxhjxvg-8080.app.github.dev";
        const routeGradient = 8.5; 

        try {
            const response = await fetch(`${BACKEND_URL}/api/orders/${activeCourier.assignedOrderId}/dispatch?gradient=${routeGradient}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                // Deduct weight from local UI state
                deductCourierPayload(6.5); 
                setDeliveryStatus("DELIVERED");
            }
        } catch (error) {
            console.error("Failed to process drop-off:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4">
            <div className="max-w-md mx-auto h-full flex flex-col gap-6 pt-8">
                
                {/* Header Information */}
                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                    <div>
                        <p className="text-slate-400 text-sm">Active Courier</p>
                        <h1 className="text-2xl font-bold">{activeCourier.courierId}</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-sm">Payload Weight</p>
                        <p className="text-2xl font-bold text-blue-400">{activeCourier.currentWeightKg.toFixed(1)} kg</p>
                    </div>
                </div>

                {/* SLA Timer */}
                <div className="bg-slate-800 rounded-2xl p-6 text-center shadow-lg border border-slate-700">
                    <p className="text-slate-400 mb-2 font-medium">Delivery SLA Remaining</p>
                    <div className={`text-6xl font-black ${slaMinutes < 15 ? 'text-red-500' : 'text-emerald-400'}`}>
                        {slaMinutes}<span className="text-2xl font-medium text-slate-500 ml-2">min</span>
                    </div>
                </div>

                {/* Drop-Off Trigger Action */}
                <div className="mt-auto pb-8">
                    {deliveryStatus === "EN_ROUTE" ? (
                        <button 
                            onClick={handleDropOff}
                            disabled={isProcessing}
                            className={`w-full py-5 rounded-xl text-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]
                                ${isProcessing 
                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'}`}
                        >
                            {isProcessing ? 'Processing Ledger...' : 'Confirm Drop-Off'}
                        </button>
                    ) : (
                        <div className="w-full py-5 rounded-xl bg-emerald-900/50 border border-emerald-500/50 text-emerald-400 text-center text-xl font-bold uppercase tracking-wider">
                            Delivery Completed
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}