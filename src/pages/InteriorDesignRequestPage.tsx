"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async"; // Helmet को import करें
import { RootState, store } from "@/lib/store";
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Star } from "lucide-react";

// Form styles defined locally
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
};

const InteriorDesignRequestPage: React.FC = () => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );
  const [formKey, setFormKey] = useState<number>(Date.now());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "Interior Design");
    (dispatch as typeof store.dispatch)(submitCustomizationRequest(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Request submitted successfully!");
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
        <title>Complete House Plan File | Detailed Blueprints & Designs</title>
        <meta
          name="description"
          content="Create your ideal home with our customizable house plan files. Easily modify layouts, room sizes, and design details to match your unique style and requirements. Start designing today!"
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
                  Design Your Interior Space
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
                    <label className={formStyles.label}>Room Size</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label htmlFor="roomWidth" className={formStyles.label}>
                          Width (Ft)
                        </label>
                        <input
                          type="number"
                          id="roomWidth"
                          name="roomWidth"
                          className={formStyles.input}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="roomLength"
                          className={formStyles.label}
                        >
                          Length (Ft)
                        </label>
                        <input
                          type="number"
                          id="roomLength"
                          name="roomLength"
                          className={formStyles.input}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="designFor" className={formStyles.label}>
                      Design For
                    </label>
                    <select
                      id="designFor"
                      name="designFor"
                      className={formStyles.select}
                    >
                      <option value="Residential Interior Design">
                        Residential Interior Design
                      </option>
                      <option value="Commercial Interior Design">
                        Commercial Interior Design
                      </option>
                    </select>
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
                  {/* == STANDARD CARD (CUSTOM PRICE) == */}
                  <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center shadow-md flex flex-col h-full">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Complete House Plan File
                    </h3>
                    <div className="my-4">
                      <span className="text-6xl font-bold text-orange-500">
                        ₹Custom
                      </span>
                      <p className="text-lg text-gray-600">Price</p>
                    </div>
                    <div className="border-t pt-6 mt-4 text-left space-y-3 flex-grow">
                      <p className="font-semibold text-gray-800 mb-2">
                        Includes:
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Floor plan
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Furniture layout
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Column layout
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Door/Window schedule
                      </p>
                    </div>
                  </div>

                  {/* == PREMIUM CARD (₹40/sqft) == */}
                  <div className="w-full max-w-sm rounded-xl border-2 border-orange-500 bg-white p-8 text-center shadow-lg flex flex-col h-full">
                    <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                      Complete House Plan File With Interior Design And Video
                      Walkthrough
                    </h3>
                    <div className="my-4">
                      <span className="text-7xl font-bold text-orange-500">
                        ₹40
                      </span>
                      <p className="text-lg text-gray-600">Per sqft</p>
                    </div>
                    <div className="border-t pt-6 mt-4 text-left space-y-3 flex-grow">
                      <p className="font-semibold text-gray-800 mb-2">
                        Includes Everything in Standard, plus:
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Electrical layout
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        Plumbing layout
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        3D Interior Views
                      </p>
                      <p className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />{" "}
                        3D Video Walkthrough
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

export default InteriorDesignRequestPage;
