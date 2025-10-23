import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { AppDispatch, RootState } from "@/lib/store";
import {
  createSellerProduct,
  resetActionStatus,
} from "@/lib/features/seller/sellerProductSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ICategoryBrand {
  _id: string;
  name: string;
}

interface IFormData {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  countInStock: number;
  category: string;
  brand: string;
}

const AddSellerProductPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.sellerProducts
  );

  const [categories, setCategories] = useState<ICategoryBrand[]>([]);
  const [brands, setBrands] = useState<ICategoryBrand[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>();

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categoriesData } = await axios.get(
          "/api/seller/products/categories"
        );
        const { data: brandsData } = await axios.get(
          "/api/seller/products/brands"
        );

        // --- YAHAN BADLAAV KIYA GAYA HAI ---
        // Hamesha check karein ki data ek array hai, agar nahi to empty array use karein
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Could not fetch categories or brands.");
        // Error hone par bhi empty array set karein taaki crash na ho
        setCategories([]);
        setBrands([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Product created and published successfully!");
      dispatch(resetActionStatus());
      navigate("/seller/products");
    }
    if (actionStatus === "failed") {
      toast.error(error || "Failed to create product.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: IFormData) => {
    if (!image) {
      toast.error("Please upload a main image for the product.");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });
    formData.append("image", image);

    dispatch(createSellerProduct(formData));
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <Button type="submit" disabled={actionStatus === "loading"}>
            {actionStatus === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Product
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Label htmlFor="image">Main Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-2"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>
                  Select from list or type a new one.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    list="categories-list"
                    {...register("category", {
                      required: "Category is required",
                    })}
                    placeholder="e.g., Electronics"
                  />
                  <datalist id="categories-list">
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name} />
                    ))}
                  </datalist>
                  {errors.category && (
                    <p className="text-xs text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    list="brands-list"
                    {...register("brand", { required: "Brand is required" })}
                    placeholder="e.g., Apple"
                  />
                  <datalist id="brands-list">
                    {brands.map((br) => (
                      <option key={br._id} value={br.name} />
                    ))}
                  </datalist>
                  {errors.brand && (
                    <p className="text-xs text-red-500">
                      {errors.brand.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Stock</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                      min: 0,
                    })}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="salePrice">
                    Discount Price (₹) (Optional)
                  </Label>
                  <Input
                    id="salePrice"
                    type="number"
                    {...register("salePrice", { valueAsNumber: true, min: 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="countInStock">Stock Quantity</Label>
                  <Input
                    id="countInStock"
                    type="number"
                    {...register("countInStock", {
                      required: "Stock quantity is required",
                      valueAsNumber: true,
                      min: 0,
                    })}
                  />
                  {errors.countInStock && (
                    <p className="text-xs text-red-500">
                      {errors.countInStock.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSellerProductPage;
