import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  ServerCrash,
  Filter,
  Heart,
  Download,
  Lock,
  ChevronLeft,
  ChevronRight,
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
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import house1 from "@/assets/house-1.jpg";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { RootState, AppDispatch } from "@/lib/store";
import useDebounce from "@/hooks/useDebounce";
import { useCurrency } from "@/contexts/CurrencyContext"; // Currency Context जोड़ा गया
import DisplayPrice from "@/components/DisplayPrice"; // DisplayPrice कंपोनेंट जोड़ा गया

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

const FilterSidebar = ({ filters, setFilters }: any) => (
  <aside className="w-full lg:w-1/4 xl:w-1/5 p-6 bg-white rounded-xl shadow-lg h-fit border border-gray-200 sticky top-24">
    <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
      <Filter className="w-5 h-5 mr-2 text-gray-500" />
      Filters
    </h3>
    <div className="space-y-6">
      <div>
        <Label htmlFor="plotSize" className="font-semibold text-gray-600">
          Plot Size
        </Label>
        <Select
          value={filters.plotSize}
          onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, plotSize: value }))
          }
        >
          <SelectTrigger
            id="plotSize"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
            <SelectValue placeholder="Select Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            <SelectItem value="30x40">30x40</SelectItem>
            <SelectItem value="40x60">40x60</SelectItem>
            <SelectItem value="50x80">50x80</SelectItem>
            <SelectItem value="29x36">29x36</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="plotArea" className="font-semibold text-gray-600">
          Plot Area (sqft)
        </Label>
        <Select
          value={filters.plotArea}
          onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, plotArea: value }))
          }
        >
          <SelectTrigger
            id="plotArea"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
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
        <Label htmlFor="bhk" className="font-semibold text-gray-600">
          Rooms (BHK)
        </Label>
        <Select
          value={filters.bhk}
          onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, bhk: value }))
          }
        >
          <SelectTrigger
            id="bhk"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
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
        <Label htmlFor="direction" className="font-semibold text-gray-600">
          Direction
        </Label>
        <Select
          value={filters.direction}
          onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, direction: value }))
          }
        >
          <SelectTrigger
            id="direction"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
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
        <Label htmlFor="floors" className="font-semibold text-gray-600">
          Floors
        </Label>
        <Select
          value={filters.floors}
          onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, floors: value }))
          }
        >
          <SelectTrigger
            id="floors"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
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
        <Label htmlFor="propertyType" className="font-semibold text-gray-600">
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
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Rental">Rental</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="font-semibold text-gray-600">
          Budget: ₹{filters.budget[0].toLocaleString()} - ₹
          {filters.budget[1].toLocaleString()}
        </Label>
        <Slider
          value={filters.budget}
          onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, budget: value }))
          }
          max={100000}
          min={500}
          step={500}
          className="mt-3"
        />
      </div>
      <Button
        onClick={() =>
          setFilters({
            plotArea: "all",
            plotSize: "all",
            bhk: "all",
            direction: "all",
            floors: "all",
            propertyType: "all",
            budget: [500, 100000],
          })
        }
        variant="outline"
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  </aside>
);

