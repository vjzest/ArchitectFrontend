import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedStat from "./AnimatedStat";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const slides = [
  {
    image: "/b11.jpg",
    alt: "Modern white house with a lawn",
  },
  {
    image: "/b12.jpg",
    alt: "Classic house with a beautiful garden",
  },
  {
    image: "/b13.jpg",
    alt: "Luxurious apartment building exterior",
  },
  {
    image: "/b14.jpg",
    alt: "Luxurious apartment building Interior",
  },
];

// Fixed categories list
const CATEGORIES = [
  "Modern Home Design",
  "Duplex House Plans",
  "Single Storey House Plan",
  "Bungalow / Villa House Plans",
  "Apartment / Flat Plans",
  "Farmhouse",
  "Cottage Plans",
  "Row House / Twin House Plans",
  "Village House Plans",
  "Contemporary / Modern House Plans",
  "Colonial / Heritage House Plans",
  "Classic House Plan",
  "Kerala House Plans",
  "Kashmiri House Plan",
  "Marriage Garden",
  "Hospitals",
  "Shops and Showrooms",
  "Highway Resorts and Hotels",
  "Schools and Colleges Plans",
  "Temple & Mosque",
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const searchContainerRef = useRef(null);

  const { products, listStatus } = useSelector(
    (state: RootState) => state.products
  );

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (listStatus === "idle") {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, listStatus]);

  // --- START: Live Search Logic ---
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = products
        .filter(
          (product) =>
            product.plotSize &&
            product.plotSize.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
        .slice(0, 5); // Show top 5 suggestions
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products]);

  // Click outside handler to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);
  // --- END: Live Search Logic ---

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    // Use selectedCategory if available, otherwise it can be ignored
    if (selectedCategory) queryParams.append("category", selectedCategory);
    if (searchTerm) queryParams.append("search", searchTerm);
    setSuggestions([]); // Close suggestions on search
    navigate(`/products?${queryParams.toString()}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.plotSize);
    setSuggestions([]);
    navigate(`/products?search=${suggestion.plotSize}`);
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] md:h-screen md:min-h-[700px] flex items-center justify-center text-white overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={currentSlide}
            src={slides[currentSlide].image}
            alt={slides[currentSlide].alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 animate-slide-up">
          Find Your Perfect
          <span
            className="block text-white animate-bounce-in"
            style={{ animationDelay: "0.3s" }}
          >
            House Plan
          </span>
        </h1>
        <p
          className="text-lg md:text-xl mb-8 text-white/90 font-light animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          Discover amazing architectural designs for your dream home
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-8"
        >
          <Link to="/products">
            <Button size="lg" className="btn-primary px-10 py-6 text-lg">
              Explore The Plans
            </Button>
          </Link>
        </motion.div>

        {/* --- Responsive Search Bar --- */}
        <div
          ref={searchContainerRef}
          className="bg-white rounded-2xl p-3 sm:p-4 shadow-large max-w-2xl w-full mx-auto animate-scale-in relative"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1">
              <Select
                onValueChange={setSelectedCategory}
                disabled={listStatus === "loading"}
              >
                <SelectTrigger className="w-full text-primary-gray border-0 focus:ring-2 focus:ring-primary transition-all duration-300 hover:bg-primary/5">
                  <SelectValue
                    placeholder={
                      listStatus === "loading"
                        ? "Loading..."
                        : "Select Category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 relative">
              <Input
                placeholder="Search by plot size e.g., 21x"
                className="border-0 focus:ring-2 focus:ring-primary text-primary-gray transition-all duration-300 hover:bg-primary/5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />
              {/* --- Suggestions Dropdown --- */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-20 text-left"
                  >
                    <ul className="py-2">
                      {suggestions.map((s) => (
                        <li
                          key={s._id}
                          className="px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-100"
                          onClick={() => handleSuggestionClick(s)}
                        >
                          {s.plotSize} -{" "}
                          <span className="text-sm text-gray-500">
                            {s.name}
                          </span>
                        </li>
                      ))}
                      <li
                        className="px-4 py-3 cursor-pointer text-primary font-semibold hover:bg-gray-100 border-t"
                        onClick={handleSearch}
                      >
                        See all results for "{searchTerm}"
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              className="btn-primary w-full sm:w-auto sm:px-8 group"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5 sm:mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>
        </div>

        {/* --- Animated Stats (UPDATED) --- */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-lg mx-auto">
          <AnimatedStat end={1000} suffix="+" label="House Plans" />
          <AnimatedStat end={1000} suffix="+" label="Happy Customers" />
          <AnimatedStat end={10} suffix="+" label="Years Experience" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
