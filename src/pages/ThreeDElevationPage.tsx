import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async"; // Helmet को import करें
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Star } from "lucide-react";

// Form styles ko yahin par define kar diya hai
const formStyles = {
  label: "block text-sm font-medium text-gray-700 mb-2",
  input:
    "w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition",
  select:
    "w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition",
  textarea:
    "w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px] resize-y transition",
  fileInput:
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500/10 file:text-orange-600 hover:file:bg-orange-500/20 cursor-pointer",
  radioLabel: "flex items-center text-gray-700 cursor-pointer",
  radioInput: "h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500",
};

const ThreeDElevationPage: React.FC = () => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );

  const [formKey, setFormKey] = useState<number>(Date.now());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "3D Elevation");
    (dispatch as typeof store.dispatch)(submitCustomizationRequest(formData));
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

  const isLoading = actionStatus === "loading";

  return (
    <>
      {/* --- Helmet Tag for SEO --- */}
      <Helmet>
        <title>
          Customize Floor Plans & 3D Elevations | Modern Home Designs
        </title>
        <meta
          name="description"
          content="Design your dream home with customizable floor plans and stunning 3D elevations. Explore modern design options tailored to your needs and bring your vision to life today."
        />
      </Helmet>

      <Navbar />
      <div className="max-w-6xl mx-auto p-4 md:p-8 py-12 md:py-16">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <form key={formKey} onSubmit={handleSubmit}>
            <div className="flex flex-col-reverse lg:flex-row">
              {/* === FORM SECTION (Left Side) === */}
              <div className="w-full lg:w-1/2 p-8 md:p-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                  Get Your 3D Elevation
                </h2>
                <div className="space-y-5">
                  {/* Form fields */}
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
                    <label
                      htmlFor="whatsappNumber"
                      className={formStyles.label}
                    >
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
                  {/* ++ FIX HERE: Changed name="country" to name="countryName" ++ */}
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
                    <label htmlFor="planForFloor" className={formStyles.label}>
                      Plan for Floor
                    </label>
                    <select
                      id="planForFloor"
                      name="planForFloor"
                      className={formStyles.select}
                    >
                      <option value="G">G</option>{" "}
                      <option value="G+1">G+1</option>{" "}
                      <option value="G+2">G+2</option>
                    </select>
                  </div>
                  <div>
                    <label className={formStyles.label}>
                      3D Elevation Type
                    </label>
                    <div className="flex gap-6 pt-2">
                      <label className={formStyles.radioLabel}>
                        <input
                          type="radio"
                          name="elevationType"
                          value="Front"
                          defaultChecked
                          className={formStyles.radioInput}
                        />{" "}
                        <span className="ml-2">Front</span>
                      </label>
                      <label className={formStyles.radioLabel}>
                        <input
                          type="radio"
                          name="elevationType"
                          value="Corner"
                          className={formStyles.radioInput}
                        />{" "}
                        <span className="ml-2">Corner</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className={formStyles.label}>
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Your message..."
                      className={formStyles.textarea}
                    ></textarea>
                  </div>
                  <div>
                    <label className={formStyles.label}>
                      Upload Reference (Image or PDF)
                    </label>
                    <input
                      type="file"
                      name="referenceFile"
                      className={formStyles.fileInput}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full mt-6 text-lg py-3.5 h-14 bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    )}
                    Send Request
                  </Button>
                </div>
              </div>

              {/* === CARDS SECTION (Right Side) === */}
              <div className="w-full lg:w-1/2 bg-gray-50 p-8 flex items-stretch justify-center">
                <div className="flex h-full w-full flex-col items-center justify-center gap-y-8">
                  {/* == STANDARD 3D ELEVATION CARD == */}
                  <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 pt-12 text-center shadow-md flex flex-col h-full relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      MOST POPULAR
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Floor Plan + 3D Elevation
                    </h3>
                    <div className="my-4">
                      <span className="text-7xl font-bold text-orange-500">
                        ₹5
                      </span>
                      <p className="text-lg text-gray-600">Per sq.ft.</p>
                    </div>
                    <div className="border-t pt-6 mt-4 text-left space-y-3 flex-grow">
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        2D Floor Plan
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Standard 3D View
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Basic Detailing
                      </p>
                    </div>
                  </div>

                  {/* == PREMIUM 3D ELEVATION CARD == */}
                  <div className="w-full max-w-sm rounded-xl border-2 border-orange-500 bg-white p-8 pt-12 text-center shadow-lg flex flex-col h-full relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center">
                      <Star className="w-4 h-4 mr-2" fill="white" /> BEST VALUE
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Floor Plan + 3D Elevation
                    </h3>
                    <div className="my-4">
                      <span className="text-7xl font-bold text-orange-500">
                        ₹10
                      </span>
                      <p className="text-lg text-gray-600">Per sqft</p>
                    </div>
                    <div className="border-t pt-6 mt-4 text-left space-y-3 flex-grow">
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Everything in Standard
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Realistic 3D Renders
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Source File Included
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThreeDElevationPage;
