import React, { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";

const AccountDetailsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isLoading = actionStatus === "loading";

  // Jab component load ho, Redux se data lekar form ko bharein
  useEffect(() => {
    if (userInfo) {
      setFormState((prev) => ({
        ...prev,
        name: userInfo.name || "",
        email: userInfo.email || "",
      }));
    }
  }, [userInfo]);

  // Update hone ke baad success/error message dikhayein
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Account details updated successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(String(error || "Failed to update details."));
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSubmit = new FormData();

    // Sirf naam aur email hamesha bhejein
    dataToSubmit.append("name", formState.name);
    dataToSubmit.append("email", formState.email);

    // Password tabhi bhejein jab user ne enter kiya ho
    if (formState.newPassword) {
      if (formState.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
      if (formState.newPassword !== formState.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      dataToSubmit.append("password", formState.newPassword);
    }

    dispatch(updateProfile(dataToSubmit)).then(() => {
      // Success hone par password fields ko clear kar dein
      if (formState.newPassword) {
        setFormState((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }));
      }
    });
  };

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Account Details</h1>
        <p className="mt-2 text-gray-600">
          Manage your personal information and password.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Change Password
          </h2>
          <div className="space-y-4 p-6 bg-gray-50 rounded-lg border">
            {/* Current password field hata diya gaya hai, simplicity ke liye. Aap chahein to add kar sakte hain. */}
            <div>
              <Label htmlFor="newPassword">
                New Password (leave blank to leave unchanged)
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={formState.newPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formState.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="btn-primary"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetailsPage;
