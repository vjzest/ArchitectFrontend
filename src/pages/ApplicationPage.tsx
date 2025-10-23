// pages/ApplicationPage.tsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
type AppDispatch = typeof store.dispatch;
import { toast } from "sonner";
import {
  registerUser,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
import { Loader2 } from "lucide-react";

const professionalSubRoles = [
  "Architect / Junior Architect",
  "Civil Structural Engineer",
  "Civil Design Engineer",
  "Interior Designer",
  "Contractor",
  "Vastu Consultant",
  "Site Engineer",
  "MEP Consultant",
  "3D Visualizer",
];

const experienceLevels = [
  "Fresher",
  "Less than 1 Year",
  "1-3 Years",
  "3-5 Years",
  "5-10 Years",
  "10+ Years",
];

const ApplicationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { jobTitle = "" } = location.state || {};

  const { actionStatus, error, userInfo } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    role: "professional",
    name: "",
    email: "",
    phone: "",
    password: "",
    profession: jobTitle,
    city: "",
    experience: "",
    businessCertification: null,
    shopImage: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof typeof formData]) {
        dataToSubmit.append(
          key,
          formData[key as keyof typeof formData] as string | Blob
        );
      }
    });
    dispatch(registerUser(dataToSubmit));
  };

  useEffect(() => {
    if (actionStatus === "succeeded" && userInfo) {
      toast.success("Application submitted! Your account is pending approval.");
      dispatch(resetActionStatus());
      navigate("/login");
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Registration failed. Please try again.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, userInfo, error, dispatch, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-lg shadow-xl border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">
              Register With Us
            </CardTitle>
            <CardDescription>
              Create your professional account to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number*</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="profession">Profession*</Label>
                <Select
                  value={formData.profession}
                  onValueChange={(value) =>
                    handleSelectChange("profession", value)
                  }
                >
                  <SelectTrigger id="profession">
                    <SelectValue placeholder="Choose profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionalSubRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">City*</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience*</Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) =>
                    handleSelectChange("experience", value)
                  }
                >
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessCertification">
                  Business Certification (Optional)
                </Label>
                <Input
                  id="businessCertification"
                  type="file"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload your professional certification or business license.
                </p>
              </div>

              <div>
                <Label htmlFor="shopImage">Shop/Office Image (Optional)</Label>
                <Input id="shopImage" type="file" onChange={handleFileChange} />
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image of your office or workspace.
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email Address*</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Create Password*</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-base"
                disabled={actionStatus === "loading"}
              >
                {actionStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default ApplicationPage;
