import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchAllRequests,
  deleteRequest,
  updateRequest, // updateRequest ko bhi import karein
  resetStatus, // resetStatus ko bhi import karein
} from "@/lib/features/customization/customizationSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Edit,
  Trash2,
  Loader2,
  Inbox,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import EditCustomizationRequestModal from "./EditCustomizationRequestModal";

const getRequestTypeBadge = (type: string) => {
  switch (type) {
    case "Floor Plan Customization":
      return "bg-blue-100 text-blue-800";
    case "3D Elevation":
      return "bg-purple-100 text-purple-800";
    case "Interior Design":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AdminCustomizationRequestsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { requests, listStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );

  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(
    undefined
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    dispatch(fetchAllRequests());
  }, [dispatch]);

  useEffect(() => {
    // Ye effect sirf action (delete/update) ke baad toast dikhane ke liye hai
    if (actionStatus === "failed") {
      toast.error(String(error) || "An error occurred.");
      dispatch(resetStatus());
    }
  }, [actionStatus, error, dispatch]);

  const filteredRequests = useMemo(() => {
    let filtered = Array.isArray(requests) ? requests : [];
    if (nameFilter) {
      filtered = filtered.filter(
        (req) =>
          req.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
          req.email.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((req) => req.requestType === typeFilter);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }
    if (dateFilter?.from) {
      const startDate = dateFilter.from;
      const endDate = dateFilter.to || dateFilter.from;
      filtered = filtered.filter((req) => {
        const reqDate = new Date(req.createdAt);
        return (
          reqDate >= startDate &&
          reqDate <= new Date(endDate.setHours(23, 59, 59, 999))
        );
      });
    }
    return filtered;
  }, [requests, nameFilter, typeFilter, statusFilter, dateFilter]);

  const handleDelete = (requestId: string) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      dispatch(deleteRequest(requestId)).then((res) => {
        if (deleteRequest.fulfilled.match(res)) {
          toast.success("Request deleted successfully!");
        }
      });
    }
  };

  const handleEdit = (request: any) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Customization Requests
        </h1>

        <div className="p-4 bg-gray-50 rounded-lg border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by Name or Email..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Floor Plan Customization">
                Floor Plan
              </SelectItem>
              <SelectItem value="3D Elevation">3D Elevation</SelectItem>
              <SelectItem value="Interior Design">Interior Design</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal text-muted-foreground"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter?.from ? (
                  dateFilter.to ? (
                    `${format(dateFilter.from, "LLL dd, y")} - ${format(dateFilter.to, "LLL dd, y")}`
                  ) : (
                    format(dateFilter.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {listStatus === "loading" ? (
            <div className="p-12 text-center flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading
              Requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Inbox className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 font-semibold">
                No requests match your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Customer
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Request Type
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Date
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request: any) => (
                    <tr key={request._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{request.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {request.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={getRequestTypeBadge(request.requestType)}
                        >
                          {request.requestType}
                        </Badge>
                      </td>
                      <td className="p-4 capitalize">{request.status}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {format(new Date(request.createdAt), "dd MMM, yyyy")}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(request)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(request._id)}
                            disabled={actionStatus === "loading"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <EditCustomizationRequestModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
        />
      )}
    </>
  );
};

export default AdminCustomizationRequestsPage;
