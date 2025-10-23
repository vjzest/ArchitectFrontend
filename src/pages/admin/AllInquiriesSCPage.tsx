import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchInquiries,
  updateInquiryStatus,
  deleteInquiry,
  resetActionStatus,
} from "@/lib/features/inquiries/inquirySlice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Inbox, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { format, isValid } from "date-fns";

// Badge variant helper
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "New":
      return "default";
    case "Contacted":
      return "secondary";
    case "Closed":
      return "outline";
    default:
      return "default";
  }
};

const AllInquiriesSCPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { inquiries, listStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.inquiries
  );

  const [filters, setFilters] = useState({
    recipient: "",
    sender: "",
    status: "all",
    role: "all",
    date: "",
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchInquiries() as any);
  }, [dispatch]);

  const filteredInquiries = useMemo(() => {
    return Array.isArray(inquiries)
      ? inquiries.filter((inquiry: any) => {
          const inquiryDate = isValid(new Date(inquiry.createdAt))
            ? format(new Date(inquiry.createdAt), "yyyy-MM-dd")
            : "";

          const recipientName =
            inquiry.recipientInfo?.name?.toLowerCase() || "";
          const senderName = inquiry.senderName?.toLowerCase() || "";
          const recipientRole =
            inquiry.recipientInfo?.role?.toLowerCase() || "";

          return (
            recipientName.includes(filters.recipient.toLowerCase()) &&
            senderName.includes(filters.sender.toLowerCase()) &&
            (filters.status === "all" || inquiry.status === filters.status) &&
            (filters.role === "all" ||
              recipientRole === filters.role.toLowerCase()) &&
            (filters.date === "" || inquiryDate === filters.date)
          );
        })
      : [];
  }, [inquiries, filters]);

  useEffect(() => {
    if (
      actionStatus === "succeeded" &&
      (selectedInquiryId !== null || listStatus === "succeeded")
    ) {
      toast.success("Action completed successfully!");
      dispatch(resetActionStatus() as any);
      setSelectedInquiryId(null);
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "An error occurred.");
      dispatch(resetActionStatus() as any);
    }
  }, [actionStatus, error, dispatch, listStatus, selectedInquiryId]);

  const handleStatusChange = (inquiryId: string, newStatus: string) => {
    dispatch(updateInquiryStatus({ id: inquiryId, status: newStatus }) as any);
  };
  const handleDeleteClick = (inquiryId: string) => {
    setSelectedInquiryId(inquiryId);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (selectedInquiryId) {
      dispatch(deleteInquiry(selectedInquiryId) as any);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFilterChange = (value: string, type: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };
  const clearFilters = () => {
    setFilters({
      recipient: "",
      sender: "",
      status: "all",
      role: "all",
      date: "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Manage Inquiries</h1>
        <p className="text-gray-600">
          View and manage all user inquiries for sellers and contractors.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Filter className="w-5 h-5" />
          <span>Filter Inquiries</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-1">
            <Label>Recipient</Label>
            <Input
              placeholder="Search recipient..."
              value={filters.recipient}
              onChange={(e) => handleFilterChange(e.target.value, "recipient")}
            />
          </div>
          <div className="lg:col-span-1">
            <Label>Sender</Label>
            <Input
              placeholder="Search sender..."
              value={filters.sender}
              onChange={(e) => handleFilterChange(e.target.value, "sender")}
            />
          </div>
          <div className="lg:col-span-1">
            <Label>Role</Label>
            <Select
              value={filters.role}
              onValueChange={(v) => handleFilterChange(v, "role")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="Contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-1">
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(v) => handleFilterChange(v, "status")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-1">
            <Label>Date</Label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange(e.target.value, "date")}
            />
          </div>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full lg:w-auto"
            type="button"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border overflow-hidden">
        {listStatus === "loading" ? (
          <div className="p-12 text-center text-gray-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          </div>
        ) : !filteredInquiries || filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Inbox className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 font-semibold">
              No inquiries match your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Recipient</TableHead>
                  <TableHead className="font-semibold">Sender</TableHead>
                  <TableHead className="font-semibold">Requirements</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold text-center">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry: any) => (
                  <TableRow key={inquiry._id} className="hover:bg-gray-50">
                    <TableCell>
                      <p className="font-medium text-gray-800">
                        {inquiry.recipientInfo?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {inquiry.recipientInfo?.role} -{" "}
                        {inquiry.recipientInfo?.detail}
                      </p>
                      <p className="text-xs text-gray-500">
                        {inquiry.recipientInfo?.city}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-800">
                        {inquiry.senderName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {inquiry.senderEmail}
                      </p>
                      <p className="text-xs text-gray-500">
                        WhatsApp: {inquiry.senderWhatsapp}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <p className="text-sm text-gray-600">
                        {inquiry.requirements}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">
                        {format(new Date(inquiry.createdAt), "dd MMM, yyyy")}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={inquiry.status}
                        onValueChange={(newStatus) =>
                          handleStatusChange(inquiry._id, newStatus)
                        }
                      >
                        <SelectTrigger className="w-[120px] mx-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge
                        variant={getStatusBadgeVariant(inquiry.status)}
                        className="mt-2"
                      >
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(inquiry._id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              inquiry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllInquiriesSCPage;
