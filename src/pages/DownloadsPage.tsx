import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Heart,
  Download,
  Loader2,
  ServerCrash,
  X,
  Youtube,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Lock,
} from "lucide-react";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWishlist } from "@/contexts/WishlistContext";
import house3 from "@/assets/house-3.jpg";
import { toast } from "sonner";
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

const ProductCard = ({ product, userOrders }: any) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { symbol, rate } = useCurrency();

  const productName = product.name || product.Name || "Untitled Download";
  const linkTo = `/product/${slugify(productName)}-${product._id}`;
  const mainImage =
    product.mainImage || product.Images?.split(",")[0].trim() || house3;

  // --- सभी फ़ील्ड्स को यहाँ जोड़ा गया है ---
  const plotSize = product.plotSize || "N/A";
  const plotArea = product.plotArea || "N/A";
  const rooms = product.rooms || "N/A";
  const bathrooms = product.bathrooms || "N/A";
  const kitchen = product.kitchen || "N/A";
  const floors = product.floors || "N/A";
  const direction = product.direction || "N/A";

  const regularPrice =
    (product.price > 0 ? product.price : product["Regular price"]) ?? 0;
  const salePrice =
    (product.salePrice > 0 ? product.salePrice : product["Sale price"]) ?? null;
  const isSale =
    salePrice !== null &&
    parseFloat(String(salePrice)) > 0 &&
    parseFloat(String(salePrice)) < parseFloat(String(regularPrice));
  const displayPrice = isSale ? salePrice : regularPrice;

  const isWishlisted = isInWishlist(product._id);

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
      toast.error("Please log in to add items to your wishlist.");
      navigate("/login");
      return;
    }
    const productForWishlist = {
      productId: product._id,
      name: productName,
      price: regularPrice,
      salePrice: salePrice,
      image: mainImage,
    };
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(productForWishlist);
    }
  };

  const handleDownload = async () => {
    if (!userInfo) {
      toast.error("Please log in to download.");
      navigate("/login");
      return;
    }
    if (!hasPurchased) {
      toast.error("Please purchase this item to download it.");
      navigate(linkTo);
      return;
    }
    const fileToDownload =
      (Array.isArray(product.planFile)
        ? product.planFile[0]
        : product.planFile) || product["Download 1 URL"];
    if (!fileToDownload) {
      toast.error("No downloadable file found for this product.");
      return;
    }
    try {
      toast.success("Your download is starting...");
      const link = document.createElement("a");
      link.href = fileToDownload;
      const fileExtension =
        fileToDownload.split(".").pop()?.split("?")[0] || "zip";
      const fileName = `Download-${productName.replace(/\s+/g, "-")}.${fileExtension}`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download the file.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative p-2">
        <Link to={linkTo}>
          <div className="aspect-square w-full bg-gray-100 rounded-md overflow-hidden">
            <img
              src={mainImage}
              alt={productName}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
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

      {/* --- यहाँ नया स्पेसिफिकेशन ग्रिड जोड़ा गया है --- */}
      <div className="p-4 grid grid-cols-3 gap-2 border-t text-center text-sm">
        <div>
          <p className="text-xs text-gray-500">Plot Area</p>
          <p className="font-bold">
            {plotArea} {plotArea !== "N/A" && "sqft"}
          </p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Rooms</p>
          <p className="font-bold">{rooms}</p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Bathrooms</p>
          <p className="font-bold">{bathrooms}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Kitchen</p>
          <p className="font-bold">{kitchen}</p>
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
        <p className="text-xs text-gray-500 uppercase">
          {product.category?.[0] || "Download"}
        </p>
        <h3
          className="text-lg font-bold text-gray-800 mt-1 truncate"
          title={productName}
        >
          {productName}
        </h3>
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          {isSale && parseFloat(String(regularPrice)) > 0 && (
            <s className="text-md text-gray-400">
              <DisplayPrice inrPrice={parseFloat(String(regularPrice))} />
            </s>
          )}
          <span className="text-xl font-bold text-gray-800">
            <DisplayPrice inrPrice={parseFloat(String(displayPrice))} />
          </span>
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto space-y-2">
        <Link to={linkTo}>
          <Button
            variant="outline"
            className="w-full bg-gray-800 text-white hover:bg-gray-700"
          >
            View Details
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
              Download Now
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Purchase to Download
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const DownloadsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const pageQuery = Number(searchParams.get("page")) || 1;

  const { products, pages, count, listStatus, error } = useSelector(
    (state: RootState) => state.products
  );

  const { orders: userOrders } = useSelector(
    (state: RootState) => state.orders
  );

  const [currentPage, setCurrentPage] = useState(pageQuery);
  const [jumpToPage, setJumpToPage] = useState("");
  const CARDS_PER_PAGE = 12;

  useEffect(() => {
    const apiParams = {
      pageNumber: currentPage,
      limit: CARDS_PER_PAGE,
      planCategory: "downloads",
    };

    dispatch(fetchProducts(apiParams));

    if (userInfo) {
      dispatch(fetchMyOrders());
    }

    const searchParamsToSet = new URLSearchParams();
    if (currentPage > 1) searchParamsToSet.set("page", String(currentPage));
    setSearchParams(searchParamsToSet, { replace: true });
  }, [dispatch, userInfo, currentPage, setSearchParams]);

  const totalPages = pages > 0 ? pages : 1;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(jumpToPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    } else {
      toast.error(`Please enter a page number between 1 and ${totalPages}.`);
    }
    setJumpToPage("");
  };

  const isLoading = listStatus === "loading";
  const isError = listStatus === "failed";
  const errorMessage = String(error);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Downloads | READYMADE HOME DESIGNS</title>
        <meta
          name="description"
          content="Browse and download exclusive digital products, including CAD files, 3D models, and more."
        />
      </Helmet>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Digital Downloads</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Get exclusive digital assets for your projects.
          </p>
        </div>

        <div className="w-full">
          {isLoading && (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            </div>
          )}
          {isError && (
            <div className="text-center py-20">
              <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-xl font-semibold text-red-500">
                Failed to Load Downloads
              </h3>
              <p className="mt-2 text-gray-500">{errorMessage}</p>
            </div>
          )}
          {!isLoading && !isError && products.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold">No Downloads Found</h3>
              <p className="mt-2 text-gray-500">
                We are constantly adding new digital products. Check back soon!
              </p>
            </div>
          )}

          {!isLoading && !isError && products.length > 0 && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  userOrders={userOrders}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>

              <form
                onSubmit={handleJumpToPage}
                className="flex items-center gap-2"
              >
                <Input
                  type="number"
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  placeholder="Go to..."
                  className="w-24 h-10"
                  min="1"
                  max={totalPages}
                />
                <Button type="submit">Go</Button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DownloadsPage;
