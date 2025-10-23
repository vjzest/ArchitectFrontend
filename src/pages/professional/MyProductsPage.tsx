import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  fetchMyPlans,
  deletePlan,
  updatePlan,
  resetPlanActionStatus,
} from "@/lib/features/professional/professionalPlanSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { Plan } from "@/lib/features/professional/professionalPlanSlice"; // Import the Plan interface

import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, PackageOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditPlanModal from "@/pages/professional/EditPlanModal"; // Ensure this path is correct

// Helper function to get status color and style
const getStatusClass = (status: string) => {
  switch (status) {
    case "Published":
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Pending Review":
      return "bg-yellow-100 text-yellow-800";
    case "Draft":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const MyProductsPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    plans: myPlans,
    listStatus,
    actionStatus,
    error,
  } = useSelector((state: RootState) => state.professionalPlans);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    // Fetches only the plans for the logged-in professional
    if (listStatus === "idle") {
      dispatch(fetchMyPlans());
    }
  }, [listStatus, dispatch]);

  useEffect(() => {
    if (actionStatus === "failed" && error) {
      toast.error(String(error) || "An action failed. Please try again.");
      dispatch(resetPlanActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleDelete = (planId: string) => {
    if (
      window.confirm("Are you sure you want to permanently delete this plan?")
    ) {
      dispatch(deletePlan(planId)).then((result) => {
        if (deletePlan.fulfilled.match(result)) {
          toast.success("Plan deleted successfully!");
        }
      });
    }
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedPlan(null);
  };

  const handleStatusChange = (planId: string, newStatus: string) => {
    const formData = new FormData();
    formData.append("status", newStatus);

    dispatch(updatePlan({ planId, planData: formData })).then((result) => {
      if (updatePlan.fulfilled.match(result)) {
        toast.success(`Plan status updated to "${newStatus}"`);
      }
    });
  };

  return (
    <>
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Plans & Products
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all your uploaded house plans and designs here.
            </p>
          </div>
          <Link to="/professional/add-product">
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} /> Add New Plan
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          {listStatus === "loading" ? (
            <div className="p-12 flex items-center justify-center text-gray-500">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading Your
              Plans...
            </div>
          ) : !myPlans || myPlans.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 font-semibold text-lg">No Plans Found</p>
              <p className="mt-1">You haven't uploaded any plans yet.</p>
              <Link to="/professional/add-product">
                <Button variant="link" className="mt-2">
                  Create your first plan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Plan
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Price
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Date Added
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myPlans.map((plan) => (
                    <tr key={plan._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="rounded-md h-12 w-12">
                            <AvatarImage
                              src={plan.mainImage}
                              alt={plan.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="font-bold">
                              {plan.name
                                ? plan.name.charAt(0).toUpperCase()
                                : "P"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">
                              {plan.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {plan.productNo}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Select
                          value={plan.status}
                          onValueChange={(newStatus) =>
                            handleStatusChange(plan._id, newStatus)
                          }
                        >
                          <SelectTrigger
                            className={`w-[150px] text-xs font-semibold rounded-full border-0 focus:ring-0 ${getStatusClass(plan.status || "")}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Pending Review">
                              Pending Review
                            </SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-gray-800 font-medium">
                        ₹{plan.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-600">
                        {plan.createdAt
                          ? format(new Date(plan.createdAt), "dd MMM, yyyy")
                          : "N/A"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(plan)}
                            aria-label="Edit Plan"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(plan._id)}
                            disabled={actionStatus === "loading"}
                            aria-label="Delete Plan"
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

      {selectedPlan && (
        <EditPlanModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          plan={selectedPlan}
        />
      )}
    </>
  );
};

export default MyProductsPage;
