import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchProducts,
  deleteProduct,
  resetProductState,
  Product,
} from "@/lib/features/products/productSlice";
import { RootState, AppDispatch } from "@/lib/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProductModal from "./EditProductModal";
import useDebounce from "@/hooks/useDebounce";

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

const AllProductsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, listStatus, actionStatus, error, pages, count } =
    useSelector((state: RootState) => state.products);

  const [searchParams, setSearchParams] = useSearchParams();

  // URL से प्रारंभिक मान पढ़ें या डिफ़ॉल्ट सेट करें
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialCategory = searchParams.get("category") || "all";
  const initialSearchTerm = searchParams.get("search") || "";

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // States को URL से मिली वैल्यू से इनिशियलाइज़ करें
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const [jumpToPage, setJumpToPage] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // जब भी स्टेट बदले, URL को अपडेट करें
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) {
      params.set("page", String(currentPage));
    }
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    }

    // `replace: true` ब्राउज़र हिस्ट्री को साफ रखता है
    setSearchParams(params, { replace: true });
  }, [currentPage, selectedCategory, debouncedSearchTerm, setSearchParams]);

  // जब भी URL पर आधारित स्टेट बदले, प्रोडक्ट्स को फैच करें
  useEffect(() => {
    const params: any = {
      pageNumber: currentPage,
      limit: 12,
    };

    if (debouncedSearchTerm) params.searchTerm = debouncedSearchTerm;
    if (selectedCategory !== "all") params.category = selectedCategory;

    dispatch(fetchProducts(params));
  }, [dispatch, currentPage, debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    if (actionStatus === "failed" && error) {
      toast.error(String(error));
      dispatch(resetProductState());
    }
  }, [actionStatus, error, dispatch]);

  const totalPages = pages || 1;

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId)).then((res) => {
        if (res.type.endsWith("fulfilled")) {
          toast.success("Product deleted successfully!");

          if (products.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            const params: any = {
              pageNumber: currentPage,
              limit: 12,
              searchTerm: debouncedSearchTerm,
              category: selectedCategory,
            };
            dispatch(fetchProducts(params));
          }
        }
      });
    }
  };

  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const page = parseInt(jumpToPage, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        setJumpToPage("");
      } else {
        toast.error(
          `Please enter a valid page number between 1 and ${totalPages}.`
        );
      }
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
          <Link to="/admin/products/add">
            <Button>
              <PlusCircle size={18} className="mr-2" /> Add New Product
            </Button>
          </Link>
        </div>
        <p className="text-gray-600">
          Manage all your house plans and products here.
        </p>

        <div className="bg-white rounded-xl shadow-md p-4 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, category, or plot size..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(selectedCategory !== "all" || searchTerm) && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing {products?.length || 0} of {count || 0} products
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-primary hover:text-primary"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {listStatus === "loading" ? (
            <div className="p-12 text-center flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading
              Products...
            </div>
          ) : !products || products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>
                {searchTerm || selectedCategory !== "all"
                  ? "No products match your filters."
                  : "No products found."}
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Image
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Name
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Category
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Author
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Price
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const productName =
                      product.name || product.Name || "Untitled";
                    const productImage =
                      product.mainImage ||
                      (product.Images
                        ? product.Images.split(",")[0].trim()
                        : undefined);
                    const productPrice =
                      product.price ?? product["Regular price"] ?? 0;
                    const productStatus =
                      product.status ||
                      (product.Published === 1 ? "Published" : "Draft");
                    const productCategory = Array.isArray(product.category)
                      ? product.category.join(", ")
                      : product.category || "N/A";

                    return (
                      <tr
                        key={product._id}
                        className="border-t hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <Avatar className="rounded-md w-12 h-12">
                            <AvatarImage
                              src={productImage}
                              alt={productName}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-md bg-gray-100">
                              {productName?.charAt(0) || "P"}
                            </AvatarFallback>
                          </Avatar>
                        </td>
                        <td className="p-4 font-medium text-gray-800">
                          {productName}
                        </td>
                        <td className="p-4 text-gray-600">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
                            {productCategory}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">
                          {product.user?.name || "N/A"}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              productStatus === "Published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {productStatus}
                          </span>
                        </td>
                        <td className="p-4 text-gray-800 font-semibold">
                          ₹
                          {productPrice > 0
                            ? productPrice.toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(product)}
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(product._id)}
                              disabled={actionStatus === "loading"}
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <span className="text-sm text-gray-600 font-medium">
                Page {currentPage} of {totalPages} (Total: {count || 0}{" "}
                products)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || listStatus === "loading"}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <span>Page</span>
                  <Input
                    type="number"
                    className="w-16 h-9 text-center"
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    onKeyDown={handleJumpToPage}
                    placeholder={`${currentPage}`}
                    min={1}
                    max={totalPages}
                  />
                  <span>of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={
                    currentPage === totalPages || listStatus === "loading"
                  }
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </>
  );
};
export default AllProductsPage;
