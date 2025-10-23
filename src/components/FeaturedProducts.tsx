import React, { useEffect, useMemo, useRef, useState } from "react"; // ++ ADD useState ++
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Download,
  Loader2,
  ServerCrash,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Lock,
  X, // ++ ADD X icon for modal close button ++
} from "lucide-react";
import YouTube from "react-youtube"; // ++ ADD YouTube component ++
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product, fetchProducts } from "@/lib/features/products/productSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { useToast } from "@/components/ui/use-toast";
import house3 from "@/assets/house-3.jpg";
import { useCurrency } from "@/contexts/CurrencyContext";
import DisplayPrice from "@/components/DisplayPrice";

// --- START: SLUGIFY FUNCTION ---
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

// --- START: HELPER FUNCTION TO GET YOUTUBE ID FROM URL ---
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// --- START: VIDEO MODAL COMPONENT ---
const VideoModal = ({
  videoId,
  onClose,
}: {
  videoId: string | null;
  onClose: () => void;
}) => {
  if (!videoId) return null;
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: { autoplay: 1, controls: 1 },
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 z-10"
          aria-label="Close video player"
        >
          <X size={24} />
        </button>
        <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
      </div>
    </div>
  );
};
// --- END: VIDEO MODAL COMPONENT ---

const FeaturedProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { symbol, rate } = useCurrency();

  // ++ ADD STATE FOR VIDEO MODAL ++
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const { products, listStatus, error } = useSelector(
    (state: RootState) => state.products
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts({}));
    }
    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, products.length, userInfo]);

  const featuredProducts = useMemo(() => {
    const sortedProducts = (Array.isArray(products) ? products : [])
      .slice()
      .sort((a, b) => {
        const numA = Number(String(a.productNo).replace(/[^0-9]/g, ""));
        const numB = Number(String(b.productNo).replace(/[^0-9]/g, ""));
        return numB - numA;
      });
    return sortedProducts.slice(0, 8);
  }, [products]);

  const purchasedProductIds = useMemo(() => {
    if (!userInfo || !Array.isArray(orders)) return new Set();
    const paidItems = orders
      .filter((order) => order.isPaid)
      .flatMap((order) => order.orderItems);
    return new Set(
      paidItems.map((item) => item.productId?._id || item.productId)
    );
  }, [orders, userInfo]);

  const handleDownload = async (product: Product) => {
    /* Download logic... */
  };
  const handleWishlistToggle = (product: Product) => {
    /* Wishlist logic... */
  };
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-background">
      {/* ++ RENDER THE VIDEO MODAL ++ */}
      <VideoModal
        videoId={playingVideoId}
        onClose={() => setPlayingVideoId(null)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-3">
            Featured House Plans
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular designs
          </p>
        </motion.div>

        {listStatus === "loading" && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
        {listStatus === "failed" && (
          <div className="text-center py-12 text-destructive">
            <ServerCrash className="mx-auto h-12 w-12" />
            <p className="mt-4">Failed to load products.</p>
          </div>
        )}

        {listStatus === "succeeded" && (
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card hidden md:flex"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scroll-smooth py-4 -mx-4 px-4"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>{`.flex.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
              <div className="flex gap-8">
                {featuredProducts.map((product: Product, index: number) => {
                  const isWishlisted = isInWishlist(product._id);
                  const hasPurchased = purchasedProductIds.has(product._id);
                  const mainImage =
                    product.mainImage ||
                    product.image ||
                    product.Images?.split(",")[0].trim() ||
                    house3;
                  const productName =
                    product.name || product.Name || "Untitled Plan";
                  const plotSize =
                    product.plotSize ||
                    product["Attribute 1 value(s)"] ||
                    "N/A";
                  const plotArea =
                    product.plotArea ||
                    (product["Attribute 2 value(s)"]
                      ? parseInt(
                          String(product["Attribute 2 value(s)"]).replace(
                            /\D/g,
                            ""
                          )
                        )
                      : "N/A");
                  const rooms =
                    product.rooms || product["Attribute 3 value(s)"] || "N/A";
                  const direction =
                    product.direction ||
                    product["Attribute 4 value(s)"] ||
                    "N/A";

                  const regularPrice =
                    (product.price > 0
                      ? product.price
                      : product["Regular price"]) ?? 0;
                  const salePrice =
                    (product.salePrice > 0
                      ? product.salePrice
                      : product["Sale price"]) ?? null;
                  const isSale =
                    salePrice !== null &&
                    parseFloat(String(salePrice)) > 0 &&
                    parseFloat(String(salePrice)) <
                      parseFloat(String(regularPrice));
                  const displayPrice = isSale ? salePrice : regularPrice;

                  // ++ GET YOUTUBE VIDEO ID FOR THE BUTTON ++
                  const videoId = getYouTubeId(product.youtubeLink);

                  return (
                    <motion.div
                      key={product._id}
                      className="bg-card rounded-2xl overflow-hidden group transition-all duration-300 border-2 border-transparent hover:border-primary hover:shadow-2xl hover:-translate-y-2 flex-shrink-0 w-[320px]"
                      style={{ scrollSnapAlign: "start" }}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="relative border-b bg-muted/20">
                        <Link
                          to={`/product/${slugify(productName)}-${product._id}`}
                          className="block p-4"
                        >
                          <img
                            src={mainImage}
                            alt={productName}
                            className="w-full h-56 object-contain group-hover:scale-105 transition-transform"
                          />
                        </Link>
                        {isSale && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                            Sale!
                          </div>
                        )}
                        {hasPurchased && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                            Purchased
                          </div>
                        )}
                        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleWishlistToggle(product)}
                            className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                              isWishlisted
                                ? "text-red-500 scale-110"
                                : "text-foreground hover:text-primary hover:scale-110"
                            }`}
                            aria-label="Toggle Wishlist"
                          >
                            <Heart
                              className="w-5 h-5"
                              fill={isWishlisted ? "currentColor" : "none"}
                            />
                          </button>
                          {/* ++ FIX: Changed from <a> to <button> to open modal ++ */}
                          {videoId && (
                            <button
                              onClick={() => setPlayingVideoId(videoId)}
                              className="w-9 h-9 bg-red-500/90 rounded-full flex items-center justify-center shadow-sm text-white hover:bg-red-600"
                              aria-label="Watch video"
                            >
                              <Youtube className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="p-4 border-b">
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-gray-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">Area</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {plotArea}
                            </p>
                          </div>
                          <div className="bg-teal-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">BHK</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {rooms}
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">Size</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {plotSize}
                            </p>
                          </div>
                          <div className="bg-orange-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">Facing</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {direction || "Any"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 uppercase font-medium">
                            {Array.isArray(product.category)
                              ? product.category[0]
                              : product.Categories?.split(",")[0] ||
                                product.category}
                          </p>
                          <h3 className="text-xl font-bold text-gray-800 mt-1 truncate">
                            {productName}
                          </h3>
                          <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                            {isSale && parseFloat(String(regularPrice)) > 0 && (
                              <span className="text-sm text-gray-400 line-through">
                                <DisplayPrice
                                  inrPrice={parseFloat(String(regularPrice))}
                                />
                              </span>
                            )}
                            <span className="text-xl font-bold text-gray-900">
                              <DisplayPrice
                                inrPrice={parseFloat(String(displayPrice))}
                              />
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
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to={`/product/${slugify(productName)}-${
                              product._id
                            }`}
                          >
                            <Button
                              size="sm"
                              className="w-full bg-slate-800 text-white hover:bg-slate-700 text-sm h-10"
                            >
                              Read more
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className={`w-full text-white text-sm h-10 ${
                              hasPurchased
                                ? "bg-teal-500 hover:bg-teal-600"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() => handleDownload(product)}
                            disabled={!hasPurchased}
                          >
                            {hasPurchased ? (
                              <>
                                <Download className="mr-2 h-4 w-4" /> PDF
                              </>
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4" /> Download
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card hidden md:flex"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
        <div className="text-center mt-16">
          <Link to="/products">
            <Button size="lg" className="px-10 py-6 text-base btn-primary">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
