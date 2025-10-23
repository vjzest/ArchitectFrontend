import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState, AppDispatch } from "@/lib/store";
import {
  submitInquiry,
  resetActionStatus,
} from "@/lib/features/corporateInquiries/inquirySlice";

import RequestPageLayout, { formStyles } from "@/components/RequestPageLayout";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const packageDetails = {
  "builders-colonizers": "Builders & Colonizers",
  "offices-shops": "Offices & Shops",
  "factories-educational": "Factories & Educational",
};

interface IFormInput {
  companyName: string;
  contactPerson: string;
  workEmail: string;
  phoneNumber: string;
  projectDetails: string;
}

const CorporateInquiryPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { packageType } = useParams<{
    packageType: keyof typeof packageDetails;
  }>();
  const pageTitle = packageType
    ? packageDetails[packageType]
    : "Corporate Project";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const [projectBrief, setProjectBrief] = useState<File | null>(null);
  const projectBriefInputRef = React.useRef<HTMLInputElement>(null); // File input ke liye ref

  const { actionStatus, error } = useSelector(
    (state: RootState) => state.corporateInquiries
  );

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    formData.append("projectType", pageTitle);

    if (projectBrief) {
      formData.append("projectBrief", projectBrief);
    }

    dispatch(submitInquiry(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Inquiry submitted successfully! We will get back to you shortly."
      );
      dispatch(resetActionStatus());

      // Form fields ko reset karein
      reset();
      setProjectBrief(null);
      // File input ko reset karne ke liye
      if (projectBriefInputRef.current) {
        projectBriefInputRef.current.value = "";
      }

      // ✨ YAHAN BADLAAV HAI: navigate wali line hata di gayi hai ✨
      // navigate("/thank-you");
    }
    if (actionStatus === "failed") {
      toast.error(
        String(error) || "Failed to submit inquiry. Please try again."
      );
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, reset]);

  return (
    <>
      <Navbar />
      <div className="bg-soft-teal">
        <RequestPageLayout
          title={`Inquiry for ${pageTitle}`}
          imageUrl="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          imageAlt="Corporate team planning a project"
          isLoading={actionStatus === "loading"}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor="companyName" className={formStyles.label}>
              Company Name*
            </label>
            <input
              type="text"
              id="companyName"
              className={formStyles.input}
              {...register("companyName", {
                required: "Company name is required",
              })}
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="contactPerson" className={formStyles.label}>
              Contact Person*
            </label>
            <input
              type="text"
              id="contactPerson"
              className={formStyles.input}
              {...register("contactPerson", {
                required: "Contact person is required",
              })}
            />
            {errors.contactPerson && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contactPerson.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="workEmail" className={formStyles.label}>
              Work Email*
            </label>
            <input
              type="email"
              id="workEmail"
              className={formStyles.input}
              {...register("workEmail", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.workEmail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.workEmail.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phoneNumber" className={formStyles.label}>
              Phone Number*
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className={formStyles.input}
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="projectType" className={formStyles.label}>
              Project Type
            </label>
            <input
              type="text"
              id="projectType"
              className={`${formStyles.input} cursor-not-allowed bg-gray-200`}
              value={pageTitle}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="projectDetails" className={formStyles.label}>
              Project Details*
            </label>
            <textarea
              id="projectDetails"
              placeholder="Briefly describe your project requirements..."
              className={formStyles.textarea}
              {...register("projectDetails", {
                required: "Project details are required",
              })}
            ></textarea>
            {errors.projectDetails && (
              <p className="text-red-500 text-xs mt-1">
                {errors.projectDetails.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="projectBrief" className={formStyles.label}>
              Upload Project Brief (Optional)
            </label>
            <input
              ref={projectBriefInputRef} // Ref ko input se connect karein
              type="file"
              id="projectBrief"
              className={formStyles.fileInput}
              onChange={(e) =>
                setProjectBrief(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>
        </RequestPageLayout>
      </div>
      <Footer />
    </>
  );
};

export default CorporateInquiryPage;
