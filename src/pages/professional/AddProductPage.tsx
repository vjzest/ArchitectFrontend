import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  createPlan,
  resetPlanActionStatus,
} from "@/lib/features/professional/professionalPlanSlice";
import { fetchProducts } from "@/lib/features/products/productSlice";
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
import {
  Loader2,
  Youtube,
  PlusCircle,
  XCircle,
  ChevronsUpDown,
  ShieldAlert,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MultiSelect as MultiSelectForProducts } from "@/components/ui/MultiSelectDropdown";

// Interface for form data
interface IPlanFormData {
  name: string;
  description: string;
  productNo: string;
  price: number;
  category: string;
  youtubeLink?: string;
  city?: string;
  plotSize?: string;
  plotArea?: number;
  rooms?: number;
  bathrooms?: number;
  kitchen?: number;
  floors?: number;
  seoTitle?: string;
  seoAltText?: string;
  seoDescription?: string;
  seoKeywords?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  salePrice?: number;
  taxRate?: number;
}

// Static Data
const countries = [
  { value: "India", label: "India" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Sri Lanka", label: "Sri Lanka" },
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "Nepal", label: "Nepal" },
  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Australia", label: "Australia" },
].sort((a, b) => a.label.localeCompare(b.label));

const categories = [
  "Residential House",
  "Commercial House Plan",
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

// Helper component for multi-select country dropdown
const MultiSelectCountry = ({
  selected,
  setSelected,
  options,
  placeholder,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="w-full justify-between font-normal">
        {selected.length > 0
          ? `${selected.length} countries selected`
          : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
      {options.map((option) => (
        <DropdownMenuCheckboxItem
          key={option.value}
          checked={selected.includes(option.value)}
          onCheckedChange={() => {
            setSelected((prev) =>
              prev.includes(option.value)
                ? prev.filter((v) => v !== option.value)
                : [...prev, option.value]
            );
          }}
          onSelect={(e) => e.preventDefault()}
        >
          {option.label}
        </DropdownMenuCheckboxItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
};

const AddPlanPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.professionalPlans
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { products } = useSelector((state: RootState) => state.products);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IPlanFormData>();

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [planFiles, setPlanFiles] = useState<File[]>([]);
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const [propertyType, setPropertyType] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [planType, setPlanType] = useState<string>("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isSale, setIsSale] = useState<boolean>(false);
  const [crossSell, setCrossSell] = useState<string[]>([]);
  const [upSell, setUpSell] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const productOptions = products.map((p) => ({ value: p._id, label: p.name }));

  const handleFileChange = (setter, files, maxFiles = 1) => {
    if (files) {
      if (maxFiles === 1) {
        setter(files[0]);
      } else {
        if (files.length > maxFiles) {
          toast.error(`You can only upload a maximum of ${maxFiles} images.`);
          return;
        }
        setter(Array.from(files));
      }
    }
  };

  const handleRemovePlanFile = (indexToRemove: number) => {
    setPlanFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit = (data: any) => {
    if (selectedCountries.length === 0 || !propertyType || !planType) {
      return toast.error("Country, Property Type, and Plan Type are required.");
    }
    if (!mainImage || planFiles.length === 0) {
      return toast.error("Main image and at least one plan file are required.");
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key]) formData.append(key, data[key]);
    });

    formData.append("country", selectedCountries.join(","));
    formData.append("propertyType", propertyType);
    formData.append("direction", direction);
    formData.append("planType", planType);
    formData.append("isSale", String(isSale));
    formData.append("crossSellProducts", crossSell.join(","));
    formData.append("upSellProducts", upSell.join(","));

    if (mainImage) formData.append("mainImage", mainImage);
    if (headerImage) formData.append("headerImage", headerImage);
    galleryImages.forEach((file) => formData.append("galleryImages", file));
    planFiles.forEach((file) => formData.append("planFile", file));

    dispatch(createPlan(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Plan submitted for review successfully!");
      dispatch(resetPlanActionStatus());
      reset();
      // Reset all states...
      navigate("/professional/my-products");
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Failed to create plan.");
      dispatch(resetPlanActionStatus());
    }
  }, [actionStatus, error, dispatch, navigate, reset]);

  if (userInfo && userInfo.role === "professional" && !userInfo.isApproved) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-lg text-center p-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center gap-3">
              <ShieldAlert className="h-10 w-10 text-yellow-500" />
              Account Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Your professional account is under review. You can add plans once
              your account is approved.
            </p>
            <Button asChild>
              <Link to="/professional/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Add New Plan</h1>
          <Button type="submit" disabled={actionStatus === "loading"}>
            {actionStatus === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit for Review
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Plan Title*</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Title is required" })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.name.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Description*</Label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <ReactQuill theme="snow" {...field} />
                    )}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.description.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="youtubeLink">YouTube Video Link</Label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="youtubeLink"
                      {...register("youtubeLink")}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Specifications</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="productNo">Product Number*</Label>
                  <Input
                    id="productNo"
                    {...register("productNo", {
                      required: "Product No. is required",
                    })}
                  />
                  {errors.productNo && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.productNo.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">City*</Label>
                  <Input
                    id="city"
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.city.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="plotSize">Plot Size*</Label>
                  <Input
                    id="plotSize"
                    {...register("plotSize", {
                      required: "Plot size is required",
                    })}
                  />
                  {errors.plotSize && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.plotSize.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="plotArea">Plot Area (sqft)*</Label>
                  <Input
                    id="plotArea"
                    type="number"
                    {...register("plotArea", {
                      required: "Plot area is required",
                      valueAsNumber: true,
                    })}
                  />
                  {errors.plotArea && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.plotArea.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="rooms">Rooms (BHK)*</Label>
                  <Input
                    id="rooms"
                    type="number"
                    {...register("rooms", {
                      required: "Rooms count is required",
                      valueAsNumber: true,
                    })}
                  />
                  {errors.rooms && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.rooms.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    {...register("bathrooms", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="kitchen">Kitchen</Label>
                  <Input
                    id="kitchen"
                    type="number"
                    {...register("kitchen", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="floors">Floors</Label>
                  <Input
                    id="floors"
                    type="number"
                    {...register("floors", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label>Facing Direction</Label>
                  <Select onValueChange={setDirection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "North",
                        "South",
                        "East",
                        "West",
                        "North-East",
                        "North-West",
                        "South-East",
                        "South-West",
                      ].map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3">
                  <Label>Country*</Label>
                  <MultiSelectCountry
                    selected={selectedCountries}
                    setSelected={setSelectedCountries}
                    options={countries}
                    placeholder="Select countries..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO & Marketing</CardTitle>
                <CardDescription>
                  Improve search visibility for this plan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input id="seoTitle" {...register("seoTitle")} />
                </div>
                <div>
                  <Label htmlFor="seoAltText">Main Image Alt Text</Label>
                  <Input id="seoAltText" {...register("seoAltText")} />
                </div>
                <div>
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    rows={3}
                    {...register("seoDescription")}
                  />
                </div>
                <div>
                  <Label htmlFor="seoKeywords">
                    Keywords (comma-separated)
                  </Label>
                  <Input id="seoKeywords" {...register("seoKeywords")} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <Label>Cross-Sell Products</Label>
                    <MultiSelectForProducts
                      options={productOptions}
                      selected={crossSell}
                      onChange={setCrossSell}
                      placeholder="Select related products..."
                    />
                  </div>
                  <div>
                    <Label>Up-Sell Products</Label>
                    <MultiSelectForProducts
                      options={productOptions}
                      selected={upSell}
                      onChange={setUpSell}
                      placeholder="Select premium alternatives..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>
                  Upload main image, gallery, and plan files.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mainImage">Main Image*</Label>
                  <Input
                    id="mainImage"
                    type="file"
                    onChange={(e) =>
                      handleFileChange(setMainImage, e.target.files)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="galleryImages">
                    Gallery Images (Up to 5)
                  </Label>
                  <Input
                    id="galleryImages"
                    type="file"
                    multiple
                    onChange={(e) =>
                      handleFileChange(setGalleryImages, e.target.files, 5)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="headerImage">Header Image (Optional)</Label>
                  <Input
                    id="headerImage"
                    type="file"
                    onChange={(e) =>
                      handleFileChange(setHeaderImage, e.target.files)
                    }
                  />
                </div>
                <div>
                  <Label>Plan Files*</Label>
                  <Input
                    id="planFileInput"
                    type="file"
                    multiple
                    onChange={(e) =>
                      setPlanFiles((prev) => [
                        ...prev,
                        ...Array.from(e.target.files),
                      ])
                    }
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("planFileInput")?.click()
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Files
                  </Button>
                  <div className="mt-2 space-y-2">
                    {planFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                      >
                        <span>{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePlanFile(index)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Tax</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">Price (₹)*</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                    })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.price.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="salePrice">Sale Price (₹)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    {...register("salePrice", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    {...register("taxRate", { valueAsNumber: true })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="isSale"
                    checked={isSale}
                    onCheckedChange={(checked) => setIsSale(checked === true)}
                  />
                  <Label htmlFor="isSale">This plan is on sale</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Plan Type*</Label>
                  <Select onValueChange={setPlanType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Plan Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Floor Plans",
                        "Floor Plan + 3D Elevations",
                        "Interior Designs",
                        "Construction Products",
                      ].map((pt) => (
                        <SelectItem key={pt} value={pt}>
                          {pt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category*</Label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.category.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Property Type*</Label>
                  <Select onValueChange={setPropertyType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPlanPage;
