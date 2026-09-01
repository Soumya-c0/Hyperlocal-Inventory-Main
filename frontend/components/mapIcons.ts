import L from 'leaflet';

function createWarehouseIcon(color: string) {
    return L.divIcon({
        className: '',
        html: `
            <div style="
                background: ${color};
                width: 34px; height: 34px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.35);
                display: flex; align-items: center; justify-content: center;
            ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" transform="rotate(45deg)">
                    <path d="M3 21V9l9-6 9 6v12h-6v-7H9v7H3z"/>
                </svg>
            </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
    });
}

export const mainWarehouseIcon = createWarehouseIcon('#f97316');  // orange
export const localWarehouseIcon = createWarehouseIcon('#3b82f6'); // blue