import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchVideos,
  fetchTopics,
  addVideoLink,
  deleteVideo,
  resetActionStatus,
  fetchAllProductsForDropdown,
} from "@/lib/features/videos/videoSlice";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2, Youtube, Clapperboard } from "lucide-react";

const VideoUploadPage = () => {
  const dispatch = useDispatch();
  const { videos, topics, listStatus, actionStatus, error } = useSelector(
    (state) => state.videos
  );
  const { products: allProducts } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [topic, setTopic] = useState("");
  const [productLink, setProductLink] = useState("");

  useEffect(() => {
    if (userInfo?.role === "admin") {
      dispatch(fetchVideos());
      dispatch(fetchTopics());
      // प्रोडक्ट्स की लिस्ट भी फेच करें (अगर पहले से नहीं है)
      if (!allProducts || allProducts.length === 0) {
        dispatch(fetchAllProductsForDropdown({}));
      }
    }
  }, [dispatch, userInfo, allProducts]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(error || "An error occurred.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !youtubeLink || !topic) {
      return toast.error("Please provide a Title, YouTube Link, and Topic.");
    }
    dispatch(
      addVideoLink({
        title,
        youtubeLink,
        topic,
        productLink: productLink === "none" ? null : productLink, // 'none' को null में बदलें
      })
    ).then((res) => {
      if (res.type.endsWith("fulfilled")) {
        setTitle("");
        setYoutubeLink("");
        setTopic("");
        setProductLink("");
        dispatch(fetchTopics());
      }
    });
  };

  const handleDelete = (videoId) => {
    if (window.confirm("Are you sure you want to delete this video link?")) {
      dispatch(deleteVideo(videoId));
    }
  };

  const productOptions = allProducts.map((p) => ({
    value: p._id,
    label: p.name || p.Name,
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
          Manage Videos
        </h1>
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-2xl">Add New YouTube Video</CardTitle>
            <CardDescription>
              Enter the details below to add a new video link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Beautiful 3BHK Interior Design"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., 3D Walkthrough"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    list="topic-suggestions"
                    required
                  />
                  <datalist id="topic-suggestions">
                    {topics.map((t, i) => (
                      <option key={i} value={t} />
                    ))}
                  </datalist>
                </div>
              </div>
              <div>
                <Label htmlFor="youtubeLink">YouTube URL</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="youtubeLink"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="productLink">Link to Product (Optional)</Label>
                <Select onValueChange={setProductLink} value={productLink}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product to link..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* FIX: value को "none" करें और इसे डिसएबल न करें */}
                    <SelectItem value="none">None</SelectItem>
                    {productOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={actionStatus === "loading"}
              >
                {actionStatus === "loading" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Add Video
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Uploaded Videos
          </h2>
          {listStatus === "loading" ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : videos.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Clapperboard className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-500">
                  No videos have been added yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <Card
                  key={video._id}
                  className="overflow-hidden group relative"
                >
                  <a
                    href={video.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                    />
                  </a>
                  <CardContent className="p-4">
                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">
                      {video.topic}
                    </span>
                    <h3
                      className="font-semibold text-base mt-2 truncate"
                      title={video.title}
                    >
                      {video.title}
                    </h3>
                    {video.productLink && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Linked to:{" "}
                        <span className="font-medium">
                          {video.productLink.name || video.productLink.Name}
                        </span>
                      </p>
                    )}
                  </CardContent>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(video._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUploadPage;
