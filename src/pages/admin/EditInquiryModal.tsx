import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import {
  updateInquiry,
  resetActionStatus,
} from "@/lib/features/corporateInquiries/inquirySlice";

// Type definitions for props and state
type InquiryType = {
  _id: string;
  companyName: string;
  contactPerson: string;
  workEmail: string;
  phoneNumber?: string;
  projectDetails?: string;
  status: string;
};

type EditInquiryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryType;
};

type RootStateType = {
  corporateInquiries: {
    actionStatus: string;
    error: string | null;
  };
};

const EditInquiryModal: React.FC<EditInquiryModalProps> = ({
  isOpen,
  onClose,
  inquiry,
}) => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootStateType) => state.corporateInquiries
  );

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      companyName: inquiry?.companyName || "",
      contactPerson: inquiry?.contactPerson || "",
      workEmail: inquiry?.workEmail || "",
      phoneNumber: inquiry?.phoneNumber || "",
      projectDetails: inquiry?.projectDetails || "",
      status: inquiry?.status || "New",
    },
  });

  // Watch for status changes to update the component
  const statusValue = watch("status");

  useEffect(() => {
    // Reset form with new inquiry data when it changes
    if (inquiry) {
      reset({
        companyName: inquiry.companyName || "",
        contactPerson: inquiry.contactPerson || "",
        workEmail: inquiry.workEmail || "",
        phoneNumber: inquiry.phoneNumber || "",
        projectDetails: inquiry.projectDetails || "",
        status: inquiry.status || "New",
      });
    }
  }, [inquiry, reset]);

  const onSubmit = (data: any) => {
    dispatch(
      updateInquiry({ inquiryId: inquiry._id, inquiryData: data }) as any
    );
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Inquiry updated successfully!");
      dispatch(resetActionStatus() as any);
      onClose();
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Failed to update inquiry.");
      dispatch(resetActionStatus() as any);
    }
  }, [actionStatus, error, dispatch, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle>
              Edit Inquiry #{inquiry._id ? inquiry._id.slice(-6) : ""}
            </CardTitle>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X />
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <Label>Company Name</Label>
              <Input {...register("companyName")} />
            </div>
            <div>
              <Label>Contact Person</Label>
              <Input {...register("contactPerson")} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" {...register("workEmail")} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register("phoneNumber")} />
            </div>
            <div>
              <Label>Project Details</Label>
              <Textarea rows={5} {...register("projectDetails")} />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                onValueChange={(value) => setValue("status", value)}
                value={statusValue}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Inquiry
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default EditInquiryModal;
