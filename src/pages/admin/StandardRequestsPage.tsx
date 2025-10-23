import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchAllStandardRequests,
  updateStandardRequest,
  deleteStandardRequest,
} from "@/lib/features/standardRequest/standardRequestSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Trash2,
  Loader2,
  Inbox,
  Edit,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import EditRequestModal from "./EditRequestModal";

const StandardRequestsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { requests, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.standardRequests
  );

  const [customerFilter, setCustomerFilter] = useState("");
  const [packageFilter, setPackageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(
    undefined
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchAllStandardRequests());
  }, [dispatch]);

  const filteredRequests = useMemo(() => {
    let filtered = Array.isArray(requests) ? requests : [];
    if (customerFilter) {
      filtered = filtered.filter(
        (req) =>
          req.name.toLowerCase().includes(customerFilter.toLowerCase()) ||
          req.whatsapp.includes(customerFilter)
      );
    }
    if (packageFilter !== "all") {
      filtered = filtered.filter((req) => req.packageName === packageFilter);
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
  }, [requests, customerFilter, packageFilter, statusFilter, dateFilter]);

  const handleStatusChange = (requestId: string, newStatus: string) => {
    dispatch(
      updateStandardRequest({
        requestId,
        updateData: { status: newStatus },
      })
    );
    toast.info(`Request status updated to ${newStatus}.`);
  };

  const handleDelete = (requestId: string) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      dispatch(deleteStandardRequest(requestId)).then((res: any) => {
        if (deleteStandardRequest.fulfilled.match(res)) {
          toast.success("Request deleted successfully!");
        }
      });
    }
  };

  const handleEditClick = (request: any) => {
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
          Consultation Requests
        </h1>
        <p className="text-gray-600">
          View and manage all standard plan consultation requests from users.
        </p>

        <div className="p-4 bg-gray-50 rounded-lg border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by Customer Name..."
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={packageFilter} onValueChange={setPackageFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Package" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Packages</SelectItem>
              <SelectItem value="Floor Plan">Floor Plan</SelectItem>
              <SelectItem value="Floor Plan + 3D">Floor Plan + 3D</SelectItem>
              <SelectItem value="Complete File">Complete File</SelectItem>
              <SelectItem value="Interior Designing">
                Interior Designing
              </SelectItem>
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
            <div className="p-12 flex items-center justify-center text-gray-500">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading
              Requests...
            </div>
          ) : !filteredRequests || filteredRequests.length === 0 ? (
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
                      Package
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Customer
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      City
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Date
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req: any) => (
                    <tr key={req._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">
                        {req.packageName}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-800">
                          {req.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {req.whatsapp}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{req.city}</td>
                      <td className="p-4 text-gray-600">
                        {req.createdAt
                          ? format(new Date(req.createdAt), "dd MMM, yyyy")
                          : ""}
                      </td>
                      <td className="p-4">
                        <Select
                          defaultValue={req.status}
                          onValueChange={(newStatus) =>
                            handleStatusChange(req._id, newStatus)
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditClick(req)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(req._id)}
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
        <EditRequestModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
        />
      )}
    </>
  );
};

export default StandardRequestsPage;
