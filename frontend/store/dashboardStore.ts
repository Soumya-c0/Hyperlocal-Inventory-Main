import { create } from 'zustand';

export interface InventorySku {
    skuId: number;
    name: string;
    category: string;
    weightKg: number;
    stockLevel: number;
}

export interface ActiveOrder {
    orderId: number;
    status: string;
    inventorySku: InventorySku;
}

export interface CourierLocation {
    courierId: string;
    lat: number;
    lon: number;
}

export interface ActiveCourier {
    courierId: string;
    assignedOrderId: number | null;
    currentWeightKg: number;
}

interface DashboardState {
    orders: ActiveOrder[];
    courierLocations: Record<string, CourierLocation>;
    carbonSavedTotal: number;
    activeCourier: ActiveCourier;
    
    setOrders: (orders: ActiveOrder[]) => void;
    updateCourierLocation: (location: CourierLocation) => void;
    setCarbonSavedTotal: (total: number) => void;
    deductCourierPayload: (weightToRemove: number) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    orders: [],
    courierLocations: {},
    carbonSavedTotal: 0,
    
    // Hardcoded dummy session for UI testing
    activeCourier: {
        courierId: "C-492",
        assignedOrderId: 1,
        currentWeightKg: 6.5
    },
    
    setOrders: (orders) => set({ orders }),
    
    updateCourierLocation: (location) => 
        set((state) => ({
            courierLocations: { 
                ...state.courierLocations, 
                [location.courierId]: location 
            }
        })),
        
    setCarbonSavedTotal: (carbonSavedTotal) => set({ carbonSavedTotal }),
    
    deductCourierPayload: (weightToRemove) =>
        set((state) => ({
            activeCourier: {
                ...state.activeCourier,
                currentWeightKg: Math.max(0, state.activeCourier.currentWeightKg - weightToRemove)
            }
        })),
}));