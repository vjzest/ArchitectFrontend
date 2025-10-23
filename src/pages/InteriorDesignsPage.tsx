import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { RootState, AppDispatch } from "@/lib/store";
import {
  Loader2,
  ServerCrash,
  Download,
  Filter,
  Heart,
  ChevronLeft,
  ChevronRight,
  Lock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/use-toast";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import house3 from "@/assets/house-3.jpg";
import useDebounce from "@/hooks/useDebounce";
import { useCurrency } from "@/contexts/CurrencyContext"; // Currency Context जोड़ा गया
import DisplayPrice from "@/components/DisplayPrice"; // DisplayPrice कंपोनेंट जोड़ा गया

const themes = [
  "Modern Theme",
  "Contemporary Theme",
  "Minimalist Theme",
  "Traditional Theme",
  "Industrial Theme",
  "Bohemian (Boho) Theme",
  "Scandinavian Theme",
  "Rustic Theme",
  "Transitional Theme",
  "Eclectic Theme",
];

const FilterSidebar = ({ filters, setFilters, isOpen, onClose }: any) => (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </AnimatePresence>
    <motion.aside
      initial={false}
      animate={{
        x: isOpen ? 0 : "-100%",
      }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-fit
        w-80 sm:w-96 lg:w-full
        p-4 sm:p-6 bg-white rounded-none lg:rounded-xl 
        shadow-2xl lg:shadow-lg border-r lg:border border-gray-200 
        z-50 lg:z-auto overflow-y-auto
        lg:top-24
      `}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Close filters"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
        <Filter className="w-5 h-5 mr-2 text-gray-500" />
        Filters
      </h3>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label
            htmlFor="theme"
            className="font-semibold text-gray-600 text-sm sm:text-base"
          >
            Theme
          </Label>
          <Select
            value={filters.theme}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, theme: value }))
            }
          >
            <SelectTrigger
              id="theme"
              className="mt-2 bg-gray-100 border-transparent h-11 sm:h-12"
            >
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Themes</SelectItem>
              {themes.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor="roomType"
            className="font-semibold text-gray-600 text-sm sm:text-base"
          >
            Room Type
          </Label>
          <Select
            value={filters.roomType}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, roomType: value }))
            }
          >
            <SelectTrigger
              id="roomType"
              className="mt-2 bg-gray-100 border-transparent h-11 sm:h-12"
            >
              <SelectValue placeholder="Select Room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              <SelectItem value="Kitchen">Kitchen</SelectItem>
              <SelectItem value="Bedroom">Bedroom</SelectItem>
              <SelectItem value="Living Room">Living Room</SelectItem>
              <SelectItem value="Bathroom">Bathroom</SelectItem>
              <SelectItem value="Dining Room">Dining Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor="propertyType"
            className="font-semibold text-gray-600 text-sm sm:text-base"
          >
            Property Type
          </Label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, propertyType: value }))
            }
          >
            <SelectTrigger
              id="propertyType"
              className="mt-2 bg-gray-100 border-transparent h-11 sm:h-12"
            >
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-semibold text-gray-600 text-sm sm:text-base">
            Budget: ₹{filters.budget[0].toLocaleString()} - ₹
            {filters.budget[1].toLocaleString()}
          </Label>
          <Slider
            value={filters.budget}
            onValueChange={(value) =>
              setFilters((prev: any) => ({
                ...prev,
                budget: value as [number, number],
              }))
            }
            max={50000}
            min={500}
            step={100}
            className="mt-3"
          />
        </div>
        <Button
          onClick={() => {
            setFilters({
              theme: "all",
              category: "all",
              roomType: "all",
              propertyType: "all",
              budget: [500, 50000],
            });
            onClose?.();
          }}
          variant="outline"
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </motion.aside>
  </>
);

const ProductCard = ({ product, userOrders }: any) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { symbol, rate } = useCurrency(); // Currency हुक जोड़ा गया

  const isWishlisted = isInWishlist(product._id);
  const productName =
    product.name || product.planName || product.Name || "Interior Design";
  const linkTo =
    product.source === "admin"
      ? `/product/${product._id}`
      : `/professional-plan/${product._id}`;
  const hasPurchased = userOrders?.some(
    (order: any) =>
      order.isPaid &&
      order.orderItems?.some(
        (item: any) =>
          item.productId === product._id || item.productId?._id === product._id
      )
  );

  const handleDownload = async () => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to download.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    if (!hasPurchased) {
      toast({
        title: "Not Purchased",
        description: "Please purchase this plan to download it.",
        variant: "destructive",
      });
      navigate(linkTo);
      return;
    }
    const planFileUrl =
      (Array.isArray(product.planFile)
        ? product.planFile[0]
        : product.planFile) || product["Download 1 URL"];
    if (!planFileUrl) {
      toast({
        title: "Error",
        description: "No downloadable file found.",
        variant: "destructive",
      });
      return;
    }
    try {
      toast({ title: "Success", description: "Your download is starting..." });
      const response = await fetch(planFileUrl);
      if (!response.ok) throw new Error("Network response was not ok.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileExtension =
        planFileUrl.split(".").pop()?.split("?")[0] || "pdf";
      a.download = `Interior-${productName.replace(/\s+/g, "-")}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Error",
        description: "Failed to download the file.",
        variant: "destructive",
      });
    }
  };

  const regularPrice = product.price || product["Regular price"] || 0;
  const salePrice = product.salePrice || product["Sale price"] || 0;
  const isSale = salePrice > 0 && salePrice < regularPrice;
  const displayPrice = isSale ? salePrice : regularPrice;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative p-2">
        <Link to={linkTo}>
          <img
            src={
              product.mainImage ||
              product.image ||
              product.Images?.split(",")[0] ||
              house3
            }
            alt={productName}
            className="w-full h-40 sm:h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {isSale && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-red-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-md shadow">
            Sale!
          </div>
        )}
        {hasPurchased && (
          <div className="absolute top-2 right-12 sm:right-14 bg-green-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-md z-10">
            Purchased
          </div>
        )}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              if (!userInfo) {
                toast({
                  title: "Login Required",
                  description: "Please log in to add items to your wishlist.",
                  variant: "destructive",
                });
                navigate("/login");
                return;
              }
              isWishlisted
                ? removeFromWishlist(product._id)
                : addToWishlist(product);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500 scale-110" : "text-gray-600 hover:text-red-500 hover:scale-110"}`}
            aria-label="Toggle Wishlist"
          >
            <Heart
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="py-2">
            <p className="text-xs text-gray-500">Style</p>
            <p className="font-bold text-sm sm:text-base text-gray-800 truncate">
              {product.style || product.category || "N/A"}
            </p>
          </div>
          <div className="bg-teal-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Room Type</p>
            <p className="font-bold text-sm sm:text-base text-gray-800 truncate">
              {product.roomType || product.size || "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4 pt-2">
        <p className="text-xs text-gray-500 uppercase">
          {Array.isArray(product.category)
            ? product.category[0]
            : product.category || "Interior Design"}
        </p>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-1 truncate">
          {productName}
        </h3>
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          {isSale && (
            <s className="text-sm sm:text-md text-gray-400">
              <DisplayPrice inrPrice={regularPrice} />
            </s>
          )}
          <span className="text-lg sm:text-xl font-bold text-gray-800">
            <DisplayPrice inrPrice={displayPrice} />
          </span>
          {isSale &&
            parseFloat(String(regularPrice)) > 0 &&
            parseFloat(String(displayPrice)) > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                SAVE {symbol}
                {(
                  (parseFloat(String(regularPrice)) -
                    parseFloat(String(displayPrice))) *
                  rate
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
        </div>
      </div>
      <div className="p-3 sm:p-4 pt-2 mt-auto grid grid-cols-1 gap-2">
        <Link to={linkTo}>
          <Button
            variant="outline"
            className="w-full text-sm sm:text-base bg-gray-800 text-white hover:bg-gray-700 py-2"
          >
            Read more
          </Button>
        </Link>
        <Button
          className={`w-full text-sm sm:text-base text-white rounded-md py-2 ${hasPurchased ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-400 cursor-not-allowed"}`}
          onClick={handleDownload}
          disabled={!hasPurchased}
        >
          {hasPurchased ? (
            <>
              <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Download PDF
            </>
          ) : (
            <>
              <Lock className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Purchase to Download
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const InteriorDesignsPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    products: adminProducts,
    count: adminCount,
    pages: adminPages,
    listStatus: adminListStatus,
    error: adminError,
  } = useSelector((state: RootState) => state.products);
  const {
    plans: professionalPlans,
    listStatus: profListStatus,
    error: profError,
  } = useSelector((state: RootState) => state.professionalPlans);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.orders);

  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    theme: "all",
    category: "all",
    roomType: "all",
    propertyType: "all",
    budget: [500, 50000] as [number, number],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jumpToPage, setJumpToPage] = useState("");
  const CARDS_PER_PAGE = 6;

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const params: any = {
      pageNumber: currentPage,
      limit: CARDS_PER_PAGE,
      planCategory: "interior-designs",
    };
    if (debouncedFilters.theme !== "all") params.theme = debouncedFilters.theme;
    if (debouncedFilters.roomType !== "all")
      params.roomType = debouncedFilters.roomType;
    if (debouncedFilters.propertyType !== "all")
      params.propertyType = debouncedFilters.propertyType;
    if (sortBy !== "newest") params.sortBy = sortBy;
    if (
      debouncedFilters.budget[0] !== 500 ||
      debouncedFilters.budget[1] !== 50000
    ) {
      params.budget = `${debouncedFilters.budget[0]}-${debouncedFilters.budget[1]}`;
    }
    dispatch(fetchProducts(params));
    dispatch(fetchAllApprovedPlans(params));
    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, userInfo, currentPage, debouncedFilters, sortBy]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedFilters, sortBy]);

  const combinedProducts = useMemo(
    () => [
      ...(Array.isArray(adminProducts)
        ? adminProducts.map((p) => ({ ...p, source: "admin" }))
        : []),
      ...(Array.isArray(professionalPlans)
        ? professionalPlans.map((p) => ({ ...p, source: "professional" }))
        : []),
    ],
    [adminProducts, professionalPlans]
  );

  const totalCount = adminCount || 0;
  const totalPages = adminPages > 0 ? adminPages : 1;

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";
  const isError = adminListStatus === "failed" || profListStatus === "failed";
  const errorMessage = String(adminError || profError || "An error occurred.");

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Readymade Interior Designs | Modern Home Interiors Online</title>
        <meta
          name="description"
          content="Explore readymade interior designs for living rooms, bedrooms, kitchens, and offices. Modern, stylish, and affordable interiors tailored for every home."
        />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
          <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              isOpen={true}
              onClose={() => {}}
            />
          </div>

          <div className="lg:hidden">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
              <div className="w-full sm:w-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Interior Design Plans
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Showing {combinedProducts.length} of {totalCount} results
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex-1 sm:flex-initial"
                  variant="outline"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <div className="flex-1 sm:flex-initial sm:w-48">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Sort by latest</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center h-64 sm:h-96">
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-orange-500" />
              </div>
            )}

            {isError && (
              <div className="text-center py-12 sm:py-20">
                <ServerCrash className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
                <h3 className="mt-4 text-lg sm:text-xl font-semibold text-red-500">
                  Failed to Load Interior Designs
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-500 px-4">
                  {errorMessage}
                </p>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                >
                  {combinedProducts.length > 0 ? (
                    combinedProducts.map((product) => (
                      <ProductCard
                        key={`${product.source}-${product._id}`}
                        product={product}
                        userOrders={orders}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 sm:py-20 px-4">
                      <h3 className="text-lg sm:text-xl font-semibold">
                        No Interior Designs Found
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-gray-500">
                        Try adjusting your filters to see more results.
                      </p>
                    </div>
                  )}
                </motion.div>

                {totalPages > 1 && (
                  <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-3 sm:gap-4 px-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="text-sm sm:text-base"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <span className="font-medium text-sm sm:text-base">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="text-sm sm:text-base"
                    >
                      Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>

                    <form
                      onSubmit={handlePageJump}
                      className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      <Input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={jumpToPage}
                        onChange={(e) => setJumpToPage(e.target.value)}
                        placeholder="Page #"
                        className="w-24 h-10 text-sm"
                        aria-label="Jump to page"
                      />
                      <Button type="submit" variant="outline" className="h-10">
                        Go
                      </Button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InteriorDesignsPage;
