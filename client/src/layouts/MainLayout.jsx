import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "./ScrollToTop";
export default function MainLayout(){
    return (
      <div className="min-h-screen flex flex-col" style={{ "--nav-h": "72px" }}>
        <ScrollToTop />
        <Navbar />
        <main className="flex-1 pt-[var(--nav-h)]">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
}