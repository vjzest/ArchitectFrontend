import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Loader2,
  ServerCrash,
  Filter,
  Heart,
  Download,
  Lock,
  ChevronLeft,
  ChevronRight,
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
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { useWishlist } from "@/contexts/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import house3 from "@/assets/house-3.jpg";
import { useToast } from "@/components/ui/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { useCurrency } from "@/contexts/CurrencyContext";
import DisplayPrice from "@/components/DisplayPrice";

const slugify = (text: any) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const FilterSidebar = ({ filters, setFilters, isOpen, onClose }: any) => (
  <>
    {/* Mobile Overlay */}
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

    {/* Sidebar */}
    <motion.aside
      initial={false}
      animate={{
        x: isOpen ? 0 : "-100%",
      }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-fit
        w-80 sm:w-96 lg:w-full
        p-4 sm:p-6 bg-card rounded-none lg:rounded-xl 
        shadow-2xl lg:shadow-lg border-r lg:border border-border 
        z-50 lg:z-auto overflow-y-auto
        lg:top-24
      `}
    >
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Close filters"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Filter className="w-5 h-5 mr-2" /> Filters
      </h3>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label htmlFor="plotSize" className="text-sm sm:text-base">
            Plot Size
          </Label>
          <Select
            value={filters.plotSize}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, plotSize: value }))
            }
          >
            <SelectTrigger id="plotSize" className="mt-1.5">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="26X45 SQFT">26X45 SQFT</SelectItem>
              <SelectItem value="30x40">30x40</SelectItem>
              <SelectItem value="40x60">40x60</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="plotArea" className="text-sm sm:text-base">
            Plot Area (sqft)
          </Label>
          <Select
            value={filters.plotArea}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, plotArea: value }))
            }
          >
            <SelectTrigger id="plotArea" className="mt-1.5">
              <SelectValue placeholder="Select Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="500-1000">500-1000</SelectItem>
              <SelectItem value="1000-2000">1000-2000</SelectItem>
              <SelectItem value="2000+">2000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm sm:text-base">
            Budget: ₹{filters.budget[0].toLocaleString()} - ₹
            {filters.budget[1].toLocaleString()}
          </Label>
          <Slider
            value={filters.budget}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, budget: value }))
            }
            max={50000}
            min={0}
            step={500}
            className="mt-3"
          />
        </div>
        <div>
          <Label htmlFor="bhk" className="text-sm sm:text-base">
            Rooms (BHK)
          </Label>
          <Select
            value={filters.bhk}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, bhk: value }))
            }
          >
            <SelectTrigger id="bhk" className="mt-1.5">
              <SelectValue placeholder="Select Rooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All BHKs</SelectItem>
              <SelectItem value="1">1 BHK</SelectItem>
              <SelectItem value="2">2 BHK</SelectItem>
              <SelectItem value="3">3 BHK</SelectItem>
              <SelectItem value="4">4+ BHK</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="direction" className="text-sm sm:text-base">
            Direction
          </Label>
          <Select
            value={filters.direction}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, direction: value }))
            }
          >
            <SelectTrigger id="direction" className="mt-1.5">
              <SelectValue placeholder="Select Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Directions</SelectItem>
              <SelectItem value="East">East</SelectItem>
              <SelectItem value="West">West</SelectItem>
              <SelectItem value="North">North</SelectItem>
              <SelectItem value="South">South</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="floors" className="text-sm sm:text-base">
            Floors
          </Label>
          <Select
            value={filters.floors}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, floors: value }))
            }
          >
            <SelectTrigger id="floors" className="mt-1.5">
              <SelectValue placeholder="Select Floors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="propertyType" className="text-sm sm:text-base">
            Property Type
          </Label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, propertyType: value }))
            }
          >
            <SelectTrigger id="propertyType" className="mt-1.5">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => {
            setFilters({
              plotArea: "all",
              plotSize: "all",
              bhk: "all",
              direction: "all",
              floors: "all",
              propertyType: "all",
              budget: [0, 50000],
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

const ProductCard = ({ plan: product, userOrders }: any) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { symbol, rate } = useCurrency();

  const getImageSource = () => {
    const primaryImage = product.mainImage || product.image || product.Images;
    if (primaryImage && typeof primaryImage === "string") {
      return primaryImage.split(",")[0].trim();
    }
    return house3;
  };
  const mainImage = getImageSource();

  const productName =
    product.name || product.planName || product.Name || "Untitled Plan";
  const plotSize = product.plotSize || product["Attribute 1 value(s)"] || "N/A";
  const plotArea =
    product.plotArea ||
    (product["Attribute 2 value(s)"]
      ? parseInt(String(product["Attribute 2 value(s)"]).replace(/[^0-9]/g, ""))
      : "N/A");
  const rooms = product.rooms || product["Attribute 3 value(s)"] || "N/A";
  const bathrooms = product.bathrooms || "N/A";
  const kitchen = product.kitchen || "N/A";

  const regularPrice =
    product.price && product.price > 0
      ? product.price
      : product["Regular price"] &&
          parseFloat(String(product["Regular price"])) > 0
        ? parseFloat(String(product["Regular price"]))
        : 0;

  const salePrice =
    product.salePrice && product.salePrice > 0
      ? product.salePrice
      : product["Sale price"] && parseFloat(String(product["Sale price"])) > 0
        ? parseFloat(String(product["Sale price"]))
        : null;

  const isSale =
    salePrice !== null &&
    salePrice > 0 &&
    regularPrice > 0 &&
    salePrice < regularPrice;

  const displayPrice = isSale ? salePrice : regularPrice;

  const category =
    (Array.isArray(product.category)
      ? product.category[0]
      : product.category) ||
    product.Categories?.split(",")[0].trim() ||
    "House Plan";

  const isWishlisted = isInWishlist(product._id);
  const linkTo = `/product/${slugify(productName)}-${product._id}`;

  const hasPurchased = useMemo(() => {
    if (!userInfo || !userOrders || userOrders.length === 0) return false;
    return userOrders.some(
      (order: any) =>
        order.isPaid &&
        order.orderItems?.some(
          (item: any) => (item.productId?._id || item.productId) === product._id
        )
    );
  }, [userOrders, userInfo, product._id]);

  const handleWishlistToggle = () => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    const productForWishlist = {
      productId: product._id,
      name: productName,
      price: regularPrice,
      salePrice: salePrice,
      image: mainImage,
      size: plotSize,
    };
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(productForWishlist);
    }
  };

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
      a.download = `ArchHome-${productName.replace(/\s+/g, "-")}.${fileExtension}`;
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-card rounded-lg shadow-soft border border-gray-200 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative border-b p-3 sm:p-4">
        <Link to={linkTo}>
          <img
            src={mainImage}
            alt={productName}
            className="w-full h-48 sm:h-56 object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {isSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-md shadow-md z-10">
            Sale!
          </div>
        )}
        {hasPurchased && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-md z-10">
            Purchased
          </div>
        )}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-lg z-10 text-center max-w-[90%]">
          <p className="truncate">{plotSize} House plan</p>
          <p className="text-[10px] sm:text-xs font-normal">
            {hasPurchased ? "Download pdf file" : "Purchase to download"}
          </p>
        </div>
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            className={`w-8 h-8 sm:w-9 sm:h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500 scale-110" : "text-foreground hover:text-primary hover:scale-110"}`}
            aria-label="Toggle Wishlist"
          >
            <Heart
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-4 border-b">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
          <div className="p-2">
            <p className="text-xs sm:text-sm text-gray-500">Plot Area</p>
            <p className="font-semibold text-sm sm:text-base text-gray-800">
              {plotArea} sqft
            </p>
          </div>
          <div className="bg-teal-50 p-2 rounded-md">
            <p className="text-xs sm:text-sm text-gray-500">Rooms</p>
            <p className="font-semibold text-sm sm:text-base text-gray-800">
              {rooms}
            </p>
          </div>
          <div className="bg-teal-50 p-2 rounded-md">
            <p className="text-xs sm:text-sm text-gray-500">Bathrooms</p>
            <p className="font-semibold text-sm sm:text-base text-gray-800">
              {bathrooms}
            </p>
          </div>
          <div className="p-2">
            <p className="text-xs sm:text-sm text-gray-500">Kitchen</p>
            <p className="font-semibold text-sm sm:text-base text-gray-800">
              {kitchen}
            </p>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-gray-500 uppercase">{category}</p>
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mt-1 truncate">
          {productName}
        </h3>
        <div className="flex items-baseline gap-2 mt-2 flex-wrap">
          {isSale && regularPrice > 0 && (
            <s className="text-sm sm:text-md text-gray-500">
              <DisplayPrice inrPrice={regularPrice} />
            </s>
          )}
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            {displayPrice > 0 ? (
              <DisplayPrice inrPrice={displayPrice} />
            ) : (
              "Free"
            )}
          </span>
          {isSale && regularPrice > 0 && displayPrice > 0 && (
            <span className="text-[10px] sm:text-xs bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold">
              SAVE {symbol}
              {((regularPrice - displayPrice) * rate).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          )}
        </div>
        <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-2">
          <Link to={linkTo}>
            <Button className="w-full text-sm sm:text-base bg-slate-800 text-white hover:bg-slate-700 hover:text-white rounded-md py-2">
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
      </div>
    </motion.div>
  );
};

const BrowsePlansPage = () => {
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
    count: profCount,
    pages: profPages,
    listStatus: profListStatus,
    error: profError,
  } = useSelector((state: RootState) => state.professionalPlans);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.orders);

  const [filters, setFilters] = useState({
    plotArea: "all",
    plotSize: "all",
    bhk: "all",
    direction: "all",
    floors: "all",
    propertyType: "all",
    budget: [0, 50000] as [number, number],
  });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jumpToPage, setJumpToPage] = useState("");
  const CARDS_PER_PAGE = 12;

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const params: any = {
      pageNumber: currentPage,
      limit: CARDS_PER_PAGE,
      planCategory: "floor-plans",
    };

    if (debouncedFilters.plotSize !== "all")
      params.plotSize = debouncedFilters.plotSize;
    if (debouncedFilters.plotArea !== "all")
      params.plotArea = debouncedFilters.plotArea;
    if (debouncedFilters.bhk !== "all") params.bhk = debouncedFilters.bhk;
    if (debouncedFilters.direction !== "all")
      params.direction = debouncedFilters.direction;
    if (debouncedFilters.floors !== "all")
      params.floors = debouncedFilters.floors;
    if (debouncedFilters.propertyType !== "all")
      params.propertyType = debouncedFilters.propertyType;
    if (sortBy !== "newest") params.sortBy = sortBy;
    if (
      debouncedFilters.budget[0] !== 0 ||
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

  const totalCount = (adminCount || 0) + (profCount || 0);
  const totalPages = Math.max(adminPages || 1, profPages || 1);

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";
  const isError = adminListStatus === "failed" || profListStatus === "failed";
  const errorMessage = String(adminError || profError);
  const pageTitle = "Floor Plans";

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  return (
    <div className="bg-background min-h-screen">
      <Helmet>
        <title>Floor Plans | 2BHK, 3BHK & Duplex Home Designs</title>
        <meta
          name="description"
          content="Explore modern floor plans including 2BHK, 3BHK, and duplex home designs. Find readymade layouts tailored to your plot size and budget at HousePlanFiles."
        />
      </Helmet>

      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
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
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {pageTitle}
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">
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
                    <SelectTrigger>
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
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
              </div>
            )}

            {isError && (
              <div className="text-center py-12 sm:py-20">
                <ServerCrash className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-destructive" />
                <h3 className="mt-4 text-lg sm:text-xl font-semibold text-destructive">
                  Failed to Load Plans
                </h3>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground px-4">
                  {errorMessage}
                </p>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                {combinedProducts.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                  >
                    {combinedProducts.map((plan) => (
                      <ProductCard
                        key={`${plan.source || "prod"}-${plan._id}`}
                        plan={plan}
                        userOrders={orders}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 sm:py-20 px-4">
                    <h3 className="text-lg sm:text-xl font-semibold">
                      No Plans Found
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                      Try adjusting your filters.
                    </p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-3 sm:gap-4 px-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="text-sm sm:text-base"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <span className="font-medium text-sm sm:text-base text-gray-700">
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
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
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

export default BrowsePlansPage;
