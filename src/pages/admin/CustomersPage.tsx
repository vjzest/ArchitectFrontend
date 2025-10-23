// src/pages/admin/CustomersPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchAllUsersAdmin,
  deleteUserAdmin,
  resetAdminActionStatus,
} from "@/lib/features/admin/adminSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Loader2, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

const CustomersPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, status, actionStatus, error } = useSelector(
    (state: RootState) => state.admin
  );

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all users when the component mounts
    dispatch(fetchAllUsersAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully!");
      dispatch(resetAdminActionStatus());
      setSelectedUserId(null);
      setIsAlertOpen(false);
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "An error occurred.");
      dispatch(resetAdminActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  // Filter users to show only customers
  const customers = useMemo(() => {
    return users.filter((user) => user.role === "user");
  }, [users]);

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUserId) {
      dispatch(deleteUserAdmin(selectedUserId));
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Customers</h1>
      <p className="text-gray-600">View and manage your customer list.</p>

      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={customer.photoUrl}
                          alt={customer.name}
                        />
                        <AvatarFallback>
                          {customer.name
                            ? customer.name.charAt(0).toUpperCase()
                            : "C"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          {actionStatus === "loading" &&
                          selectedUserId === customer._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() =>
                            alert(`Editing user ${customer.name}`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDeleteClick(customer._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              customer and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUserId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {actionStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomersPage;
