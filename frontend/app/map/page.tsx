import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MapView from "../components/MapView";
import AuthGuard from "../components/AuthGuard";

export default function MapPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <MapView />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
