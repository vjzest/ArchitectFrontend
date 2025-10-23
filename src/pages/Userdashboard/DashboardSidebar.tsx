// src/components/DashboardSidebar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  ShoppingCart,
  Download,
  User,
  LogOut,
  X,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { logout } from "@/lib/features/users/userSlice";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { name: "My Orders", path: "orders", icon: ShoppingCart },
  { name: "My Downloads", path: "downloads", icon: Download },
  { name: "Account Details", path: "account-details", icon: User },
];

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate("/login");
  };

  const baseClasses =
    "w-full flex items-center p-3.5 rounded-lg text-sm font-semibold transition-all duration-300";
  const activeClasses =
    "bg-orange-500 text-white shadow-lg shadow-orange-500/30";
  const inactiveClasses = "text-gray-600 hover:bg-orange-500 hover:text-white";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ✨ FIX: Updated classes for sticky positioning on desktop ✨ */}
      <aside
        className={`fixed top-0 left-0 h-full p-6 bg-white shadow-2xl flex flex-col z-40
                   w-72 transition-transform duration-300 ease-in-out
                   md:sticky md:top-28 md:h-[calc(100vh-8.5rem)] md:translate-x-0 md:shadow-lg md:rounded-xl
                   ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between text-center mb-8 border-b pb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Hello, {userInfo?.name || "User"}
            </h2>
            <p className="text-sm text-gray-500 truncate">{userInfo?.email}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-800"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col space-y-3 flex-grow overflow-y-auto pr-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t">
          <button
            onClick={handleLogout}
            className={`${baseClasses} text-red-600 font-bold hover:bg-red-500 hover:text-white`}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
