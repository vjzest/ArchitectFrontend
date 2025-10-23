import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ProfessionalSidebar from "./ProfessionalSidebar";
import Navbar from "@/components/Navbar";
import { Menu } from "lucide-react"; // Menu icon import karein

const ProfessionalLayout = () => {
  // NAYA CODE: Sidebar ko mobile par kholne/band karne ke liye state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-80px)] relative md:static">
        {/* BADLAV: Sidebar ko state pass karein */}
        <ProfessionalSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto bg-soft-teal w-full">
          {/* NAYA CODE: Mobile par dikhne wala Header aur Menu button */}
          <header className="md:hidden sticky top-0 bg-white shadow-sm z-10 p-4 flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-700"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 ml-4">
              Professional Panel
            </h2>
          </header>

          <main className="p-6 md:p-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ProfessionalLayout;
