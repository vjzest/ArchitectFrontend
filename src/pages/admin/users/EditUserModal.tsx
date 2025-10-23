import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  updateUserByAdmin,
  resetActionStatus,
} from "@/lib/features/users/userSlice";
import { RootState, AppDispatch } from "@/lib/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const professionalSubRoles = [
  "Architect",
  "Junior Architect",
  "Civil Structural Engineer",
  "Civil Design Engineer",
  "Interior Designer",
  "Contractor",
  "Vastu Consultant",
  "Site Engineer",
];

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUserUpdate: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [profession, setProfession] = useState("");

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name || user.businessName || user.companyName,
        email: user.email,
        phone: user.phone,
      });
      setRole(user.role || "");
      setStatus(user.status || "");
      if (user.role === "professional") {
        setProfession(user.profession || "");
      } else {
        setProfession("");
      }
    }
  }, [user, reset, isOpen]);

  const onSubmit = async (data: any) => {
    const userData = { ...data, role, status };

    if (status === "Approved") {
      userData.isApproved = true;
    } else {
      userData.isApproved = false;
    }

    if (role === "professional") {
      userData.profession = profession;
    }

    try {
      await dispatch(
        updateUserByAdmin({ userId: user._id, userData })
      ).unwrap();
      toast.success("User updated successfully!");
      dispatch(resetActionStatus());
      onClose();
      // Wait a bit before refreshing to ensure modal is closed
      setTimeout(() => {
        onUserUpdate();
      }, 100);
    } catch (err: any) {
      toast.error(String(err) || "Failed to update user.");
      dispatch(resetActionStatus());
    }
  };

  const needsApproval =
    role === "professional" || role === "seller" || role === "Contractor";

  const isLoading = actionStatus === "loading";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isLoading && !open && onClose()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user's profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 pt-4 max-h-[80vh] overflow-y-auto pr-2"
        >
          <div>
            <Label htmlFor="name">Full Name / Business Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required." })}
              disabled={isLoading}
            />
            {errors.name && typeof errors.name.message === "string" && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required." })}
              disabled={isLoading}
            />
            {errors.email && typeof errors.email.message === "string" && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} disabled={isLoading} />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="Contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "professional" && (
            <div>
              <Label>Profession</Label>
              <Select
                value={profession}
                onValueChange={setProfession}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a profession" />
                </SelectTrigger>
                <SelectContent>
                  {professionalSubRoles.map((subRole) => (
                    <SelectItem key={subRole} value={subRole}>
                      {subRole}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {needsApproval && (
            <div>
              <Label>Approval Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
