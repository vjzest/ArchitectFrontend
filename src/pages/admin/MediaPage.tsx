import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Loader2,
  ServerCrash,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { fetchMediaItems } from "@/lib/features/media/mediaSlice";
import { Product } from "@/lib/features/products/productSlice";

const MediaPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items, page, pages, status, error } = useSelector(
    (state: RootState) => state.media
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [jumpToPage, setJumpToPage] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(
      fetchMediaItems({
        pageNumber: currentPage,
        searchTerm: debouncedSearchTerm,
      })
    );
  }, [dispatch, currentPage, debouncedSearchTerm]);

  const getFileExtension = (url: string = ""): string => {
    if (!url) return "file";
    try {
      const pathname = new URL(url).pathname;
      const parts = pathname.split(".");
      return parts.length > 1 ? parts.pop()! : "file";
    } catch (e) {
      const parts = url.split("?")[0].split(".");
      return parts.length > 1 ? parts.pop()! : "file";
    }
  };

  const handleDownload = async (url: string | undefined, filename: string) => {
    if (!url) {
      toast.error("No file URL available to download.");
      return;
    }
    try {
      toast.info(`Downloading ${filename}...`);
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Network response was not ok for ${url}`);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      toast.success(`Downloaded ${filename}`);
    } catch (err) {
      toast.error(`Failed to download ${filename}.`);
      console.error(err);
    }
  };

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  if (status === "loading" && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-20">
        <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-xl font-semibold text-red-500">
          Failed to load media
        </h3>
        <p className="mt-2 text-gray-500">{String(error)}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or product no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Product No.</TableHead>
              <TableHead>Plan Type</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((product) => {
              const productIdentifier = product.productNo || "product";
              const planFileUrl =
                product.planFile && product.planFile.length > 0
                  ? product.planFile[0]
                  : undefined;

              return (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{productIdentifier}</TableCell>
                  <TableCell>{product.planType}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownload(
                          product.mainImage,
                          `${productIdentifier}-main-image.${getFileExtension(product.mainImage)}`
                        )
                      }
                      disabled={!product.mainImage}
                    >
                      <Download className="mr-2 h-4 w-4" /> Main Image
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownload(
                          planFileUrl,
                          `${productIdentifier}-plan-file.${getFileExtension(planFileUrl)}`
                        )
                      }
                      disabled={!planFileUrl}
                    >
                      <Download className="mr-2 h-4 w-4" /> Plan File
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || status === "loading"}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <span className="font-medium">
            Page {page} of {pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
            disabled={currentPage === pages || status === "loading"}
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
          <form onSubmit={handlePageJump} className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max={pages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              placeholder="Page..."
              className="w-20 h-10"
            />
            <Button type="submit" variant="outline" className="h-10">
              Go
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
