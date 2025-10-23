// src/layouts/DashboardLayout.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* --- Sidebar --- */}
          {/* This wrapper ensures the sidebar takes up space in the flex layout on desktop, but is also ready for mobile */}
          <div className="md:w-64 lg:w-72 md:shrink-0">
            <DashboardSidebar
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
            />
          </div>

          {/* --- Main Content Area --- */}
          <div className="flex-1 w-full min-w-0">
            {" "}
            {/* min-w-0 is important for flex-shrink */}
            {/* Mobile Header with Menu Button */}
            <header className="md:hidden bg-white p-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">My Account</h2>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 hover:text-orange-500"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </header>
            {/* This div contains the main page content */}
            <main className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full min-h-full">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
