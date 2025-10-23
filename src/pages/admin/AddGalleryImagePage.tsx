import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import {
  createGalleryItem,
  resetActionStatus,
} from "@/lib/features/gallery/gallerySlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddGalleryImagePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.gallery
  );

  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // --- ✨ नया स्टेट यहाँ जोड़ा गया है ---
  const [productLink, setProductLink] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image) {
      toast.error("Title and image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("altText", altText);
    formData.append("category", category);
    formData.append("image", image);
    // --- ✨ productLink को FormData में जोड़ा गया है ---
    if (productLink) {
      formData.append("productLink", productLink);
    }

    dispatch(createGalleryItem(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Image uploaded to the gallery successfully!");
      dispatch(resetActionStatus());
      navigate("/admin/gallery");
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Failed to upload image.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, navigate]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/gallery">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Add to Gallery</h1>
          </div>
          <Button type="submit" disabled={actionStatus === "loading"}>
            {actionStatus === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upload Image
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Image Details</CardTitle>
            <CardDescription>
              Complete the information and select the image to upload.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Image Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Modern house facade"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="altText">SEO Alt Text</Label>
                <Input
                  id="altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image for SEO"
                />
              </div>
            </div>

            {/* --- ✨ Product Link फ़ील्ड यहाँ जोड़ी गई है ✨ --- */}
            <div className="space-y-2">
              <Label htmlFor="productLink">Product Link (Optional)</Label>
              <Input
                id="productLink"
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
                placeholder="E.g., /product/60d5ecb4d40015e9b3a0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Exteriors">Exteriors</SelectItem>
                  <SelectItem value="Interiors">Interiors</SelectItem>
                  <SelectItem value="Projects">Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image File *</Label>
              <Input
                id="image"
                type="file"
                onChange={handleFileChange}
                required
                accept="image/*"
              />
            </div>
            {preview && (
              <div>
                <Label>Preview</Label>
                <div className="mt-2 border rounded-md p-2 w-fit">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-40 w-auto object-contain rounded"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AddGalleryImagePage;
