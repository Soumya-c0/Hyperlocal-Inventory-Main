"use client";

import { useDashboardStore } from '../store/dashboardStore';

export default function OrderManifest() {
    // Subscribing to the active orders array
    const orders = useDashboardStore((state) => state.orders);

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Active Dispatch Manifest</h2>
            
            <div className="overflow-y-auto flex-grow">
                {orders.length === 0 ? (
                    <p className="text-gray-500 text-sm">No active orders in the queue.</p>
                ) : (
                    <ul className="space-y-3">
                        {orders.map((order) => (
                            <li key={order.orderId} className="p-3 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-sm text-gray-900">Order #{order.orderId}</p>
                                    <p className="text-xs text-gray-500">{order.inventorySku.name} ({order.inventorySku.weightKg}kg)</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'DISPATCHED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {order.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}