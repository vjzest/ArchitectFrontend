import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState, AppDispatch } from "@/lib/store";
import {
  updateProfile,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get current user info and action status from Redux
  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  // Local state to manage form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // You can add state for profile picture file if you implement file upload
  // const [profilePic, setProfilePic] = useState<File | null>(null);

  // Pre-fill the form with user data when the component loads
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
    }
  }, [userInfo]);

  // Handle success or error messages after an action
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Profile updated successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Update failed. Please try again.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updateData: { name: string; email: string; password?: string } = {
      name,
      email,
    };

    // Only include password if a new password is provided and it matches
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match!");
        return;
      }
      // You might want to include currentPassword for verification on the backend
      updateData.password = newPassword;
    }

    dispatch(updateProfile(updateData));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <div className="p-8 bg-white rounded-xl shadow-md border space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Personal Information
          </h2>
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userInfo?.photoUrl || undefined} alt={name} />
              <AvatarFallback className="text-4xl">
                {name ? name.charAt(0).toUpperCase() : "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="profile-picture">Profile Picture</Label>
              <Input id="profile-picture" type="file" className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin's Name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-white rounded-xl shadow-md border space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Change Password
          </h2>
          <div>
            <Label htmlFor="current-password">
              Current Password (leave blank to keep unchanged)
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="btn-primary"
          size="lg"
          disabled={actionStatus === "loading"}
        >
          {actionStatus === "loading" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
