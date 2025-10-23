import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { RootState, AppDispatch } from "@/lib/store";
import {
  createReview as createProductReview,
  fetchProductBySlug,
} from "@/lib/features/products/productSlice";
import {
  createPlanReview,
  fetchPlanBySlug,
} from "@/lib/features/professional/professionalPlanSlice";
import {
  Heart,
  Plus,
  Minus,
  Loader2,
  ServerCrash,
  Star,
  ShoppingBag,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import house1 from "@/assets/house-1.jpg";
import { useCurrency } from "@/contexts/CurrencyContext";
import DisplayPrice from "@/components/DisplayPrice";

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {" "}
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z" />{" "}
  </svg>
);
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {" "}
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.48 3.4 1.35 4.85L2 22l5.42-1.47c1.41.82 3 1.29 4.62 1.29 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.15c-1.48 0-2.91-.41-4.15-1.16l-.3-.18-3.08.83.85-3.01-.2-.32c-.82-1.3-1.26-2.81-1.26-4.39 0-4.54 3.72-8.24 8.26-8.24s8.26 3.7 8.26 8.24-3.72 8.24-8.26 8.24zm4.52-6.19c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94s-.28.18-.52.06c-.24-.12-1.02-.38-1.94-1.2-1.03-.9-1.5-1.88-1.68-2.2v-.02c-.18-.32-.04-.5.1-.64.12-.12.26-.32.4-.42.12-.12.16-.2.24-.34s.04-.28-.02-.4c-.06-.12-.54-1.3-.74-1.78s-.4-.4-.54-.4h-.47c-.16 0-.42.06-.64.3s-.84.82-.84 2c0 1.18.86 2.32 1 2.48.12.16 1.67 2.55 4.05 3.56.58.24 1.05.38 1.41.48.58.16 1.11.14 1.52.08.45-.06 1.42-.58 1.62-1.14s.2-1.04.14-1.14c-.06-.1-.22-.16-.46-.28z" />{" "}
  </svg>
);
const TelegramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {" "}
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 7.15l-1.5 7.07c-.11.49-.4.61-.81.38l-2.26-1.67-1.09 1.05c-.12.12-.23.23-.47.23l.17-2.42 4.41-3.99c.19-.17-.04-.27-.29-.1l-5.45 3.43-2.35-.74c-.51-.16-.52-.51.11-.75l9.19-3.55c.43-.16.81.1.67.75z" />{" "}
  </svg>
);
const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    {" "}
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />{" "}
  </svg>
);
const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {" "}
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />{" "}
  </svg>
);
const PinterestIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {" "}
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.084-.602-.167-1.592.034-2.327.185-.68.995-4.223.995-4.223s-.255-.51-.255-1.267c0-1.185.688-2.072 1.553-2.072.73 0 1.08.547 1.08 1.202 0 .73-.465 1.822-.705 2.832-.202.84.42 1.532 1.258 1.532 1.508 0 2.65-1.59 2.65-3.868 0-2.046-1.445-3.48-3.566-3.48-2.35 0-3.738 1.743-3.738 3.355 0 .64.246 1.332.558 1.727.06.074.068.103.05.178-.02.083-.07.28-.09.358-.026.09-.105.12-.24.06-1.1-.47-1.8-1.82-1.8-3.132 0-2.438 2.085-4.73 5.25-4.73 2.76 0 4.86 1.956 4.86 4.418 0 2.712-1.72 4.882-4.14 4.882-.828 0-1.606-.43-1.865-.934 0 0-.405 1.616-.502 2.01-.132.52-.25.99-.4 1.392.36.11.732.17 1.114.17 6.627 0 12-5.373 12-12S18.627 2 12 2z" />{" "}
  </svg>
);
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {" "}
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />{" "}
  </svg>
);
const ThreadsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <path d="M11.5 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5" />{" "}
    <path d="M4 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5" />{" "}
    <path d="M8 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5" />{" "}
  </svg>
);

