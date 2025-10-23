// src/pages/CountryCustomizationPage.jsx

import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import houseImageForForm from "@/assets/house-form-image.jpg";

const CountryCustomizationPage = () => {
  const { countryName } = useParams(); 

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast.success(
      `Customization request for ${countryName} sent successfully!`
    );
    e.target.reset(); 
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Customize a Plan for {countryName}
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* ✨ Country Field (pre-filled and read-only) ✨ */}
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={countryName}
                    className="mt-1 bg-gray-200 border-gray-300 text-gray-500"
                    readOnly
                  />
                </div>

                {/* Other form fields */}
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    className="mt-1 bg-gray-100 border-transparent"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 bg-gray-100 border-transparent"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    className="mt-1 bg-gray-100 border-transparent"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="width">Width (ft)</Label>
                    <Input
                      id="width"
                      name="width"
                      className="mt-1 bg-gray-100 border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="length">Length (ft)</Label>
                    <Input
                      id="length"
                      name="length"
                      className="mt-1 bg-gray-100 border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="direction">Facing Direction</Label>
                  <Select name="direction">
                    <SelectTrigger
                      id="direction"
                      className="mt-1 bg-gray-100 border-transparent"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Your message..."
                    className="mt-1 bg-gray-100 border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="referenceFile">
                    Upload Reference (Image or PDF)
                  </Label>
                  <Input
                    id="referenceFile"
                    name="referenceFile"
                    type="file"
                    className="mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 text-base"
                >
                  Send Request
                </Button>
              </form>
            </div>

            {/* Right Side: Image */}
            <div className="w-full lg:w-1/2 hidden lg:block">
              <img
                src={houseImageForForm}
                alt="Beautiful modern house"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CountryCustomizationPage;
