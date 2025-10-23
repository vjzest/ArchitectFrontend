import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  updatePremiumRequest,
  resetActionStatus,
} from "@/lib/features/premiumRequest/premiumRequestSlice";
import { RootState, AppDispatch } from "@/lib/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const EditPremiumRequestModal = ({ isOpen, onClose, request }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.premiumRequests
  );

  // --- ✨ BADLAAV #1: Har field ke liye state banayein ✨ ---
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    // --- ✨ BADLAAV #2: Modal khulne par saare fields ko populate karein ✨ ---
    if (request) {
      setName(request.name || "");
      setWhatsapp(request.whatsapp || "");
      setCity(request.city || "");
      setProjectDetails(request.projectDetails || "");
      setStatus(request.status || "Pending");
      setAdminNotes(request.adminNotes || "");
    }
  }, [request]);

  const handleUpdate = () => {
    // --- ✨ BADLAAV #3: Saare updated fields ko bhejein ✨ ---
    const updateData = {
      name,
      whatsapp,
      city,
      projectDetails,
      status,
      adminNotes,
    };

    dispatch(
      updatePremiumRequest({
        requestId: request._id,
        updateData,
      })
    );
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Request updated successfully!");
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
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edit Premium Request: {request.packageName}</DialogTitle>
          <DialogDescription>
            Update customer details and request status.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
          {/* --- ✨ BADLAAV #4: Sabhi fields ko editable banayein ✨ --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
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
            <Label htmlFor="projectDetails">Project Details</Label>
            <Textarea
              id="projectDetails"
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="adminNotes">Admin Notes</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes here..."
              rows={3}
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

export default EditPremiumRequestModal;
