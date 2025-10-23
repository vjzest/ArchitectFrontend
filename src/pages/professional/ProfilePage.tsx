import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import {
  updateProfile,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Form ke data ke liye type define karein
type FormData = {
  name: string;
  phone: string;
  profession: string;
  city: string;
  experience: string;
};

const ProfilePageProf = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const isLoading = actionStatus === "loading";

  // Jab bhi userInfo mile, form ko data se bharein
  useEffect(() => {
    if (userInfo) {
      setValue("name", userInfo.name || "");
      setValue("phone", userInfo.phone || "");
      setValue("profession", userInfo.profession || "");
      setValue("city", userInfo.city || "");
      setValue("experience", userInfo.experience || "");
      setPhotoPreview(userInfo.photoUrl || null);
    }
  }, [userInfo, setValue]);

  // Update hone ke baad success/error message dikhayein
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Profile updated successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(String(error || "Failed to update profile."));
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const dataToSubmit = new FormData();
    // Form se saara data append karein
    Object.entries(data).forEach(([key, value]) => {
      dataToSubmit.append(key, value);
    });
    // Agar nayi photo hai to use bhi append karein
    if (photo) {
      dataToSubmit.append("photo", photo);
    }
    dispatch(updateProfile(dataToSubmit));
  };

  if (!userInfo) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
      <p className="text-gray-600">
        Update your public profile and account details.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              This information will be displayed publicly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={photoPreview} alt={userInfo.name} />
                <AvatarFallback className="text-4xl">
                  {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "P"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo">Change Profile Picture</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A high-quality picture helps you get more clients.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={userInfo.email}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed.
                </p>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  id="role"
                  disabled
                  value={userInfo.role}
                  className="capitalize"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>
              Describe your expertise and experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="profession">Your Profession</Label>
              <Input
                id="profession"
                {...register("profession", {
                  required: "Profession is required",
                })}
              />
              {errors.profession && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profession.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                {...register("experience", {
                  required: "Experience is required",
                })}
                placeholder="e.g., 5-10 Years"
              />
              {errors.experience && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="btn-primary"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Update Profile
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProfilePageProf;
