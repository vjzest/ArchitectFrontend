// File: pages/seller/components/EditProductModal.tsx

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

// Maan lete hain ki yeh data aap API se fetch karenge, abhi ke liye hardcoded hai
const categories = [
  { _id: "668e7d2354898144214a1a10", name: "Electronics" },
  { _id: "668e7d2354898144214a1a11", name: "Books" },
];
const brands = [
  { _id: "668e7d2354898144214a1a12", name: "Apple" },
  { _id: "668e7d2354898144214a1a13", name: "Samsung" },
];

interface IFormData {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  countInStock: number;
  category: string;
  brand: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any; // The product to edit
  onSave: (productId: string, formData: FormData) => void;
  isLoading: boolean;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormData>({
    // Product data se form ko pre-fill karein
    defaultValues: {
      name: product?.name,
      description: product?.description,
      price: product?.price,
      salePrice: product?.salePrice,
      countInStock: product?.countInStock,
      category: product?.category._id,
      brand: product?.brand._id,
    },
  });
  const [newImage, setNewImage] = useState<File | null>(null);

  // Jab bhi naya product select ho, form ko reset karein
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        countInStock: product.countInStock,
        category: product.category._id,
        brand: product.brand._id,
      });
      setNewImage(null);
    }
  }, [product, reset]);

  const handleSave = (data: IFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (newImage) {
      formData.append("image", newImage);
    }

    onSave(product._id, formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Product: {product?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="grid gap-4 py-4">
          {/* Form fields bilkul Add Product page jaise honge */}
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                {...register("price", { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="salePrice">Discount Price (₹)</Label>
              <Input
                id="salePrice"
                type="number"
                {...register("salePrice", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                {...register("category", { required: true })}
                className="w-full mt-1 p-2 border rounded"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <select
                {...register("brand", { required: true })}
                className="w-full mt-1 p-2 border rounded"
              >
                {brands.map((br) => (
                  <option key={br._id} value={br._id}>
                    {br.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="countInStock">Stock Quantity</Label>
            <Input
              id="countInStock"
              type="number"
              {...register("countInStock", {
                required: true,
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <Label htmlFor="newImage">Change Main Image (Optional)</Label>
            <Input
              id="newImage"
              type="file"
              onChange={(e) =>
                setNewImage(e.target.files ? e.target.files[0] : null)
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current Image:{" "}
              <a
                href={product?.image}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View
              </a>
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
