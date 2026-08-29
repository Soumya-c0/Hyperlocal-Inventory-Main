import CarbonMetrics from '../../components/CarbonMetrics';
import OrderManifest from '../../components/OrderManifest';
import MapViewer from '../../components/MapViewer';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Map */}
                <div className="lg:col-span-2 h-[600px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <MapViewer />
                </div>
                
                {/* Right Column: Data Elements */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <CarbonMetrics />
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-grow">
                        <OrderManifest />
                    </div>
                </div>
            </div>
        </div>
    );
}