const StarRating = ({ rating, text }: { rating: number; text?: string }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
    {text && <span className="text-sm text-gray-600">{text}</span>}
  </div>
);

const slugify = (text: any) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const DetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();
  const { symbol, rate } = useCurrency();
  const isProfessionalPlan = location.pathname.includes("/professional-plan/");
  const {
    product: singleProduct,
    listStatus: adminListStatus,
    actionStatus: adminActionStatus,
    products: adminProducts,
  } = useSelector((state: RootState) => state.products);
  const {
    plan: singlePlan,
    listStatus: profListStatus,
    actionStatus: profActionStatus,
    plans: professionalPlans,
  } = useSelector((state: RootState) => state.professionalPlans);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const productIdFromSlug = slug?.split("-").pop();

  useEffect(() => {
    if (slug) {
      if (isProfessionalPlan) {
        dispatch(fetchPlanBySlug(slug));
      } else {
        dispatch(fetchProductBySlug(slug));
      }
    }
  }, [slug, dispatch, isProfessionalPlan]);

  const displayData: any = useMemo(() => {
    if (isProfessionalPlan) {
      return singlePlan && singlePlan._id === productIdFromSlug
        ? singlePlan
        : professionalPlans.find((p) => p._id === productIdFromSlug);
    }
    return singleProduct && singleProduct._id === productIdFromSlug
      ? singleProduct
      : adminProducts.find((p) => p._id === productIdFromSlug);
  }, [
    isProfessionalPlan,
    singleProduct,
    singlePlan,
    adminProducts,
    professionalPlans,
    productIdFromSlug,
  ]);

  const productName =
    displayData?.name ||
    displayData?.planName ||
    displayData?.Name ||
    "Untitled Plan";
  const productDescription =
    displayData?.description ||
    displayData?.Description ||
    "No description available.";
  const regularPrice =
    (displayData?.price > 0
      ? displayData.price
      : displayData?.["Regular price"]) ?? 0;
  const salePrice =
    (displayData?.salePrice > 0
      ? displayData.salePrice
      : displayData?.["Sale price"]) ?? null;
  const taxRate = displayData?.taxRate || 0;

  const isSale = useMemo(() => {
    if (!displayData) return false;
    if (
      salePrice !== null &&
      parseFloat(String(salePrice)) > 0 &&
      parseFloat(String(salePrice)) < parseFloat(String(regularPrice))
    ) {
      return true;
    }
    return displayData.isSale || false;
  }, [displayData, regularPrice, salePrice]);

  const currentPrice = isSale ? salePrice : regularPrice;
  const plotSize =
    displayData?.plotSize || displayData?.["Attribute 1 value(s)"] || "N/A";
  const plotArea =
    displayData?.plotArea ||
    (displayData?.["Attribute 2 value(s)"]
      ? parseInt(String(displayData["Attribute 2 value(s)"]).replace(/\D/g, ""))
      : "N/A");
  const rooms =
    displayData?.rooms || displayData?.["Attribute 3 value(s)"] || "N/A";
  const direction =
    displayData?.direction || displayData?.["Attribute 4 value(s)"] || "N/A";
  const bathrooms = displayData?.bathrooms || "N/A";
  const kitchen =
    displayData?.kitchen ||
    (displayData?.["Attribute 5 name"] === "Kitchen"
      ? displayData["Attribute 5 value(s)"]
      : "N/A");

  const productImages = useMemo(() => {
    if (!displayData) return [house1];
    let allImages: string[] = [];
    if (displayData.mainImage) allImages.push(displayData.mainImage);
    if (displayData.Images && typeof displayData.Images === "string") {
      allImages.push(
        ...displayData.Images.split(",").map((url: string) => url.trim())
      );
    }
    if (displayData.galleryImages && Array.isArray(displayData.galleryImages)) {
      allImages.push(...displayData.galleryImages);
    }
    const uniqueImages = [...new Set(allImages.filter(Boolean))];
    return uniqueImages.length > 0 ? uniqueImages : [house1];
  }, [displayData]);

  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(productName);
  const encodedImage = encodeURIComponent(productImages[selectedImageIndex]);
  const phoneNumber = "+918815939484";
  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      color: "bg-blue-800",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      color: "bg-green-500",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: <TwitterIcon />,
      color: "bg-black",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: <LinkedinIcon />,
      color: "bg-sky-700",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: "Pinterest",
      icon: <PinterestIcon />,
      color: "bg-red-600",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
    },
    {
      name: "Telegram",
      icon: <TelegramIcon />,
      color: "bg-sky-500",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "Threads",
      icon: <ThreadsIcon />,
      color: "bg-black",
      href: `https://www.threads.net/share?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "Call Us",
      icon: <PhoneIcon />,
      color: "bg-gray-700",
      href: `tel:${phoneNumber}`,
    },
  ];

  const handleAddToCart = () => {
    if (!displayData) return;
    addItem({
      productId: displayData._id,
      name: productName,
      price: currentPrice,
      image: productImages[0],
      size: plotSize,
      quantity: quantity,
      taxRate: taxRate,
    });
    toast({
      title: "Added to Cart!",
      description: `${quantity} x ${productName} has been added.`,
    });
  };

  const handleBuyNow = () => {
    if (!displayData) return;
    addItem({
      productId: displayData._id,
      name: productName,
      price: currentPrice,
      image: productImages[0],
      size: plotSize,
      quantity: quantity,
      taxRate: taxRate,
    });
    navigate("/checkout");
  };

  const whatsappMessage = `Hello, I'm interested in modifying this plan: *${productName}*. \nProduct Link: ${currentUrl}`;
  const encodedWhatsappMessage = encodeURIComponent(whatsappMessage);
  const whatsappLink = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodedWhatsappMessage}`;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast({
        title: "Error",
        description: "Please provide a rating and a comment.",
        variant: "destructive",
      });
      return;
    }
    const reviewAction = isProfessionalPlan
      ? createPlanReview({
          planId: productIdFromSlug!,
          reviewData: { rating, comment },
        })
      : createProductReview({
          productId: productIdFromSlug!,
          reviewData: { rating, comment },
        });
    dispatch(reviewAction)
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Review submitted successfully!",
        });
        setRating(0);
        setComment("");
        if (slug) {
          if (isProfessionalPlan) dispatch(fetchPlanBySlug(slug));
          else dispatch(fetchProductBySlug(slug));
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err as string,
          variant: "destructive",
        });
      });
  };

  const allProductsAndPlans = useMemo(() => {
    const adminArray = Array.isArray(adminProducts) ? adminProducts : [];
    const profArray = Array.isArray(professionalPlans) ? professionalPlans : [];
    return [
      ...adminArray.map((p) => ({ ...p, source: "product" })),
      ...profArray.map((p) => ({ ...p, source: "professional-plan" })),
    ];
  }, [adminProducts, professionalPlans]);

  const relatedProducts = useMemo(() => {
    if (!displayData || !allProductsAndPlans.length) return [];
    const currentCategory =
      (Array.isArray(displayData.category)
        ? displayData.category[0]
        : displayData.category) || displayData.Categories?.split(",")[0].trim();
    if (!currentCategory) return [];
    return allProductsAndPlans
      .filter((p: any) => {
        const pCategory =
          (Array.isArray(p.category) ? p.category[0] : p.category) ||
          p.Categories?.split(",")[0].trim();
        return pCategory === currentCategory && p._id !== productIdFromSlug;
      })
      .slice(0, 8)
      .map((p: any) => {
        const regPrice = (p.price > 0 ? p.price : p["Regular price"]) ?? 0;
        const sPrice =
          (p.salePrice > 0 ? p.salePrice : p["Sale price"]) ?? null;
        const isPricedSale =
          sPrice != null &&
          parseFloat(String(sPrice)) < parseFloat(String(regPrice));
        return { ...p, displayPrice: isPricedSale ? sPrice : regPrice };
      });
  }, [allProductsAndPlans, displayData, productIdFromSlug]);

  const actionStatus = isProfessionalPlan
    ? profActionStatus
    : adminActionStatus;
  const canonicalUrl = `${window.location.origin}${location.pathname}`;
  const isLoading =
    (adminListStatus === "loading" && !displayData && !isProfessionalPlan) ||
    (profListStatus === "loading" && !displayData && isProfessionalPlan);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    setPosition({ x: xPercent, y: yPercent });
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      if (direction === "left") {
        scrollContainerRef.current.scrollLeft -= scrollAmount;
      } else {
        scrollContainerRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {" "}
        <Loader2 className="w-12 h-12 animate-spin text-primary" />{" "}
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20">
          <ServerCrash className="mx-auto h-16 w-16 text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">Item Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The item you are looking for does not exist.
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Helmet>
        <title>{displayData.seo?.title || `${productName} | House Plan`}</title>
        <meta
          name="description"
          content={
            displayData.seo?.description || productDescription.substring(0, 160)
          }
        />
        {displayData.seo?.keywords && (
          <meta name="keywords" content={displayData.seo.keywords} />
        )}
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content={displayData.seo?.title || productName}
        />
        <meta
          property="og:description"
          content={
            displayData.seo?.description || productDescription.substring(0, 160)
          }
        />
        <meta property="og:image" content={productImages[0]} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={displayData.seo?.title || productName}
        />
        <meta
          name="twitter:description"
          content={
            displayData.seo?.description || productDescription.substring(0, 160)
          }
        />
        <meta name="twitter:image" content={productImages[0]} />
      </Helmet>

      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{productName}</span>
        </nav>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3 space-y-4">
              <div
                className="relative overflow-hidden rounded-xl shadow-md bg-gray-100 cursor-crosshair"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={productImages[selectedImageIndex]}
                  alt={displayData.seo?.altText || productName}
                  className="w-full h-96 lg:h-[500px] object-cover transition-opacity duration-300"
                  style={{ opacity: isZooming ? 0 : 1 }}
                />
                {isZooming && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${productImages[selectedImageIndex]})`,
                      backgroundPosition: `${position.x}% ${position.y}%`,
                      backgroundSize: "200%",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                )}
                <div className="absolute top-4 right-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`w-6 h-6 transition-all ${isLiked ? "fill-current text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-black/40 backdrop-blur-sm rounded-full">
                  <Button
                    onClick={handleBuyNow}
                    className="rounded-full px-6 py-3 text-base font-semibold flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <ShoppingBag className="w-5 h-5" /> Buy Now
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-lg ${selectedImageIndex === index ? "ring-2 ring-primary" : "ring-1 ring-gray-200"}`}
                    type="button"
                  >
                    <img
                      src={image}
                      alt={`${productName} view ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
                  {productName}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <StarRating
                    rating={displayData.rating || 0}
                    text={`${displayData.numReviews || 0} reviews`}
                  />
                </div>
                <div className="flex items-baseline gap-4 mb-6 flex-wrap">
                  {isSale && parseFloat(String(regularPrice)) > 0 && (
                    <span className="text-xl text-gray-500 line-through">
                      <DisplayPrice
                        inrPrice={parseFloat(String(regularPrice))}
                      />
                    </span>
                  )}
                  <span className="text-4xl font-bold text-primary">
                    <DisplayPrice inrPrice={parseFloat(String(currentPrice))} />
                  </span>
                  {isSale &&
                    parseFloat(String(regularPrice)) > 0 &&
                    parseFloat(String(currentPrice)) > 0 && (
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                        SAVE {symbol}
                        {(
                          (parseFloat(String(regularPrice)) -
                            parseFloat(String(currentPrice))) *
                          rate
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    )}
                </div>

                {/* --- **START: MOVED SPECIFICATIONS BLOCK** --- */}
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-semibold text-gray-700">
                        Plot Size:
                      </span>
                      <span className="text-gray-600">{plotSize}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-semibold text-gray-700">
                        Plot Area:
                      </span>
                      <span className="text-gray-600">{plotArea} sqft</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-semibold text-gray-700">
                        Rooms:
                      </span>
                      <span className="text-gray-600">{rooms}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-semibold text-gray-700">
                        Bathrooms:
                      </span>
                      <span className="text-gray-600">{bathrooms}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-semibold text-gray-700">
                        Kitchen:
                      </span>
                      <span className="text-gray-600">{kitchen}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-semibold text-gray-700">
                        Direction:
                      </span>
                      <span className="text-gray-600">{direction}</span>
                    </div>
                  </div>
                </div>
                {/* --- **END: MOVED SPECIFICATIONS BLOCK** --- */}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-gray-800">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 font-bold text-lg">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="w-full py-6 text-lg font-bold"
                  >
                    Add to Cart
                  </Button>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="secondary"
                      className="bg-green-500 hover:bg-green-600 text-white w-full py-6 text-lg font-bold flex items-center justify-center gap-2"
                    >
                      <WhatsAppIcon /> Modify Plan
                    </Button>
                  </a>
                </div>
              </div>
              <div className="pt-4">
                <h3 className="font-bold text-gray-700 mb-2">
                  Share this plan
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {socialPlatforms.map((p) => (
                    <a
                      key={p.name}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={p.name}
                      className={`w-9 h-9 flex items-center justify-center rounded-md text-white ${p.color} transition-opacity hover:opacity-80`}
                    >
                      {p.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Description
            </h2>
            <div
              className="text-gray-600 text-base leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: productDescription }}
            />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Customer Feedback
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h3>
              {displayData.reviews && displayData.reviews.length > 0 ? (
                <div className="space-y-6">
                  {displayData.reviews.map((review: any) => (
                    <div
                      key={review._id}
                      className="bg-white p-4 rounded-lg border shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900">
                          {review.name}
                        </h4>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-gray-600 mt-2">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 bg-white p-6 rounded-lg text-center">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Write a Review
              </h3>
              {userInfo ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="space-y-4 bg-white p-6 rounded-lg border shadow-sm"
                >
                  <div>
                    <label className="font-bold text-gray-700">
                      Your Rating
                    </label>
                    <div className="flex mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-7 w-7 cursor-pointer ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="comment"
                      className="font-bold text-gray-700"
                    >
                      Your Comment
                    </label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this plan..."
                      className="mt-2"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-bold py-3"
                    disabled={actionStatus === "loading"}
                  >
                    {actionStatus === "loading" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </form>
              ) : (
                <p className="text-gray-600 bg-white p-6 rounded-lg text-center">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-primary underline font-bold"
                  >
                    log in
                  </Link>{" "}
                  to write a review.
                </p>
              )}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="border-t pt-16 mt-16">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
              Related Products
            </h2>
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md hover:bg-white"
                onClick={() => handleScroll("left")}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto space-x-6 pb-4 scroll-smooth scrollbar-hide"
              >
                {relatedProducts.map((relatedProd: any) => {
                  const relatedProductName =
                    relatedProd.name ||
                    relatedProd.planName ||
                    relatedProd.Name;
                  const relatedLink = `/${relatedProd.source}/${slugify(relatedProductName)}-${relatedProd._id}`;
                  return (
                    <Link
                      key={relatedProd.id}
                      to={relatedLink}
                      className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden w-72 flex-shrink-0"
                    >
                      <img
                        src={
                          relatedProd.mainImage ||
                          relatedProd.Images?.split(",")[0].trim() ||
                          house1
                        }
                        alt={relatedProductName}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                          {relatedProductName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {relatedProd.plotSize ||
                            relatedProd["Attribute 1 value(s)"]}
                        </p>
                        <div className="text-xl font-bold text-primary">
                          <DisplayPrice
                            inrPrice={parseFloat(
                              String(relatedProd.displayPrice)
                            )}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md hover:bg-white"
                onClick={() => handleScroll("right")}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DetailPage;
