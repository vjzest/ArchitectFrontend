import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  updateRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice"; // Sahi slice se import karein
import { RootState, AppDispatch } from "@/lib/store";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const EditCustomizationRequestModal = ({ isOpen, onClose, request }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );

  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (request) {
      setStatus(request.status || "Pending");
      setAdminNotes(request.adminNotes || "");
    }
  }, [request]);

  const handleUpdate = () => {
    dispatch(
      updateRequest({
        requestId: request._id,
        updateData: { status, adminNotes },
      })
    );
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Request updated successfully!");
      dispatch(resetStatus());
      onClose();
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Update failed.");
      dispatch(resetStatus());
    }
  }, [actionStatus, error, dispatch, onClose]);

  if (!isOpen || !request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edit Request: {request.requestType}</DialogTitle>
          <DialogDescription>
            Review customer details and update the request status.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-3 gap-4 border-b pb-4">
            <div>
              <Label className="font-semibold">Customer</Label>
              <p>{request.name}</p>
            </div>
            <div>
              <Label className="font-semibold">WhatsApp</Label>
              <p>{request.whatsappNumber}</p>
            </div>
            <div>
              <Label className="font-semibold">Email</Label>
              <p>{request.email}</p>
            </div>
          </div>
          {request.description && (
            <div className="space-y-1">
              <Label className="font-semibold">Customer Description</Label>
              <p className="text-sm p-2 bg-gray-50 rounded-md border">
                {request.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="adminNotes">Admin Notes</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes here..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={actionStatus === "loading"}
            className="btn-primary"
          >
            {actionStatus === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomizationRequestModal;
