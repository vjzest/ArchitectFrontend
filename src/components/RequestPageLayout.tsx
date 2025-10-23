// src/components/RequestPageLayout.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface RequestPageLayoutProps {
  title: string;
  imageUrl: string;
  imageAlt: string;
  children: React.ReactNode;
  isLoading: boolean;
  // CHANGE 1: The 'onSubmit' prop is no longer needed here.
}

export const formStyles = {
  label: "block text-sm font-medium text-gray-700 mb-2",
  input:
    "w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition",
  // NOTE: I added a 'select' style to fix a potential missing style issue from your code.
  select:
    "w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition",
  textarea:
    "w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y transition",
  fileInput:
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer",
};

const RequestPageLayout: React.FC<RequestPageLayoutProps> = ({
  title,
  imageUrl,
  imageAlt,
  children,
  isLoading,
}) => {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 py-12 md:py-16">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
            {title}
          </h2>

          {/* CHANGE 2: The <form> tag has been removed. We render the children and button directly. */}
          <div className="space-y-5">
            {children}
            <Button
              type="submit"
              className="btn-primary w-full mt-6 text-lg py-3.5 h-14"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Send Request
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default RequestPageLayout;
