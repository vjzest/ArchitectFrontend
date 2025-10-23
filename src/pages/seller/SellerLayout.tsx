// src/layouts/AdminLayout.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SellerSidebar from "./SellerSidbar";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar - always present, state controls visibility on mobile */}
      <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full lg:ml-64">
        {" "}
        {/* Add ml-64 for large screens */}
        {/* Header for Mobile */}
        <header className="lg:hidden sticky top-0 bg-white shadow-sm z-20 p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold ml-4">Admin Dashboard</h1>
        </header>
        {/* Scrollable Main Content */}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
