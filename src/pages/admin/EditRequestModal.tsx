import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  updateStandardRequest,
  resetActionStatus,
} from "@/lib/features/standardRequest/standardRequestSlice";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface EditRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: {
    _id: string;
    packageName?: string;
    name?: string;
    whatsapp?: string;
    city?: string;
    projectDetails?: string;
    adminNotes?: string;
    [key: string]: any;
  } | null;
}

const EditRequestModal: React.FC<EditRequestModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: any) => state.standardRequests
  );

  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (request) {
      setAdminNotes(request.adminNotes || "");
    }
  }, [request]);

  const handleUpdate = () => {
    if (!request) return;
    dispatch(
      updateStandardRequest({
        requestId: request._id,
        updateData: { adminNotes },
      }) as any
    );
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Notes updated successfully!");
      dispatch(resetActionStatus());
      onClose();
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Update failed.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, onClose]);

  if (!isOpen || !request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Request Details - {request.packageName || "N/A"}
          </DialogTitle>
          <DialogDescription>
            Review customer details and add your notes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Customer</Label>
            <span className="col-span-3 font-medium">{request.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">WhatsApp</Label>
            <span className="col-span-3">{request.whatsapp}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">City</Label>
            <span className="col-span-3">{request.city}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Details</Label>
            <p className="col-span-3 text-sm bg-gray-50 p-2 rounded-md border">
              {request.projectDetails}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adminNotes" className="text-right">
              Admin Notes
            </Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="col-span-3"
              placeholder="Add your notes here..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={actionStatus === "loading"}>
            {actionStatus === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequestModal;
