import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import {
  fetchUsers,
  deleteUserByAdmin,
  updateUserByAdmin,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const professionalSubRoles = [
  "Architect",
  "Junior Architect",
  "Civil Structural Engineer",
  "Civil Design Engineer",
  "Interior Designer",
  "Contractor",
  "Vastu Consultant",
  "Site Engineer",
];

const getRoleClass = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-700";
    case "professional":
      return "bg-blue-100 text-blue-700";
    case "seller":
      return "bg-green-100 text-green-700";
    case "Contractor":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AllUsersPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const { users, pagination, listStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [profession, setProfession] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const USERS_PER_PAGE = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFetchUsers = (page = 1) => {
    dispatch(fetchUsers({ page, limit: USERS_PER_PAGE }));
  };

  useEffect(() => {
    handleFetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (actionStatus === "succeeded" && error) {
      toast.error(String(error));
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  useEffect(() => {
    if (selectedUser && isEditModalOpen) {
      reset({
        name:
          selectedUser.name ||
          selectedUser.businessName ||
          selectedUser.companyName,
        email: selectedUser.email,
        phone: selectedUser.phone,
      });
      setRole(selectedUser.role || "");
      setStatus(selectedUser.status || "");
      if (selectedUser.role === "professional") {
        setProfession(selectedUser.profession || "");
      } else {
        setProfession("");
      }
    }
  }, [selectedUser, reset, isEditModalOpen]);

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUserByAdmin(userId))
        .unwrap()
        .then(() => {
          toast.success("User deleted successfully!");
          handleFetchUsers(currentPage);
        })
        .catch((err) => {
          toast.error(String(err) || "Failed to delete user");
        });
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
      reset();
    }, 200);
  };

  const onSubmit = async (data: any) => {
    if (!selectedUser) return;

    setIsSubmitting(true);

    const userData = { ...data, role, status };

    if (status === "Approved") {
      userData.isApproved = true;
    } else {
      userData.isApproved = false;
    }

    if (role === "professional") {
      userData.profession = profession;
    }

    try {
      await dispatch(
        updateUserByAdmin({ userId: selectedUser._id, userData })
      ).unwrap();

      toast.success("User updated successfully!");

      // Close modal immediately
      setIsEditModalOpen(false);

      // Clean up after animation
      setTimeout(() => {
        setSelectedUser(null);
        reset();
        setIsSubmitting(false);
      }, 200);

      // Fetch fresh data in background
      setTimeout(() => {
        handleFetchUsers(currentPage);
      }, 300);
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(String(err) || "Failed to update user.");
    }
  };

  const needsApproval =
    role === "professional" || role === "seller" || role === "Contractor";

  // Don't show loading if we already have data
  const showLoading =
    listStatus === "loading" && (!users || users.length === 0);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
          <Link to="/admin/users/add">
            <Button className="btn-primary flex items-center gap-2">
              <PlusCircle size={18} /> Add New User
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {showLoading ? (
            <div className="p-12 text-center text-gray-500 flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading Users...
            </div>
          ) : !users || users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <UserX className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No users found.</p>
              <Link to="/admin/users/add">
                <Button variant="link" className="mt-2">
                  Create the first user
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Name
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Email
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Role
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Registered
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">
                        {user.name || user.businessName || user.companyName}
                      </td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4">
                        <span
                          className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${getRoleClass(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {user.createdAt &&
                        !isNaN(new Date(user.createdAt).getTime())
                          ? format(new Date(user.createdAt), "dd MMM, yyyy")
                          : "N/A"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(user)}
                            disabled={isSubmitting}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(user._id)}
                            disabled={isSubmitting}
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

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages} (
              {pagination.totalUsers} users)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <Dialog
          open={isEditModalOpen}
          onOpenChange={(open) => {
            if (!open && !isSubmitting) {
              handleCloseModal();
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Make changes to the user's profile. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 pt-4 max-h-[80vh] overflow-y-auto pr-2"
            >
              <div>
                <Label htmlFor="name">Full Name / Business Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required." })}
                  disabled={isSubmitting}
                />
                {errors.name && typeof errors.name.message === "string" && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required." })}
                  disabled={isSubmitting}
                />
                {errors.email && typeof errors.email.message === "string" && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={setRole}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="Contractor">Contractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === "professional" && (
                <div>
                  <Label>Profession</Label>
                  <Select
                    value={profession}
                    onValueChange={setProfession}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a profession" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionalSubRoles.map((subRole) => (
                        <SelectItem key={subRole} value={subRole}>
                          {subRole}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {needsApproval && (
                <div>
                  <Label>Approval Status</Label>
                  <Select
                    value={status}
                    onValueChange={setStatus}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AllUsersPage;
