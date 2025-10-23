import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  createPackage,
  updatePackage,
  resetActionStatus,
  fetchAllPackages,
} from "@/lib/features/packages/packageSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// --- डिफ़ॉल्ट डेटा जो फॉर्म में पहले से भरा रहेगा ---
const defaultFormData = {
  title: "Floor Plan",
  price: "", // यह खाली रहेगा ताकि एडमिन भर सके
  unit: "Per sq.ft.",
  areaType: "Built-up Area",
  packageType: "standard",
  isPopular: false,
  features:
    "Revision Unlimited upto satisfaction, Requirements fixed, General vastu follows, 24 Hours Delivery",
  includes: "",
  note: "",
};

const PackageEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();

  const { packages, actionStatus, error } = useSelector(
    (state: RootState) => state.packages
  );

  // --- फॉर्म की शुरुआती स्टेट अब हमारे डिफ़ॉल्ट डेटा से होगी ---
  const [formData, setFormData] = useState(defaultFormData);
  const isEditMode = Boolean(id);

  useEffect(() => {
    // सिर्फ एडिट मोड में पैकेज की सूची लोड करें
    if (isEditMode && packages.length === 0) {
      dispatch(fetchAllPackages());
    }
  }, [isEditMode, packages.length, dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast({
        title: `Package ${isEditMode ? "updated" : "created"} successfully!`,
      });
      navigate("/admin/packages");
    }
    if (actionStatus === "failed") {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
    return () => {
      dispatch(resetActionStatus());
    };
  }, [actionStatus, error, navigate, dispatch, isEditMode, toast]);

  useEffect(() => {
    if (isEditMode && packages.length > 0) {
      // एडिट मोड में, मौजूदा पैकेज का डेटा भरें
      const existingPackage = packages.find((p) => p._id === id);
      if (existingPackage) {
        setFormData({
          title: existingPackage.title,
          price: existingPackage.price,
          unit: existingPackage.unit,
          areaType: existingPackage.areaType || "",
          packageType: existingPackage.packageType,
          isPopular: existingPackage.isPopular,
          note: existingPackage.note || "",
          features: existingPackage.features.join(", "),
          includes: existingPackage.includes?.join(", ") || "",
        });
      }
    } else {
      // ऐड मोड में, हमेशा डिफ़ॉल्ट डेटा दिखाएं
      setFormData(defaultFormData);
    }
  }, [id, packages, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const packageData = {
      ...formData,
      features: formData.features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      includes: formData.includes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    if (isEditMode) {
      // @ts-ignore
      dispatch(updatePackage({ ...packageData, _id: id! }));
    } else {
      // @ts-ignore
      dispatch(createPackage(packageData));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Package" : "Add New Package"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow"
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter price here"
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit (e.g., Per sq.ft.)</Label>
            <Input
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="packageType">Package Type</Label>
          <select
            name="packageType"
            id="packageType"
            value={formData.packageType}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div>
          <Label htmlFor="features">Features (comma separated)</Label>
          <Textarea
            id="features"
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="Feature 1, Feature 2, Feature 3"
          />
        </div>
        <div>
          <Label htmlFor="includes">
            Includes (comma separated, for Standard only)
          </Label>
          <Textarea
            id="includes"
            name="includes"
            value={formData.includes}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="note">Note</Label>
          <Input
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isPopular"
            name="isPopular"
            checked={formData.isPopular}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <Label htmlFor="isPopular" className="font-medium">
            Mark as Popular Package
          </Label>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={actionStatus === "loading"}
            className="w-full"
          >
            {actionStatus === "loading" ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </>
            ) : isEditMode ? (
              "Update Package"
            ) : (
              "Create Package"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PackageEditPage;
