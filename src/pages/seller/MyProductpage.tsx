import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchSellerProducts,
  deleteSellerProduct,
  updateSellerProduct,
  resetActionStatus,
} from "@/lib/features/seller/sellerProductSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
import { EditProductModal } from "../../components/EditProductModal";

const MyProductsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, status, actionStatus, error } = useSelector(
    (state: RootState) => state.sellerProducts
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // --- YAHAN BADLAAV KIYA GAYA HAI ---
  // Ab yeh useEffect component ke load hone par hamesha data fetch karega.
  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);
  // ------------------------------------

  useEffect(() => {
    // Ye toast messages ke liye hai, jaise update ya delete ke baad
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully!");
      if (isModalOpen) setIsModalOpen(false);
      dispatch(resetActionStatus());
      // Hum yahan se bhi re-fetch kar sakte the, lekin upar wala useEffect
      // zyada simple aur reliable hai jab aap navigate karke aate hain.
    }
    if (actionStatus === "failed") {
      toast.error(error || "An unknown error occurred.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, isModalOpen]);

  const handleOpenEditModal = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdate = (productId: string, productData: FormData) => {
    dispatch(updateSellerProduct({ productId, productData }));
  };

  const handleDelete = (productId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      dispatch(deleteSellerProduct(productId));
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Link to="/seller/products/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {status === "loading" && (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {status === "succeeded" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[80px] sm:table-cell">
                    Image
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map(
                    (
                      product: any // Type any for now
                    ) => (
                      <TableRow key={product._id}>
                        <TableCell className="hidden sm:table-cell">
                          <img
                            alt={product.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.image}
                            width="64"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.status === "Approved"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          ₹
                          {product.salePrice > 0
                            ? product.salePrice
                            : product.price}
                        </TableCell>
                        <TableCell>{product.countInStock}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onSelect={() => handleOpenEditModal(product)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleDelete(product._id)}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No products found. Start by adding a new product.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {editingProduct && (
        <EditProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={editingProduct}
          onSave={handleUpdate}
          isLoading={actionStatus === "loading"}
        />
      )}
    </div>
  );
};

export default MyProductsPage;
