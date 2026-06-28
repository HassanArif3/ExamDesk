import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-blue-200 selection:text-blue-900 relative">
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center overflow-hidden bg-slate-50">
        {/* Subtle animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_30%,transparent_100%)] animate-grid-fade"></div>
        {/* Subtle glowing orbs with float animation */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 blur-[120px] mix-blend-multiply animate-orb-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/20 blur-[120px] mix-blend-multiply animate-orb-float-delayed"></div>
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-200/20 blur-[120px] mix-blend-multiply animate-orb-float"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main 
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </div>
  );
}
