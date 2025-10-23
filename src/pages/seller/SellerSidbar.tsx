import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Box,
  PlusCircle,
  UserCircle,
  LogOut,
  X,
  ChevronDown,
  Briefcase, // Import kiya hua hai, acchi baat hai
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/features/users/userSlice";
import { RootState } from "@/lib/store";

const mainLinks = [
  { name: "Dashboard", path: "/seller", icon: LayoutDashboard },
  { name: "Profile", path: "/seller/profile", icon: UserCircle },
];

const productLinks = [
  { name: "My Products", path: "/seller/products", icon: Box },
  { name: "Add New", path: "/seller/products/add", icon: PlusCircle },
];

// <<< YAHAN BADLAAV KIYA GAYA HAI >>>
// 'requestLinks' variable ko yahan define kiya gaya hai
const requestLinks = [
  { name: "All Enquiries", path: "/seller/inquiries", icon: Briefcase }, // 'enquiries' ko 'inquiries' kar diya hai
];
// <<< BADLAAV KHATAM >>>

const SellerSidebar = ({ isOpen, setIsOpen }) => {
  const [openMenus, setOpenMenus] = useState({
    products: true,
    requests: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const baseLinkClasses =
    "flex items-center w-full p-3 rounded-md transition-colors duration-200 text-sm";
  const inactiveClasses = "text-gray-300 hover:bg-slate-700 hover:text-white";
  const activeClasses = "bg-orange-600 text-white font-semibold shadow-lg";

  const renderNavLink = (link) => (
    <NavLink
      key={link.name}
      to={link.path}
      end={link.path === "/seller"}
      className={({ isActive }) =>
        `${baseLinkClasses} my-1 ${isActive ? activeClasses : inactiveClasses}`
      }
      onClick={() => setIsOpen(false)}
    >
      <link.icon className="h-5 w-5 mr-3" />
      <span>{link.name}</span>
    </NavLink>
  );

  const renderSubMenu = (title, icon, menuKey, links) => (
    <div className="mt-2">
      <button
        onClick={() => toggleMenu(menuKey)}
        className={`${baseLinkClasses} ${inactiveClasses} justify-between`}
      >
        <div className="flex items-center">
          {React.createElement(icon, { className: "h-5 w-5 mr-3" })}
          <span>{title}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            openMenus[menuKey] ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {openMenus[menuKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4 border-l-2 border-slate-700 ml-3"
          >
            {links.map(renderNavLink)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white p-4 shadow-2xl flex flex-col z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
          <Link to="/seller">
            <h1 className="text-2xl font-bold text-white">Seller Panel</h1>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-grow overflow-y-auto pr-2">
          {mainLinks.map(renderNavLink)}

          {/* Maine yahan se "All Enquiries" ko hata diya hai, kyunki woh ab submenu mein hai */}

          {renderSubMenu("Products", Box, "products", productLinks)}

          {/* Ab yeh line theek se kaam karegi */}
          {renderSubMenu(
            "Enquiries", // Naam chhota kar diya
            Building,
            "requests",
            requestLinks
          )}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-700">
          {userInfo && (
            <div className="p-3 mb-2 rounded-md bg-slate-700/50">
              <div className="flex items-center">
                <UserCircle className="h-8 w-8 mr-3 text-orange-400" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-sm leading-tight">
                    {userInfo.name || userInfo.businessName}
                  </span>
                  <span className="text-xs text-gray-400">Seller</span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;
