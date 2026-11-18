import type { Metadata } from "next";
import "./globals.css";
import { WatershedProvider } from "./context/WatershedContext";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";

export const metadata: Metadata = {
  title: "GeoWatershed · Spatial Intelligence Platform",
  description: "Advanced watershed monitoring, GIS analysis, hydrological modeling and spatial intelligence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className="h-full antialiased"
        style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      >
        <AuthProvider>
          <WatershedProvider>
            {children}
            <AuthModal />
          </WatershedProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
