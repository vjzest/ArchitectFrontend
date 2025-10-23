import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import {
  Loader2,
  ServerCrash,
  Search,
  Store,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
} from "lucide-react";

import { RootState, AppDispatch } from "@/lib/store";
import { fetchPublicSellerProducts } from "@/lib/features/seller/sellerProductSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/sellerinquiries/sellerinquirySlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- INQUIRY MODAL COMPONENT ---
const InquiryModal = ({ product, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.sellerInquiries
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    message: `I am interested in your product: "${product.name}". Please provide more details.`,
  });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Inquiry sent successfully! The seller will contact you soon."
      );
      dispatch(resetActionStatus());
      onClose();
    }
    if (actionStatus === "failed") {
      toast.error(String(error || "Failed to send inquiry."));
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, onClose]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createInquiry({ ...formData, productId: product._id }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">Send Inquiry</h2>
          <p className="text-gray-500 mt-1">
            For product: <span className="font-semibold">{product.name}</span>
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
            <Button
              type="submit"
              disabled={actionStatus === "loading"}
              className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-base"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send className="mr-2" />
                  Send Inquiry
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- PRODUCT CARD COMPONENT ---
const ProductCard = ({ product, onInquiryClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white rounded-lg overflow-hidden border border-gray-100 flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
  >
    <div className="relative">
      <img
        src={product.image || "https://via.placeholder.com/400x300"}
        alt={product.name}
        className="w-full h-56 object-cover"
      />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">
        {product.category}
      </p>
      <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
        {product.name}
      </h3>
      <div className="mt-auto pt-4">
        <div className="flex items-center gap-3 text-sm text-gray-600 border-t pt-3 mt-3">
          <img
            src={product.seller?.photoUrl || "https://via.placeholder.com/40"}
            alt={product.seller?.businessName || "Seller"}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <p className="text-xs text-gray-400">Sold by:</p>
            <p className="font-semibold text-gray-700">
              {product.seller?.businessName || "Trusted Seller"}
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-2xl font-extrabold text-gray-800">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        <Button
          onClick={() => onInquiryClick(product)}
          className="w-full mt-3 bg-gray-800 hover:bg-orange-600 text-white font-semibold"
        >
          Send Inquiry
        </Button>
      </div>
    </div>
  </motion.div>
);

// --- MAIN MARKETPLACE PAGE COMPONENT ---
const MarketplacePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, pagination, status, error } = useSelector(
    (state: RootState) => state.sellerProducts
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchPublicSellerProducts(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && pagination && newPage <= pagination.pages) {
      setCurrentPage(newPage);
    }
  };

  const handleOpenInquiryModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const uniqueCategories = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    const categories = products.map((p) => p.category).filter(Boolean);
    return ["All", ...Array.from(new Set(categories)).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    let items = products;
    if (selectedCategory !== "All") {
      items = items.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.seller?.businessName?.toLowerCase().includes(searchLower)
      );
    }
    return items;
  }, [products, searchTerm, selectedCategory]);

  // Error state handling
  if (status === "failed") {
    return (
      <div className="bg-white min-h-screen">
        <Helmet>
          <title>Home Designing & Interior Marketplace</title>
        </Helmet>
        <Navbar />
        <div className="text-center py-20">
          <ServerCrash className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Failed to Load Products
          </h3>
          <p className="text-gray-600">{String(error)}</p>
          <Button
            onClick={() => dispatch(fetchPublicSellerProducts(currentPage))}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Home Designing & Interior Marketplace</title>
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 pt-8 pb-12">
        {/* Hero Banner */}
        <div
          className="relative h-50 md:h-96 rounded-xl overflow-hidden mb-12 bg-cover bg-center"
          style={{ backgroundImage: "url(/marketplace.jpg)" }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white p-4">
            <h1
              className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase"
              style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
            >
              Home Designing & Interior Marketplace
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
              Discover amazing architectural designs & materials for your dream
              home.
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 p-6 bg-gray-50 rounded-xl shadow-sm border flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:flex-1">
            <Label
              htmlFor="search-input"
              className="font-semibold text-gray-700"
            >
              Search Products
            </Label>
            <div className="relative mt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search for products, brands, or sellers..."
                className="w-full h-12 pl-12 pr-4 rounded-lg text-base bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-auto md:min-w-[250px]">
            <Label
              htmlFor="category-filter"
              className="font-semibold text-gray-700"
            >
              Filter by Category
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger
                id="category-filter"
                className="mt-2 h-12 text-base bg-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid with Loading State */}
        {status === "loading" && products.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onInquiryClick={handleOpenInquiryModal}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
                <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  <ChevronLeft className="mr-1" /> Previous
                </Button>
                <span className="font-semibold text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  variant="outline"
                >
                  Next <ChevronRight className="ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
      {isModalOpen && (
        <InquiryModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MarketplacePage;
