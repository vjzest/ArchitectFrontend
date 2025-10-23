import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchGalleryItems,
  GalleryItem,
} from "@/lib/features/gallery/gallerySlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Page jump के लिए जोड़ा गया
import {
  Loader2,
  ServerCrash,
  CameraOff,
  ShoppingCart,
  ChevronLeft, // Icon जोड़ा गया
  ChevronRight, // Icon जोड़ा गया
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const GalleryImageCard = ({ item }: { item: GalleryItem }) => {
  const hasProductLink = item.productLink && item.productLink.trim() !== "";

  return (
    <Card className="rounded-xl overflow-hidden group relative border-2 border-transparent hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-xl">
      <div className="aspect-w-1 aspect-h-1 w-full">
        {hasProductLink ? (
          <Link to={item.productLink}>
            <img
              src={item.imageUrl}
              alt={item.altText || item.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </Link>
        ) : (
          <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={item.imageUrl}
              alt={item.altText || item.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </a>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
          <div className="transition-transform duration-300 transform group-hover:-translate-y-12">
            <h3 className="text-white font-bold text-lg drop-shadow-md">
              {item.title}
            </h3>
            <p className="text-orange-300 text-sm font-semibold">
              {item.category}
            </p>
          </div>
        </div>

        {hasProductLink && (
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <Link to={item.productLink} className="w-full">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

const GalleryPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector(
    (state: RootState) => state.gallery
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState("");
  const ITEMS_PER_PAGE = 12; // एक पेज पर 12 आइटम

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGalleryItems());
    }
  }, [status, dispatch]);

  const uniqueCategories = useMemo(() => {
    if (!items) return [];
    const categories = new Set(items.map((item) => item.category));
    return ["All", ...Array.from(categories), "Video"];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") {
      return items;
    }
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleCategoryChange = (value: string) => {
    if (value === "Video") {
      navigate("/customize/3d-video-walkthrough");
    } else {
      setSelectedCategory(value);
      setCurrentPage(1); // कैटेगरी बदलने पर पहले पेज पर वापस जाएं
    }
  };

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="mt-4 text-slate-600">Loading our gallery...</p>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-red-50/50 p-8 rounded-xl">
          <ServerCrash className="h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-xl font-semibold text-red-700">
            Oh no! Something went wrong
          </h3>
          <p className="mt-2 text-red-600">{String(error)}</p>
        </div>
      );
    }
    if (status === "succeeded" && currentItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-slate-100/50 p-8 rounded-xl">
          <CameraOff className="h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-xl font-semibold text-slate-700">
            No Images Found
          </h3>
          <p className="mt-2 text-slate-500">
            {selectedCategory === "All"
              ? "Our gallery seems to be empty at the moment."
              : `There are no images in the "${selectedCategory}" category.`}
          </p>
        </div>
      );
    }
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((item) => (
            <GalleryImageCard key={item._id} item={item} />
          ))}
        </div>

        {/* --- Pagination Controls --- */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
            <form onSubmit={handlePageJump} className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                placeholder="Page..."
                className="w-20 h-10"
                aria-label="Jump to page"
              />
              <Button type="submit" variant="outline" className="h-10">
                Go
              </Button>
            </form>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-[#F7FAFA] min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Our Project Gallery
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Explore a collection of our best designs and projects. Get inspired
            for your next home.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="w-full max-w-xs">
            <label className="block text-center text-sm font-medium text-slate-700 mb-2">
              Filter by category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="h-12 text-base bg-white shadow-sm border-slate-300 focus:ring-orange-500">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-base"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
