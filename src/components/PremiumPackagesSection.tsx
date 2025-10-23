import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchAllPackages } from "@/lib/features/packages/packageSlice";
import { Button } from "@/components/ui/button"; 

const PremiumPackageCard = ({ pkg, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const allItems = pkg.features || [];
  const CONTENT_THRESHOLD = 4;
  const needsTruncation = allItems.length > CONTENT_THRESHOLD;
  const itemsToRender =
    needsTruncation && !isExpanded
      ? allItems.slice(0, CONTENT_THRESHOLD)
      : allItems;

  return (
    <motion.div
      key={pkg._id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-card border-2 rounded-xl p-6 sm:p-8 text-center transition-all duration-300 relative flex flex-col h-full
        ${pkg.isPopular ? "border-primary shadow-lg lg:scale-105" : "border-gray-200 hover:border-primary"}`}
    >
      {pkg.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
          <Star size={12} fill="white" />
          <span>BEST VALUE</span>
        </div>
      )}
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-foreground mb-4">{pkg.title}</h3>
        <div className="mb-6">
          <span className="text-5xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
          <p className="text-muted-foreground">{pkg.unit}</p>
        </div>
        <div className="text-left mt-6 mb-8 text-base space-y-3">
          {itemsToRender.map((feature, idx) => (
            <div key={`${feature}-${idx}`} className="flex items-center gap-3">
              <CheckCircle size={18} className="text-green-500" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>
        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary font-semibold text-sm -mt-4 mb-4 flex items-center justify-center w-full"
          >
            {isExpanded ? "Show Less" : "Show More..."}
            {isExpanded ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>
        )}
        {pkg.areaType && (
          <p className="text-sm text-muted-foreground mb-6">{pkg.areaType}</p>
        )}
      </div>

      <Button
        asChild
        className="w-full btn-primary text-center block mt-auto py-6 text-lg"
      >
        <Link
          to="/premium-booking-form"
          state={{
            packageName: pkg.title,
            packageUnit: pkg.unit,
            packagePrice: pkg.price,
          }}
        >
          Select Premium Plan
        </Link>
      </Button>
    </motion.div>
  );
};

const PremiumPackagesSection = () => {
  const dispatch: AppDispatch = useDispatch();
  const { packages, status, error } = useSelector(
    (state: RootState) => state.packages
  );

  useEffect(() => {
    dispatch(fetchAllPackages());
  }, [dispatch]);

  const premiumPackages = packages.filter(
    (pkg) => pkg.packageType === "premium"
  );

  if (status === "loading") {
    return (
      <section className="py-20 bg-soft-teal">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg">Loading Premium Packages...</p>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="py-20 bg-red-50">
        <div className="container mx-auto px-4 text-center text-red-600">
          <h3 className="text-2xl font-bold">Something went wrong!</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-soft-teal">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground">
            Premium Packages
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Upgrade to a premium experience with more features.
          </p>
        </motion.div>

        <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 lg:gap-8 -mx-4 px-4 lg:mx-auto lg:px-0 pb-4 lg:pb-0 max-w-5xl">
          {/* Hide scrollbar */}
          <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; } .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

          {premiumPackages.map((pkg, index) => (
            <div
              key={pkg._id}
              className="flex-shrink-0 w-4/5 sm:w-2/3 md:w-1/2 lg:w-auto"
            >
              <PremiumPackageCard pkg={pkg} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumPackagesSection;
