import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createUserByAdmin,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

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
import { Loader2 } from "lucide-react";

const professionalSubRoles = [
  "Architect",
  "Interior Designer",
  "Contractor",
  "Site Engineer",
];
const materialTypes = ["Cement & Concrete", "Bricks & Blocks", "Steel & Rebar"];

const AddNewUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actionStatus, error } = useSelector((state: any) => state.user);

  type FormValues = {
    name: string;
    role: string;
    email: string;
    phone: string;
    password: string;
    profession?: string;
    businessName?: string;
    address?: string;
    city?: string;
    materialType?: string;
    companyName?: string;
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      role: "user",
    },
  });

  // Watch the 'role' field to dynamically show/hide other fields
  const selectedRole = watch("role");

  const onSubmit = (data) => {
    (dispatch as any)(createUserByAdmin(data));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("User created successfully!");
      dispatch(resetActionStatus());
      navigate("/admin/users");
    }
    if (actionStatus === "failed") {
      toast.error(error || "Failed to create user.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, navigate]);

  // A component to render fields based on the selected role
  const RoleSpecificFields = () => {
    switch (selectedRole) {
      case "professional":
        return (
          <div>
            <Label htmlFor="profession">Profession*</Label>
            <Controller
              name="profession"
              control={control}
              rules={{ required: "Profession is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id="profession">
                    <SelectValue placeholder="Select a profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionalSubRoles.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.profession && (
              <p className="text-red-500 text-xs mt-1">
                {errors.profession.message}
              </p>
            )}
          </div>
        );
      case "seller":
        return (
          <>
            <div>
              <Label htmlFor="businessName">Business Name*</Label>
              <Input
                id="businessName"
                {...register("businessName", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="address">Address*</Label>
              <Textarea
                id="address"
                {...register("address", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="city">City*</Label>
              <Input id="city" {...register("city", { required: true })} />
            </div>
            <div>
              <Label htmlFor="materialType">Material Type*</Label>
              <Controller
                name="materialType"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialTypes.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </>
        );
      case "partner":
        return (
          <>
            <div>
              <Label htmlFor="companyName">Company Name*</Label>
              <Input
                id="companyName"
                {...register("companyName", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="address">Address*</Label>
              <Textarea
                id="address"
                {...register("address", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="city">City*</Label>
              <Input id="city" {...register("city", { required: true })} />
            </div>
          </>
        );
      case "user":
      default:
        return null; // No extra fields for 'user'
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800">Add New User</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-8 bg-white rounded-xl shadow-md border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Full Name / Business Name*</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="role">Role*</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone*</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password*</Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Dynamically render fields based on role */}
        <div className="space-y-6 border-t pt-6">
          <RoleSpecificFields />
        </div>

        <Button
          type="submit"
          className="btn-primary w-full md:w-auto"
          disabled={actionStatus === "loading"}
        >
          {actionStatus === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating User...
            </>
          ) : (
            "Create User"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddNewUserPage;
