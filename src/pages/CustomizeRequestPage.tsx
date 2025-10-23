import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react"; // ज़रूरी आइकन्स Import करें
import { RootState, store } from "@/lib/store"; // RootState और store को import करें

// नए लेआउट के लिए Form Styles
const formStyles = {
  label: "block text-sm font-medium text-gray-700 mb-2",
  input:
    "w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition",
  textarea:
    "w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px] resize-y transition",
  fileInput:
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500/10 file:text-orange-600 hover:file:bg-orange-500/20 cursor-pointer",
};

const CustomizeFloorPlanPage = () => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );
  const [formKey, setFormKey] = useState(Date.now());

  // Form submission handler
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "Floor Plan Customization"); // Specify request type
    (dispatch as typeof store.dispatch)(submitCustomizationRequest(formData));
  };

  // Effect to show success/error toasts
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Request submitted successfully! Our team will contact you shortly."
      );
      dispatch(resetStatus());
      setFormKey(Date.now()); // Reset the form by changing its key
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
          Customize Your Floor Plan | Modern Layouts & Design Options
        </title>
        <meta
          name="description"
          content="Customize your floor plan with modern layouts and flexible design options. Easily create the perfect space to fit your needs—start personalizing your dream home today."
        />
      </Helmet>

      <Navbar />
      <main className="max-w-6xl mx-auto p-4 md:p-8 py-12 md:py-16">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <form key={formKey} onSubmit={handleSubmit}>
            <div className="flex flex-col-reverse lg:flex-row">
              {/* === FORM SECTION (Left Side) === */}
              <div className="w-full lg:w-1/2 p-8 md:p-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                  Customize Your Floor Plan
                </h2>
                <div className="space-y-5">
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
                      className={formStyles.input}
                      placeholder="e.g., 30x40 ft"
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
                      rows={5}
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

              {/* === CARDS SECTION (Right Side) - आपकी Images के अनुसार === */}
              <div className="w-full lg:w-1/2 bg-gray-50 p-8 flex items-stretch justify-center">
                <div className="flex h-full w-full flex-col items-center justify-center gap-y-8">
                  {/* == CARD 1 (₹1) - MOST POPULAR == */}
                  <div className="relative w-full max-w-sm rounded-xl border-2 border-orange-500 bg-white p-8 text-center shadow-lg flex flex-col h-full">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Most Popular
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Floor Plan
                    </h3>
                    <div className="my-4">
                      <span className="text-7xl font-bold text-orange-500">
                        ₹1
                      </span>
                      <p className="text-lg text-gray-600">Per sq.ft.</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Built-up Area
                      </p>
                    </div>
                    <div className="border-t pt-6 mt-4 text-left space-y-3 flex-grow">
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />{" "}
                        Revision Unlimited upto satisfaction
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />{" "}
                        Requirements fixed
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />{" "}
                        General vastu follows
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />{" "}
                        24 Hours Delivery
                      </p>
                      <p className="font-semibold text-gray-800 pt-2">
                        Includes: ...
                      </p>
                    </div>
                  </div>

                  {/* == CARD 2 (₹5) == */}
                  <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center shadow-md flex flex-col h-full">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Floor Plan
                    </h3>
                    <div className="my-4">
                      <span className="text-7xl font-bold text-orange-500">
                        ₹5
                      </span>
                      <p className="text-lg text-gray-600">Per sq.ft.</p>
                    </div>
                    <div className="border-t pt-6 mt-4 text-left space-y-3 flex-grow">
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                        "3 plan option"
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                        "Furniture layout"
                      </p>
                      <div className="flex items-start text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                          "Landscaping" Conceptual planning 3 Separate Designer
                          appointed for this task
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CustomizeFloorPlanPage;
