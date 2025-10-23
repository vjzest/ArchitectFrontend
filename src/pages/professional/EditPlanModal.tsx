import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form"; // Controller ko import karein
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState, store } from "@/lib/store";
type AppDispatch = typeof store.dispatch;
import {
  updatePlan,
  resetPlanActionStatus,
} from "@/lib/features/professional/professionalPlanSlice";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const EditPlanModal = ({ isOpen, onClose, plan }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.professionalPlans
  );

  const {
    register,
    handleSubmit,
    setValue,
    control, // control ko useForm se nikaalein
    formState: { errors },
  } = useForm();

  // Sirf file inputs ke liye state
  const [mainImage, setMainImage] = useState(null);
  const [planFile, setPlanFile] = useState(null);

  useEffect(() => {
    if (plan) {
      // react-hook-form ke saare fields ko pre-fill karein
      setValue("planName", plan.planName);
      setValue("description", plan.description);
      setValue("plotSize", plan.plotSize);
      setValue("plotArea", plan.plotArea);
      setValue("rooms", plan.rooms);
      setValue("bathrooms", plan.bathrooms);
      setValue("kitchen", plan.kitchen);
      setValue("floors", plan.floors);
      setValue("price", plan.price);
      setValue("salePrice", plan.salePrice);
      setValue("category", plan.category);
      setValue("country", plan.country);
      // ✨ FIX 1: Dropdowns ke liye bhi setValue ka istemaal karein ✨
      setValue("direction", plan.direction || "");
      setValue("propertyType", plan.propertyType || "");
      setValue("planType", plan.planType || "");
      setValue("isSale", plan.isSale || false);
    }
  }, [plan, setValue]);

  const onSubmit = (data) => {
    const formData = new FormData();
    // `data` object mein react-hook-form ki saari values hain
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    if (mainImage) formData.append("mainImage", mainImage);
    if (planFile) formData.append("planFile", planFile);

    dispatch(updatePlan({ planId: plan._id, planData: formData }) as any);
  };

  useEffect(() => {
    if (actionStatus === "succeeded" && isOpen) {
      toast.success("Plan updated successfully!");
      dispatch(resetPlanActionStatus());
      onClose();
    }
    if (actionStatus === "failed" && isOpen) {
      toast.error(error || "Failed to update plan.");
      dispatch(resetPlanActionStatus());
    }
  }, [actionStatus, error, dispatch, onClose, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Plan: {plan?.planName}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 max-h-[80vh] overflow-y-auto p-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plan Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Plan Title</Label>
                    <Input {...register("planName")} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea rows={5} {...register("description")} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Plot Size</Label>
                    <Input {...register("plotSize")} />
                  </div>
                  <div>
                    <Label>Plot Area</Label>
                    <Input type="number" {...register("plotArea")} />
                  </div>
                  <div>
                    <Label>Rooms</Label>
                    <Input type="number" {...register("rooms")} />
                  </div>
                  <div>
                    <Label>Bathrooms</Label>
                    <Input type="number" {...register("bathrooms")} />
                  </div>
                  <div>
                    <Label>Kitchen</Label>
                    <Input type="number" {...register("kitchen")} />
                  </div>
                  <div>
                    <Label>Floors</Label>
                    <Input type="number" {...register("floors")} />
                  </div>
                  <div>
                    <Label>Direction</Label>
                    {/* ✨ FIX 2: Controller ka istemaal karein taaki value show ho ✨ */}
                    <Controller
                      name="direction"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Direction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="North">North</SelectItem>
                            <SelectItem value="South">South</SelectItem>
                            <SelectItem value="East">East</SelectItem>
                            <SelectItem value="West">West</SelectItem>
                            <SelectItem value="North-East">
                              North-East
                            </SelectItem>
                            <SelectItem value="North-West">
                              North-West
                            </SelectItem>
                            <SelectItem value="South-East">
                              South-East
                            </SelectItem>
                            <SelectItem value="South-West">
                              South-West
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input {...register("country")} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Update Files</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Replace Image</Label>
                    <Input
                      type="file"
                      onChange={(e) => setMainImage(e.target.files[0])}
                    />
                  </div>
                  <div>
                    <Label>Replace Plan</Label>
                    <Input
                      type="file"
                      onChange={(e) => setPlanFile(e.target.files[0])}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Price (₹)</Label>
                    <Input type="number" {...register("price")} />
                  </div>
                  <div>
                    <Label>Sale Price (₹)</Label>
                    <Input type="number" {...register("salePrice")} />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Controller
                      name="isSale"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label>On Sale</Label>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Plan Type</Label>
                    <Controller
                      name="planType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Floor Plans">
                              Floor Plans
                            </SelectItem>
                            <SelectItem value="3D Elevations">
                              3D Elevations
                            </SelectItem>
                            <SelectItem value="Interior Designs">
                              Interior Designs
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input {...register("category")} />
                  </div>
                  <div>
                    <Label>Property Type</Label>
                    <Controller
                      name="propertyType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Residential">
                              Residential
                            </SelectItem>
                            <SelectItem value="Commercial">
                              Commercial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-primary"
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" ? (
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

export default EditPlanModal;
