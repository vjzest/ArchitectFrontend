import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
type AppDispatch = typeof store.dispatch;
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  registerUser,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

const userRoles = [
  { id: "user", label: "Register as a User" },
  { id: "professional", label: "Register as a Professional" },
  { id: "seller", label: "Register as a Material Seller" },
  { id: "Contractor", label: "Register as a Contractor and Interior Partners" },
  { id: "admin", label: "Register as an Admin" },
];

const professionalSubRoles = [
  "Architect / Junior Architect",
  "Civil Structural Engineer",
  "Civil Design Engineer",
  "Interior Designer",
  "Contractor",
  "Vastu Consultant",
  "Site Engineer",
  "Map Consultant",
  "3D Visualizer",
];

const contractorProfessions = [
  "General Contractor",
  "Civil Contractor",
  "Interior Contractor",
  "Electrical Contractor",
  "Plumbing Contractor",
];

const materialTypes = [
  "Cement & Concrete",
  "Bricks & Blocks",
  "Steel & Rebar",
  "Paints",
  "Electricals",
  "Plumbing",
  "Interior Design Materials",
  "Construction Machinery",
  "Other",
];

const experienceLevels = [
  // Common for Professional and Contractor
  "0-2 Years",
  "2-5 Years",
  "5-10 Years",
  "10+ Years",
];

const MultiRoleRegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    role: "user",
    email: "",
    password: "",
    phone: "",
    name: "",
    profession: "",
    businessName: "",
    address: "",
    city: "",
    materialType: "",
    companyName: "",
    experience: "",
    photo: null,
    businessCertification: null,
    shopImage: null,
  });

  const isLoading = actionStatus === "loading";

  useEffect(() => {
    if (actionStatus === "failed" && error) {
      toast.error(String(error));
      dispatch(resetActionStatus());
    }
    if (actionStatus === "succeeded" && userInfo) {
      dispatch(resetActionStatus());
      switch (userInfo.role) {
        case "admin":
          toast.success("Admin registration successful! Redirecting...");
          setTimeout(() => navigate("/admin"), 1000);
          break;
        case "professional":
          toast.success(
            "Professional registration successful! Your account is under review."
          );
          setTimeout(() => navigate("/login"), 2000);
          break;
        case "seller":
          toast.success(
            "Material Seller registration successful! Your account is registered and under review."
          );
          setTimeout(() => navigate("/login"), 2000);
          break;
        case "Contractor":
          toast.success(
            "Contractor registration successful! Your account is registered and under review."
          );
          setTimeout(() => navigate("/login"), 2000);
          break;
        case "user":
        default:
          toast.success("Registration successful! Redirecting...");
          setTimeout(() => navigate("/login"), 1000);
      }
    }
  }, [actionStatus, userInfo, error, navigate, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.files[0] }));
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setFormData({
      role: value,
      email: formData.email,
      password: formData.password,
      phone: "",
      name: "",
      profession: "",
      businessName: "",
      address: "",
      city: "",
      materialType: "",
      companyName: "",
      experience: "",
      photo: null,
      businessCertification: null,
      shopImage: null,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    for (const key in formData) {
      const value = formData[key as keyof typeof formData];
      if (value) {
        dataToSubmit.append(key, value as string | Blob);
      }
    }
    (dispatch as AppDispatch)(registerUser(dataToSubmit));
  };

  const renderRoleSpecificFields = () => {
    const motionProps = {
      key: selectedRole,
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.3 },
    };
    switch (selectedRole) {
      case "user":
      case "admin":
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name*</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number*</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </motion.div>
        );

      case "professional":
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div>
              <Label>Full Name*</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Phone*</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Profession*</Label>
              <Select
                onValueChange={(v) => handleSelectChange(v, "profession")}
                value={formData.profession}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose profession" />
                </SelectTrigger>
                <SelectContent>
                  {professionalSubRoles.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* --- START: NEW FIELDS FOR PROFESSIONAL --- */}
            <div>
              <Label>City*</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Experience*</Label>
              <Select
                onValueChange={(v) => handleSelectChange(v, "experience")}
                value={formData.experience}
                required
              >
                <SelectTrigger>
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
            {/* --- END: NEW FIELDS FOR PROFESSIONAL --- */}
            <div>
              <Label htmlFor="businessCertification">
                Qualification Certification (Optional)
              </Label>
              <Input
                id="businessCertification"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload your professional certification or business license
              </p>
            </div>
            <div>
              <Label htmlFor="shopImage">Shop/Office Image (Optional)</Label>
              <Input
                id="shopImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload an image of your office or workspace
              </p>
            </div>
          </motion.div>
        );

      case "seller":
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div>
              <Label>Business Name*</Label>
              <Input
                id="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Phone*</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Address*</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>City*</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Type of Business (Material Type)*</Label>
              <Select
                onValueChange={(v) => handleSelectChange(v, "materialType")}
                value={formData.materialType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="photo">Profile/Store Image (Optional)</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </motion.div>
        );

      case "Contractor":
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div>
              <Label>Full Name*</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Company Name*</Label>
              <Input
                id="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Phone*</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Profession*</Label>
              <Select
                onValueChange={(v) => handleSelectChange(v, "profession")}
                value={formData.profession}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Profession" />
                </SelectTrigger>
                <SelectContent>
                  {contractorProfessions.map((prof) => (
                    <SelectItem key={prof} value={prof}>
                      {prof}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Experience*</Label>
              <Select
                onValueChange={(v) => handleSelectChange(v, "experience")}
                value={formData.experience}
                required
              >
                <SelectTrigger>
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
              <Label>Address*</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>City*</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="businessCertification">
                Business Certification (Optional)
              </Label>
              <Input
                id="businessCertification"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload your contractor license or business certification
              </p>
            </div>
            <div>
              <Label htmlFor="shopImage">Company/Shop Image (Optional)</Label>
              <Input
                id="shopImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload an image of your company or workspace
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-soft-teal p-4 py-12">
        <div className="bg-card text-foreground p-8 sm:p-10 rounded-2xl shadow-2xl max-w-lg w-full">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <fieldset className="space-y-3">
              <legend className="sr-only">Select your registration type</legend>
              {userRoles.map((role) => (
                <div key={role.id}>
                  <input
                    type="radio"
                    id={`${role.id}-radio`}
                    name="user-role"
                    value={role.id}
                    className="sr-only"
                    checked={selectedRole === role.id}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  />
                  <label
                    htmlFor={`${role.id}-radio`}
                    className={`flex items-center justify-between w-full p-4 rounded-lg cursor-pointer border-2 transition-all duration-300 ${selectedRole === role.id ? "bg-accent text-accent-foreground border-transparent shadow-md" : "bg-input border-border hover:border-primary/50"}`}
                  >
                    <span className="font-semibold">{role.label}</span>
                    {selectedRole === role.id && <CheckCircle size={20} />}
                  </label>
                </div>
              ))}
            </fieldset>
            <AnimatePresence mode="wait">
              {renderRoleSpecificFields()}
            </AnimatePresence>
            <div>
              <Label htmlFor="email">Email address*</Label>
              <Input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="password">Password*</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-4">
              By registering, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <Button
              type="submit"
              className="w-full text-base font-bold py-3 h-12 btn-primary"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MultiRoleRegisterPage;
