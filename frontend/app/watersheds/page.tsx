import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import WatershedsContent from "../components/WatershedsContent";

export default function WatershedsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <WatershedsContent />
        </main>
      </div>
    </div>
  );
}

