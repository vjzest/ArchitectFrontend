import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import { fetchVideos, fetchTopics } from "@/lib/features/videos/videoSlice";
import { RootState, AppDispatch } from "@/lib/store";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Loader2,
  PlayCircle,
  X,
  ShoppingCart,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import YouTube from "react-youtube";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Input component जोड़ा गया

// फॉर्म स्टाइल्स
export const formStyles = {
  label: "block text-sm font-semibold mb-2 text-gray-700",
  input:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  select:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  textarea:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  fileInput:
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100",
};

// वीडियो मोडल कंपोनेंट
const VideoModal = ({
  videoId,
  onClose,
}: {
  videoId: string | null;
  onClose: () => void;
}) => {
  if (!videoId) return null;
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: { autoplay: 1, controls: 1 },
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 z-10"
          aria-label="Close video player"
        >
          <X size={24} />
        </button>
        <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
      </div>
    </div>
  );
};

const ThreeDWalkthroughPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );
  const [formKey, setFormKey] = useState(Date.now());

  const {
    videos,
    topics,
    listStatus: videoListStatus,
  } = useSelector((state: RootState) => state.videos);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState(""); // Page jump के लिए state
  const VIDEOS_PER_PAGE = 6;

  useEffect(() => {
    dispatch(fetchVideos());
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "3D Video Walkthrough");
    dispatch(submitCustomizationRequest(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Request submitted successfully! Our team will contact you shortly."
      );
      dispatch(resetStatus());
      setFormKey(Date.now());
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Submission failed. Please try again.");
      dispatch(resetStatus());
    }
  }, [actionStatus, error, dispatch]);

  const filteredVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    if (selectedTopic === "All") return videos;
    return videos.filter((video) => video.topic === selectedTopic);
  }, [videos, selectedTopic]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTopic]);

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const indexOfLastVideo = currentPage * VIDEOS_PER_PAGE;
  const indexOfFirstVideo = indexOfLastVideo - VIDEOS_PER_PAGE;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  const thumbnailOptions = (videoId: string) => ({
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      fs: 0,
      iv_load_policy: 3,
    },
  });

  return (
    <>
      <Helmet>
        <title>
          3D Elevation & Video Walkthrough | Interactive Home Designs
        </title>
        <meta
          name="description"
          content="Explore stunning 3D elevations and immersive video walkthroughs to visualize your dream home. Experience detailed designs and interactive tours for the perfect house plan."
        />
      </Helmet>

      <VideoModal
        videoId={playingVideoId}
        onClose={() => setPlayingVideoId(null)}
      />
      <Navbar />

      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Customize Your 3D Elevation
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Get a stunning 3D elevation and video walkthrough for your plan.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Your Request
              </h2>
              <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className={formStyles.label}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={formStyles.input}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={formStyles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={formStyles.input}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="whatsappNumber" className={formStyles.label}>
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    className={formStyles.input}
                    required
                  />
                </div>
                {/* ++ FIX HERE: Added the missing countryName input field ++ */}
                <div>
                  <label htmlFor="countryName" className={formStyles.label}>
                    Country
                  </label>
                  <input
                    type="text"
                    id="countryName"
                    name="countryName"
                    className={formStyles.input}
                    defaultValue="India"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="plotSize" className={formStyles.label}>
                    Your Plot Size (e.g., 30x40 ft)
                  </label>
                  <input
                    type="text"
                    id="plotSize"
                    name="plotSize"
                    placeholder="e.g., 30x40 ft"
                    className={formStyles.input}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className={formStyles.label}>
                    Describe Your Requirements
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about the number of rooms, style, Vastu needs, etc."
                    className={formStyles.textarea}
                    rows={4}
                  ></textarea>
                </div>
                <div>
                  <label className={formStyles.label}>
                    Upload Reference File (Optional)
                  </label>
                  <input
                    type="file"
                    name="referenceFile"
                    className={formStyles.fileInput}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can upload a hand sketch, image, or PDF file.
                  </p>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3"
                    disabled={actionStatus === "loading"}
                  >
                    {actionStatus === "loading" ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      "Send Request"
                    )}
                  </Button>
                </div>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-500">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900">
                  3D Elevation and video walkthrough
                </h3>
                <p className="text-center text-6xl font-extrabold text-orange-500 mt-4">
                  ₹2999
                </p>
                <p className="text-center text-lg font-semibold text-gray-500">
                  starting
                </p>
                <p className="text-center text-sm text-gray-400 mt-1">
                  1 floor
                </p>
                <p className="text-center text-sm font-semibold text-gray-500 mt-2">
                  Built-up Area
                </p>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>1- Model only model can not be change</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>2- renders copies diffrent angle</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>3- Delivery in 48 hours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>correction in 24 hours</span>
                  </li>
                </ul>
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-bold text-gray-800">Includes:</h4>
                  <ul className="mt-2 space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>only 3D elevation render</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border">
                <h3 className="text-2xl font-bold text-center text-gray-900">
                  3D elevation and video walkthrough
                </h3>
                <p className="text-center text-6xl font-extrabold text-orange-500 mt-4">
                  ₹4999
                </p>
                <p className="text-center text-lg font-semibold text-gray-500">
                  1
                </p>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span>1-Model provided only on given refrence.</span>
                  </li>
                  <li className="flex items-start">
                    <span>
                      2-Editing of designing and colour combination provided
                      upto satisfaction.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span>3-Delivery in 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>correction in 24 hours</span>
                  </li>
                </ul>
                <p className="text-center text-sm font-semibold text-gray-500 mt-2">
                  Built-up Area
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Our 3D Walkthrough Portfolio
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Explore our collection of 3D video walkthroughs.
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-md">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className={formStyles.select}
                aria-label="Filter videos by topic"
              >
                <option value="All">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-12">
            {videoListStatus === "loading" ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
              </div>
            ) : currentVideos.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No videos found for this topic.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentVideos.map((video) => {
                    const buyNowLink = video.productLink
                      ? `/product/${video.productLink._id}`
                      : "/products";
                    return (
                      <div
                        key={video._id}
                        className="group flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      >
                        <div
                          className="relative aspect-video bg-gray-900 cursor-pointer"
                          onClick={() =>
                            setPlayingVideoId(video.youtubeVideoId)
                          }
                        >
                          {video.youtubeVideoId ? (
                            <>
                              <YouTube
                                videoId={video.youtubeVideoId}
                                opts={thumbnailOptions(video.youtubeVideoId)}
                                className="absolute top-0 left-0 w-full h-full"
                                iframeClassName="pointer-events-none"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <PlayCircle className="h-16 w-16 text-white text-opacity-80" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              Invalid Video Link
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-1 rounded-full self-start">
                            {video.topic}
                          </span>
                          <h3
                            className="font-bold text-base mt-2 truncate text-gray-800"
                            title={video.title}
                          >
                            {video.title}
                          </h3>
                          <button
                            onClick={() =>
                              setPlayingVideoId(video.youtubeVideoId)
                            }
                            className="text-sm text-orange-600 hover:underline mt-1 inline-block text-left"
                          >
                            Watch Video
                          </button>
                          <div className="mt-auto pt-4">
                            <Link to={buyNowLink} className="w-full block">
                              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {video.productLink
                                  ? "Buy This Plan"
                                  : "Explore Plans"}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                    {/* --- Page Jump Form --- */}
                    <form
                      onSubmit={handlePageJump}
                      className="flex items-center gap-2"
                    >
                      <Input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={jumpToPage}
                        onChange={(e) => setJumpToPage(e.target.value)}
                        placeholder="Page..."
                        className="w-20 h-10"
                        aria-label="Jump to page"
                      />
                      <Button type="submit" variant="outline" className="h-10">
                        Go
                      </Button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThreeDWalkthroughPage;