const ProductCard = ({ plan, userOrders }: any) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { toast } = useToast();
  const { symbol, rate } = useCurrency(); // Currency हुक जोड़ा गया

  const productName =
    plan.name || plan.planName || plan.Name || "Untitled Plan";
  const linkTo = `/product/${slugify(productName)}-${plan._id}`;
  const mainImage =
    plan.mainImage || plan.Images?.split(",")[0].trim() || house1;
  const plotSize = plan.plotSize || plan["Attribute 1 value(s)"] || "N/A";
  const plotArea =
    plan.plotArea ||
    (plan["Attribute 2 value(s)"]
      ? parseInt(String(plan["Attribute 2 value(s)"]).replace(/[^0-9]/g, ""))
      : "N/A");
  const rooms = plan.rooms || plan["Attribute 3 value(s)"] || "N/A";
  const direction = plan.direction || plan["Attribute 4 value(s)"] || "N/A";
  const floors = plan.floors || plan["Attribute 5 value(s)"] || "N/A";
  const regularPrice =
    (plan.price > 0 ? plan.price : plan["Regular price"]) ?? 0;
  const salePrice =
    (plan.salePrice > 0 ? plan.salePrice : plan["Sale price"]) ?? null;
  const isSale =
    salePrice !== null &&
    parseFloat(String(salePrice)) > 0 &&
    parseFloat(String(salePrice)) < parseFloat(String(regularPrice));
  const displayPrice = isSale ? salePrice : regularPrice;
  const category =
    (Array.isArray(plan.category) ? plan.category[0] : plan.category) ||
    plan.Categories?.split(",")[0].trim() ||
    "House Plan";
  const city = plan.city
    ? Array.isArray(plan.city)
      ? plan.city.join(", ")
      : plan.city
    : null;
  const isWishlisted = isInWishlist(plan._id);

  const hasPurchased = useMemo(() => {
    if (!userInfo || !userOrders || userOrders.length === 0) return false;
    return userOrders.some(
      (order: any) =>
        order.isPaid &&
        order.orderItems?.some(
          (item: any) => (item.productId?._id || item.productId) === plan._id
        )
    );
  }, [userOrders, userInfo, plan._id]);

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
      productId: plan._id,
      name: productName,
      price: regularPrice,
      salePrice: salePrice,
      image: mainImage,
      size: plotSize,
    };
    if (isWishlisted) {
      removeFromWishlist(plan._id);
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
        title: "Purchase Required",
        description: "Please purchase this plan to download it.",
        variant: "destructive",
      });
      navigate(linkTo);
      return;
    }
    const fileToDownload =
      (Array.isArray(plan.planFile) ? plan.planFile[0] : plan.planFile) ||
      plan["Download 1 URL"];
    if (!fileToDownload) {
      toast({
        title: "Error",
        description: "No downloadable file found for this product.",
        variant: "destructive",
      });
      return;
    }
    try {
      toast({
        title: "Success",
        description: "Your download is starting...",
      });
      const link = document.createElement("a");
      link.href = fileToDownload;
      const fileExtension =
        fileToDownload.split(".").pop()?.split("?")[0] || "pdf";
      const fileName = `ArchHome-${productName.replace(/\s+/g, "-")}.${fileExtension}`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative p-2">
        <Link to={linkTo}>
          <div className="aspect-square w-full bg-gray-100 rounded-md overflow-hidden">
            <img
              src={mainImage}
              alt={productName}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-2 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs font-bold px-4 py-2 rounded-md shadow-lg text-center">
            <p>{plotSize}</p>
            <p className="text-xs font-normal">
              {hasPurchased ? "Download now" : "Purchase to download"}
            </p>
          </div>
        </Link>
        {isSale && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow">
            Sale!
          </div>
        )}
        {hasPurchased && (
          <div className="absolute top-2 right-12 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
            Purchased
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500 scale-110" : "text-gray-600 hover:text-red-500 hover:scale-110"}`}
            aria-label="Toggle Wishlist"
          >
            <Heart
              className="w-5 h-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-3 gap-2 border-t text-center text-sm">
        <div>
          <p className="text-xs text-gray-500">Plot Area</p>
          <p className="font-bold">{plotArea} sqft</p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Rooms</p>
          <p className="font-bold">{rooms}</p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Bathrooms</p>
          <p className="font-bold">{plan.bathrooms || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Kitchen</p>
          <p className="font-bold">{plan.kitchen || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Floors</p>
          <p className="font-bold">{floors}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Direction</p>
          <p className="font-bold">{direction}</p>
        </div>
      </div>
      <div className="p-4 border-t">
        <p className="text-xs text-gray-500 uppercase">{category}</p>
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          {plan.productNo && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">Product No:</span>
              <span>{plan.productNo}</span>
            </div>
          )}
          {city && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">City:</span>
              <span className="text-right font-bold text-teal-700">{city}</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-teal-800 mt-1 truncate">
          {productName}
        </h3>
        {/* --- Price Display Section Updated --- */}
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          {isSale && parseFloat(String(regularPrice)) > 0 && (
            <s className="text-md text-gray-400">
              <DisplayPrice inrPrice={parseFloat(String(regularPrice))} />
            </s>
          )}
          <span className="text-xl font-bold text-gray-800">
            <DisplayPrice inrPrice={parseFloat(String(displayPrice))} />
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
      <div className="p-4 pt-0 mt-auto space-y-2">
        <Link to={linkTo}>
          <Button
            variant="outline"
            className="w-full bg-gray-800 text-white hover:bg-gray-700"
          >
            Read more
          </Button>
        </Link>
        <Button
          className={`w-full text-white rounded-md ${hasPurchased ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-400 cursor-not-allowed"}`}
          onClick={handleDownload}
          disabled={!hasPurchased}
        >
          {hasPurchased ? (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Purchase to Download
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const ThreeDPlansPage = () => {
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

  const [filters, setFilters] = useState({
    plotArea: "all",
    plotSize: "all",
    bhk: "all",
    direction: "all",
    floors: "all",
    propertyType: "all",
    budget: [500, 100000] as [number, number],
  });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState("");

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const params: any = {
      pageNumber: currentPage,
      limit: 12,
      planCategory: "elevations",
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
      debouncedFilters.budget[0] !== 500 ||
      debouncedFilters.budget[1] !== 100000
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
  const errorMessage = String(adminError || profError);
  const pageTitle = "Floor Plans + 3D Elevation";

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo(0, 0);
    }
    setJumpToPage("");
  };

  return (
    <div className="bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6 border-b pb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {pageTitle}
                </h1>
                <p className="text-gray-500 text-sm">
                  Showing {combinedProducts.length} of {totalCount} results on
                  page {currentPage} of {totalPages}
                </p>
              </div>
              <div className="w-full sm:w-48">
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
            {isLoading && (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
              </div>
            )}
            {isError && (
              <div className="text-center py-20">
                <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-xl font-semibold text-red-500">
                  Failed to Load Plans
                </h3>
                <p className="mt-2 text-gray-500">{errorMessage}</p>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                {combinedProducts.length === 0 ? (
                  <div className="text-center py-20">
                    <h3 className="text-xl font-semibold">No Plans Found</h3>
                    <p className="mt-2 text-gray-500">
                      Try adjusting your filters to see more results.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {combinedProducts.map((plan) => (
                      <ProductCard
                        key={`${plan.source}-${plan._id}`}
                        plan={plan}
                        userOrders={orders}
                      />
                    ))}
                  </motion.div>
                )}

                {totalPages > 1 && (
                  <div className="mt-12 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <span className="font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
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
                        placeholder="Go to..."
                        className="w-24 h-10"
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

export default ThreeDPlansPage;
