// src/components/BlogSidebar.tsx

import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";

// दोनों thunks को import करें
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";

const BlogSidebar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { products: adminProducts, listStatus: adminListStatus } = useSelector(
    (state: RootState) => state.products
  );
  const { plans: professionalPlans, listStatus: profListStatus } = useSelector(
    (state: RootState) => state.professionalPlans
  );

  useEffect(() => {
    // Fetch data only if it's not already loaded or loading
    if (adminListStatus === "idle") {
      dispatch(fetchProducts({}));
    }
    if (profListStatus === "idle") {
      dispatch(fetchAllApprovedPlans());
    }
  }, [dispatch, adminListStatus, profListStatus]);

  // Combine both admin and professional products into one list
  const combinedProducts = useMemo(() => {
    const adminArray = Array.isArray(adminProducts) ? adminProducts : [];
    const profArray = Array.isArray(professionalPlans) ? professionalPlans : [];

    const normalizedAdmin = adminArray.map((p) => ({
      ...p,
      name: p.name,
      image: p.mainImage,
    }));
    const normalizedProf = profArray.map((p) => ({
      ...p,
      name: p.planName,
      image: p.mainImage,
    }));

    return [...normalizedAdmin, ...normalizedProf];
  }, [adminProducts, professionalPlans]);

  // Get unique categories from all products
  const uniqueCategories = useMemo(() => {
    const categories = combinedProducts.map((p) => p.category).filter(Boolean);
    return [...new Set(categories)].sort();
  }, [combinedProducts]);

  // Get a few products to feature in "You May Also Like"
  const featuredProducts = useMemo(() => {
    return combinedProducts.slice(0, 4); // Show first 4 products
  }, [combinedProducts]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get("search") as string;
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";

  return (
    <aside className="w-full lg:w-1/3 lg:pl-10 mt-12 lg:mt-0">
      <div className="space-y-8 sticky top-24">
        {/* Categories */}
        <div className="bg-card p-6 rounded-lg shadow-soft">
          <h3 className="text-xl font-bold text-foreground mb-4">Categories</h3>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ul className="space-y-2">
              {uniqueCategories.slice(0, 5).map(
                (
                  category // Show top 5 categories
                ) => (
                  <li key={category}>
                    <Link
                      to={`/products?category=${encodeURIComponent(category)}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {category}
                    </Link>
                  </li>
                )
              )}
            </ul>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-card p-6 rounded-lg shadow-soft">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Search By Area and Dimension
          </h3>
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              name="search"
              placeholder="e.g., 30x40..."
              className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white p-3 rounded-r-md hover:opacity-90"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* You May Also Like */}
        <div className="bg-card p-6 rounded-lg shadow-soft">
          <h3 className="text-xl font-bold text-foreground mb-4">
            You May Also Like
          </h3>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ul className="space-y-4">
              {featuredProducts.map((product) => (
                <li key={product._id}>
                  <Link
                    to={`/product/${product._id}`}
                    className="flex items-center group"
                  >
                    <img
                      src={product.image || "https://via.placeholder.com/60x60"}
                      alt={product.name}
                      className="w-16 h-16 rounded-md mr-4 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-primary">
                        ₹
                        {(product.isSale
                          ? product.salePrice
                          : product.price
                        ).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
