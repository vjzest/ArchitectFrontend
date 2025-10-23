import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchAllPremiumRequests,
  updatePremiumRequest,
  deletePremiumRequest,
  resetActionStatus,
  type PremiumRequest,
} from "@/lib/features/premiumRequest/premiumRequestSlice";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Loader2, Inbox, Edit, RefreshCw } from "lucide-react";
import EditRequestModal from "./EditRequestModal";

const PremiumRequestsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, listStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.premiumRequests
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<PremiumRequest | null>(
    null
  );

  // Fetch requests on component mount
  useEffect(() => {
    dispatch(fetchAllPremiumRequests());
  }, [dispatch]);

  // Reset action status when needed
  useEffect(() => {
    if (actionStatus === "succeeded") {
      const timer = setTimeout(() => {
        dispatch(resetActionStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionStatus, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchAllPremiumRequests());
    toast.info("Refreshing requests...");
  }, [dispatch]);

  const handleStatusChange = useCallback(
    async (requestId: string, newStatus: PremiumRequest["status"]) => {
      try {
        const result = await dispatch(
          updatePremiumRequest({
            requestId,
            updateData: { status: newStatus },
          })
        );

        if (updatePremiumRequest.fulfilled.match(result)) {
          toast.success(`Request status updated to ${newStatus}`);
        } else {
          throw new Error(result.payload as string);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to update status");
      }
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (requestId: string) => {
      if (
        !window.confirm("Are you sure you want to delete this premium request?")
      ) {
        return;
      }

      try {
        const result = await dispatch(deletePremiumRequest(requestId));

        if (deletePremiumRequest.fulfilled.match(result)) {
          toast.success("Request deleted successfully!");
        } else {
          throw new Error(result.payload as string);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete request");
      }
    },
    [dispatch]
  );

  const handleEditClick = useCallback((request: PremiumRequest) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedRequest(null);
  }, []);

  const requestsArray = Array.isArray(requests) ? requests : [];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Premium Consultation Requests
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all premium plan consultation requests from users.
            </p>
            {requestsArray.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <span>
                  Total Requests: <strong>{requestsArray.length}</strong>
                </span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={listStatus === "loading"}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${listStatus === "loading" ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {listStatus === "loading" ? (
            <div className="p-12 flex items-center justify-center text-gray-500">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading
              Requests...
            </div>
          ) : !requestsArray || requestsArray.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Inbox className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 font-semibold">No premium requests found.</p>
              <p className="text-sm mt-1">
                Premium consultation requests will appear here when customers
                submit them.
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
                  {requestsArray.map((req: PremiumRequest) => (
                    <tr
                      key={req._id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
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
                        {req.email && (
                          <div className="text-sm text-gray-500">
                            {req.email}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-gray-600">{req.city}</td>
                      <td className="p-4 text-gray-600">
                        {format(new Date(req.createdAt), "dd MMM, yyyy")}
                      </td>
                      <td className="p-4">
                        <Select
                          value={req.status}
                          onValueChange={(
                            newStatus: PremiumRequest["status"]
                          ) => handleStatusChange(req._id, newStatus)}
                          disabled={actionStatus === "loading"}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                                Pending
                              </span>
                            </SelectItem>
                            <SelectItem value="Contacted">
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                Contacted
                              </span>
                            </SelectItem>
                            <SelectItem value="In Progress">
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                                In Progress
                              </span>
                            </SelectItem>
                            <SelectItem value="Completed">
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                Completed
                              </span>
                            </SelectItem>
                            <SelectItem value="Cancelled">
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                                Cancelled
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditClick(req)}
                            disabled={actionStatus === "loading"}
                            title="Edit Request"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(req._id)}
                            disabled={actionStatus === "loading"}
                            title="Delete Request"
                          >
                            {actionStatus === "loading" ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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

export default PremiumRequestsPage;
