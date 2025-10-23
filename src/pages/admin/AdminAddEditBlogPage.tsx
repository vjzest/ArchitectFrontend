import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ReactQuill CSS

import {
  createPost,
  updatePost,
  fetchPostBySlug,
  clearCurrentPost,
} from "@/lib/features/blog/blogSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// ReactQuill editor ke toolbar options
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Heading options for H2, H3 etc.
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
};

const AdminAddEditBlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const {
    post,
    actionStatus,
    status: postStatus,
  } = useSelector((state: RootState) => state.blog);
  const isEditing = Boolean(slug);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      author: "Admin",
      status: "Draft",
      mainImage: null,
      tags: "",
      h1Text: "", // SEO H1 tag
      metaDescription: "",
      metaKeywords: "",
      imageAltText: "",
      imageTitleText: "",
    },
  });

  const titleValue = watch("title");
  const mainImageValue = watch("mainImage");

  // Title se slug generate karein
  useEffect(() => {
    if (titleValue && !isEditing) {
      const generatedSlug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", generatedSlug);
    }
  }, [titleValue, setValue, isEditing]);

  // Edit mode mein data fetch karein
  useEffect(() => {
    if (isEditing && slug) {
      dispatch(fetchPostBySlug(slug));
    }
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, slug, isEditing]);

  // Form ko data se populate karein
  useEffect(() => {
    if (isEditing && post) {
      reset({
        ...post,
        tags: post.tags?.join(", ") || "",
        metaKeywords: post.metaKeywords?.join(", ") || "",
      });
    }
  }, [post, isEditing, reset]);

  // Form submit logic
  const onSubmit = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key !== "mainImage" && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    if (data.mainImage && data.mainImage[0]) {
      formData.append("mainImage", data.mainImage[0]);
    }

    const action =
      isEditing && post
        ? dispatch(updatePost({ postId: post._id, postData: formData }))
        : dispatch(createPost(formData));

    action.then((result) => {
      if (
        updatePost.fulfilled.match(result) ||
        createPost.fulfilled.match(result)
      ) {
        toast.success(
          `Blog post ${isEditing ? "updated" : "created"} successfully!`
        );
        navigate("/admin/blogs");
      } else {
        toast.error(
          String(result.payload) ||
            `Failed to ${isEditing ? "update" : "create"} post.`
        );
      }
    });
  };

  if (isEditing && postStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        {isEditing ? "Edit Blog Post" : "Add New Blog Post"}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-8 rounded-lg shadow-md"
      >
        {/* === CORE FIELDS === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title" className="font-semibold">
              Post Title (Default H1)
            </Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required." })}
              className="mt-2"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="slug" className="font-semibold">
              URL Slug
            </Label>
            <Input
              id="slug"
              {...register("slug", { required: "Slug is required." })}
              className="mt-2 bg-gray-50"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="description" className="font-semibold">
            Short Description
          </Label>
          <Textarea
            id="description"
            {...register("description", {
              required: "Description is required.",
            })}
            className="mt-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <Label className="font-semibold">
            Main Content (For H2, H3 tags)
          </Label>
          <Controller
            name="content"
            control={control}
            rules={{ required: "Main content is required." }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value || ""}
                onChange={field.onChange}
                className="mt-2 bg-white"
                modules={quillModules}
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="author" className="font-semibold">
              Author
            </Label>
            <Input
              id="author"
              {...register("author", { required: "Author is required." })}
              className="mt-2"
            />
            {errors.author && (
              <p className="text-red-500 text-sm mt-1">
                {errors.author.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="status" className="font-semibold">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* === IMAGE & IMAGE ATTRIBUTES === */}
        <div className="border-t pt-6 space-y-4">
          <h2 className="text-xl font-semibold">Image & Attributes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="mainImage" className="font-semibold">
                Main Image
              </Label>
              <Input
                id="mainImage"
                type="file"
                {...register("mainImage", { required: !isEditing })}
                accept="image/*"
                className="mt-2"
              />
              {errors.mainImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mainImage.message}
                </p>
              )}
              {(post?.mainImage || mainImageValue?.[0]) && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Preview:</p>
                  <img
                    src={
                      mainImageValue?.[0]
                        ? URL.createObjectURL(mainImageValue[0])
                        : post.mainImage
                    }
                    alt="Image Preview"
                    width="200"
                    className="rounded-md object-cover mt-2 border"
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageAltText" className="font-semibold">
                  Image Alt Text (Required)
                </Label>
                <Input
                  id="imageAltText"
                  {...register("imageAltText", {
                    required: "Alt text is required.",
                  })}
                  className="mt-2"
                />
                {errors.imageAltText && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.imageAltText.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="imageTitleText" className="font-semibold">
                  Image Title Text
                </Label>
                <Input
                  id="imageTitleText"
                  {...register("imageTitleText")}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* === TAGS & SEO FIELDS === */}
        <div className="border-t pt-6 space-y-4">
          <h2 className="text-xl font-semibold">Tags & SEO Meta</h2>
          <div>
            <Label htmlFor="h1Text" className="font-semibold">
              SEO H1 Tag (Optional)
            </Label>
            <Input
              id="h1Text"
              {...register("h1Text")}
              placeholder="Optional: Custom H1 for SEO"
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              If left empty, the 'Post Title' will be used as the H1 tag.
            </p>
          </div>
          <div>
            <Label htmlFor="tags" className="font-semibold">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="e.g., health, insurance, policy"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="metaKeywords" className="font-semibold">
              Meta Keywords (comma-separated)
            </Label>
            <Input
              id="metaKeywords"
              {...register("metaKeywords")}
              placeholder="e.g., jeevan suraksha, health guard"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="metaDescription" className="font-semibold">
              Meta Description (for search engines)
            </Label>
            <Textarea
              id="metaDescription"
              {...register("metaDescription")}
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={actionStatus === "loading"}>
            {actionStatus === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddEditBlogPage;
