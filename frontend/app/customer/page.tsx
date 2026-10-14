"use client";
import { useState } from 'react';

const PRODUCTS = [
  { id: 'sku-001', name: 'Industrial Router AX', weight: 2.5, price: 12000 },
  { id: 'sku-002', name: 'Copper Wiring 50m', weight: 12.0, price: 4500 },
  { id: 'sku-003', name: 'Server Rack Mounts', weight: 8.2, price: 8900 },
  { id: 'sku-004', name: 'Smart Hub Controller', weight: 1.1, price: 3200 },
  { id: 'sku-005', name: 'Fiber Optic Cable 20m', weight: 3.0, price: 2100 },
  { id: 'sku-006', name: 'Backup Power Supply', weight: 15.0, price: 18500 }
];

const LOCATIONS = [
  { id: 'P-101', address: 'Mindspace IT Park', partner: 'Ramesh', link: '/courier' },
  { id: 'P-102', address: 'Kothaguda Junction', partner: 'Suresh', link: '/courier/p102' },
  { id: 'P-103', address: 'KBR Park Entrance', partner: 'Mahesh', link: '/courier/p103' }
];

export default function CustomerDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [checkoutState, setCheckoutState] = useState<'idle' | 'locking' | 'processing' | 'success'>('idle');

  // Step 1: Location Gatekeeper
  if (!selectedLocation) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
          <h1 className="text-2xl font-black text-slate-800 mb-2">Hyperlocal Tech</h1>
          <p className="text-slate-500 mb-6">Select your delivery zone to check live inventory availability.</p>
          
          <div className="space-y-3">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className="w-full text-left p-4 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="font-bold text-slate-700">{loc.address}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Store & Checkout Flow
  const addToCart = (product: any) => setCart((prev) => [...prev, product]);
  const cartWeight = cart.reduce((sum, item) => sum + item.weight, 0);

  const handleCheckout = () => {
    setCheckoutState('locking');
    // Simulate Redis SETNX Distributed Lock
    setTimeout(() => {
      setCheckoutState('processing');
      // Simulate PostgreSQL Commit
      setTimeout(() => {
        setCheckoutState('success');
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="mb-8 border-b pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Hyperlocal Tech Store</h1>
          <p className="text-emerald-600 font-medium flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Delivering to: {selectedLocation.address}
          </p>
        </div>
        <button 
          onClick={() => { setSelectedLocation(null); setCart([]); setCheckoutState('idle'); }}
          className="text-sm text-slate-500 hover:text-slate-800 underline"
        >
          Change Location
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRODUCTS.map(product => (
            <div key={product.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="font-bold text-slate-800">{product.name}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  <span className="font-mono bg-slate-100 px-2 py-1 rounded">{product.weight} kg</span> • ₹{product.price}
                </p>
              </div>
              <button 
                onClick={() => addToCart(product)} 
                disabled={checkoutState !== 'idle'}
                className="bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* Cart & Checkout Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Your Cart</h2>
          
          {cart.length === 0 ? (
            <p className="text-slate-400 text-sm">Cart is empty.</p>
          ) : (
            <>
              <ul className="mb-4 space-y-3">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm items-center">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="font-bold text-slate-900">₹{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-3 mb-6 flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                <span className="text-sm font-semibold text-slate-600">Total Payload:</span>
                <span className="font-mono font-bold text-blue-600">{cartWeight.toFixed(1)} kg</span>
              </div>
            </>
          )}

          {checkoutState === 'idle' && cart.length > 0 && (
            <button onClick={handleCheckout} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition">
              Checkout & Dispatch
            </button>
          )}

          {checkoutState === 'locking' && (
            <div className="w-full bg-amber-50 text-amber-800 py-4 rounded-xl text-center text-sm font-mono border border-amber-200 flex flex-col gap-2">
              <span className="animate-spin text-xl">⚙️</span>
              [Redis] Acquiring SETNX Lock...
            </div>
          )}

          {checkoutState === 'processing' && (
            <div className="w-full bg-blue-50 text-blue-800 py-4 rounded-xl text-center text-sm font-mono border border-blue-200 flex flex-col gap-2">
              <span className="animate-bounce text-xl">💾</span>
              [PostgreSQL] Committing Order...
            </div>
          )}

          {checkoutState === 'success' && (
            <div className="w-full bg-emerald-50 p-5 rounded-xl border border-emerald-200 text-center mt-4">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="text-emerald-900 font-bold text-lg mb-1">Order Dispatched!</h3>
              <p className="text-sm text-emerald-700 mb-5">
                Assigned to: <strong>{selectedLocation.partner}</strong>
              </p>
              
              {/* This opens the CORRECT courier dashboard and passes the EXACT cart weight */}
              <a 
                href={`${selectedLocation.link}?weight=${cartWeight}`} 
                target="_blank" 
                rel="noreferrer"
                className="block text-sm bg-slate-900 text-white px-4 py-3 rounded-lg w-full font-bold hover:bg-slate-800 shadow-md transition"
              >
                Track Live Telemetry ➔
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}