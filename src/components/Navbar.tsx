import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import WishlistPanel from "@/components/WishlistPanel";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { logout } from "@/lib/features/users/userSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const { state: cartState } = useCart();
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.user);

  // <<< BADLAAV 1: 'seller' ko allowed roles ki list mein add karein >>>
  const isUserAllowed =
    userInfo &&
    ["user", "admin", "professional", "seller"].includes(userInfo.role);
  // <<< BADLAAV KHATAM >>>

  const showCartAndWishlist = !userInfo || userInfo?.role === "user";

  const getDashboardPath = () => {
    if (!userInfo) return "/login"; // Guard clause for safety
    switch (userInfo.role) {
      // <<< BADLAAV 2: Seller ke liye dashboard ka path add karein >>>
      case "seller":
        return "/seller";
      // <<< BADLAAV KHATAM >>>
      case "professional":
        return "/professional";
      case "admin":
        return "/admin";
      default:
        return "/dashboard";
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow =
      isMenuOpen || isWishlistOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen, isWishlistOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Ready Made House Plan", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "Career", path: "/careers" },
    { name: "Download", path: "/download" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // <<< BADLAAV 3: Seller ka naam (businessName) handle karne ke liye >>>
  const displayName = userInfo?.name || userInfo?.businessName || "User";
  const avatarFallback = displayName.charAt(0).toUpperCase();
  // <<< BADLAAV KHATAM >>>

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? "bg-white/95 shadow-md backdrop-blur-lg" : "bg-white"}`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo1.png"
                alt="ArchHome Logo"
                className="h-16 w-auto relative"
              />
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium relative transition-colors duration-300 group ${isActive(link.path) ? "text-orange-600" : "text-gray-600 hover:text-orange-600"}`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-[-4px] left-0 w-full h-0.5 bg-orange-500 transition-transform duration-300 origin-center ${isActive(link.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  ></span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center">
              <div className="hidden lg:flex items-center space-x-5">
                <button className="text-gray-600 hover:text-orange-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                {showCartAndWishlist && (
                  <>
                    <button
                      onClick={() => setIsWishlistOpen(true)}
                      className="relative text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      {wishlistItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {wishlistItems.length}
                        </span>
                      )}
                    </button>
                    <Link
                      to="/cart"
                      className="relative text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cartState.items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {cartState.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                {isUserAllowed ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2">
                        <Avatar className="w-9 h-9 border-2 border-orange-500">
                          <AvatarFallback className="bg-orange-500 text-white font-bold">
                            {avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-700">
                          {displayName}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link to={getDashboardPath()}>
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login">
                      <Button className="bg-orange-500 hover:bg-orange-600 rounded-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        variant="outline"
                        className="rounded-full border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="text-gray-600"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 z-[60] bg-white w-full max-w-sm p-6 lg:hidden flex flex-col shadow-xl"
            >
              <div className="flex justify-between items-center mb-8 flex-shrink-0">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                  ArchHome
                </Link>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="w-7 h-7 text-gray-600" />
                </button>
              </div>
              <nav className="flex-grow overflow-y-auto pr-2">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`text-xl font-medium p-4 rounded-lg transition-colors ${isActive(link.path) ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-100"}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="border-t pt-6 mt-4 flex-shrink-0">
                {isUserAllowed ? (
                  <div className="flex items-center justify-between">
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="w-10 h-10 border-2 border-orange-500">
                        <AvatarFallback className="bg-orange-500 text-white font-bold">
                          {avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-gray-800">
                        {displayName}
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                    >
                      <LogOut className="w-6 h-6" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 py-3 text-base">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        variant="outline"
                        className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 py-3 text-base"
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <WishlistPanel
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
};

export default Navbar;
