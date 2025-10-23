import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import {
  BlogPost,
  createPost,
  updatePost,
} from "@/lib/features/blog/blogSlice";

// TypeScript ke liye types define karein
interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost | null;
}

type FormData = Omit<
  BlogPost,
  "_id" | "createdAt" | "updatedAt" | "tags" | "metaKeywords"
> & {
  tags: string;
  metaKeywords: string;
};

export const BlogFormModal: React.FC<BlogFormModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus } = useSelector((state: RootState) => state.blog);
  const isEditing = Boolean(post);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const titleValue = watch("title");

  useEffect(() => {
    if (titleValue && !isEditing) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", slug);
    }
  }, [titleValue, setValue, isEditing]);

  useEffect(() => {
    if (isOpen) {
      if (post) {
        reset({
          ...post,
          tags: post.tags?.join(", ") || "",
          metaKeywords: post.metaKeywords?.join(", ") || "",
        });
        setPreview(post.mainImage);
      } else {
        reset({
          title: "",
          slug: "",
          description: "",
          content: "",
          author: "Admin",
          status: "Draft",
          tags: "",
          metaDescription: "",
          metaKeywords: "",
          imageAltText: "",
          imageTitleText: "",
        });
        setPreview(null);
      }
      setImageFile(null);
    }
  }, [post, isOpen, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    // File ke alawa sabhi data ko append karein
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (imageFile) {
      formData.append("mainImage", imageFile);
    }

    const action = isEditing
      ? dispatch(updatePost({ postId: post!._id, postData: formData }))
      : dispatch(createPost(formData));

    action.then((result) => {
      if (
        updatePost.fulfilled.match(result) ||
        createPost.fulfilled.match(result)
      ) {
        onClose();
      } else {
        toast.error((result.payload as string) || "An error occurred.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4"
        >
          <div className="md:col-span-2 space-y-2">
            <Label>Main Image</Label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                width="200"
                className="rounded object-cover"
              />
            )}
            <Input type="file" onChange={handleFileChange} />
          </div>

          {/* Baaki ke form fields */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...register("title", { required: "Title is required." })} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input {...register("slug", { required: "Slug is required." })} />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Short Description</Label>
            <Textarea
              {...register("description", {
                required: "Description is required.",
              })}
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Full Content</Label>
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required." }}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Author</Label>
            <Input {...register("author")} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              {...register("tags")}
              placeholder="e.g., health, insurance"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Meta Keywords (comma-separated)</Label>
            <Input
              {...register("metaKeywords")}
              placeholder="e.g., jeevan suraksha, health"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Meta Description (SEO)</Label>
            <Textarea {...register("metaDescription")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Image Alt Text</Label>
            <Input
              {...register("imageAltText", {
                required: "Image Alt Text is required.",
              })}
            />
            {errors.imageAltText && (
              <p className="text-red-500 text-sm mt-1">
                {errors.imageAltText.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Image Title Text</Label>
            <Input {...register("imageTitleText")} />
          </div>

          <DialogFooter className="md:col-span-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={actionStatus === "loading"}>
              {actionStatus === "loading" ? (
                <Loader2 className="animate-spin mr-2" />
              ) : null}
              Save Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
