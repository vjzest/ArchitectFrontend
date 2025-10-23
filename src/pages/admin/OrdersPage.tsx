// src/pages/admin/AdminOrdersPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchAllOrders,
  deleteOrderAdmin,
  markOrderAsPaidAdmin,
  resetActionStatus,
} from "@/lib/features/orders/orderSlice";
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
  DropdownMenuSeparator,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Loader2,
  Trash2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
} from "lucide-react";
import { toast } from "sonner";

type OrderItem = {
  product?: string;
  productId?: any;
  name: string;
  qty?: number;
  quantity?: number;
  price: number;
  image?: string;
  planFile?: string[];
};

type Order = {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  orderItems?: OrderItem[];
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  paymentMethod: string;
  paidAt?: string;
};
const AdminOrdersPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, status, actionStatus, error } = useSelector(
    (state: RootState) => state.orders
  );

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 15;
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully!");
      dispatch(resetActionStatus());
      setSelectedOrderId(null);
      setIsAlertOpen(false);
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "An error occurred.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);
  // Pagination Logic
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    return orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  }, [currentPage, orders]);

  const handleDeleteClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsAlertOpen(true);
  };
  const confirmDelete = () => {
    if (selectedOrderId) {
      dispatch(deleteOrderAdmin(selectedOrderId));
    }
  };
  const handleMarkAsPaid = (orderId: string) => {
    setSelectedOrderId(orderId);
    dispatch(markOrderAsPaidAdmin(orderId));
  };
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };
  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${fileName}`);
    } catch (err) {
      toast.error("Failed to download file");
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
      <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
      <p className="text-gray-600">View and process all customer orders.</p>

      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order: Order) => (
                <TableRow key={order._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="font-medium">
                      {order.user?.name || "Guest"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.user?.email || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>₹{order.totalPrice.toLocaleString()}</TableCell>
                  <TableCell>
                    {order.isPaid ? (
                      <Badge className="bg-green-100 text-green-800">
                        Paid
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        Not Paid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          {actionStatus === "loading" &&
                          selectedOrderId === order._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => handleViewDetails(order)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {!order.isPaid && (
                          <DropdownMenuItem
                            onSelect={() => handleMarkAsPaid(order._id)}
                            className="text-green-600 focus:text-green-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onSelect={() => handleDeleteClick(order._id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          <span className="font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Order Details
            </DialogTitle>
            <DialogDescription>
              Order ID: {selectedOrder?._id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {selectedOrder.user?.name || "Guest"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {selectedOrder.user?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Order Items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {selectedOrder.orderItems &&
                  selectedOrder.orderItems.length > 0 ? (
                    selectedOrder.orderItems.map((item, index) => {
                      const itemQty = item.qty || item.quantity || 1;
                      const itemPrice = item.price || 0;
                      const itemTotal = itemQty * itemPrice;
                      let planFiles = [];
                      if (
                        item.planFile &&
                        Array.isArray(item.planFile) &&
                        item.planFile.length > 0
                      ) {
                        planFiles = item.planFile;
                      }
                      else if (
                        item.productId?.planFile &&
                        Array.isArray(item.productId.planFile) &&
                        item.productId.planFile.length > 0
                      ) {
                        planFiles = item.productId.planFile;
                      }
                      if (planFiles.length === 0 && item.image) {
                        planFiles = [item.image];
                      }
                      console.log(
                        "Order Item:",
                        item.name,
                        "Files to Download:",
                        planFiles
                      );
                      return (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start gap-4">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded border"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {item.name}
                              </h4>
                              <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <p>
                                  Quantity:{" "}
                                  <span className="font-medium">{itemQty}</span>
                                </p>
                                <p>
                                  Price:{" "}
                                  <span className="font-medium">
                                    ₹{itemPrice.toLocaleString()}
                                  </span>
                                </p>
                                <p className="text-base font-semibold text-gray-900">
                                  Total: ₹{itemTotal.toLocaleString()}
                                </p>
                              </div>

                              {/* Download Buttons for Plan Files or Image */}
                              {planFiles.length > 0 ? (
                                <div className="mt-3 space-y-2">
                                  <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                                    📥 Available Downloads:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {planFiles.map((fileUrl, fileIndex) => {
                                      if (!fileUrl) return null;

                                      const fileName =
                                        fileUrl
                                          .split("/")
                                          .pop()
                                          ?.split("?")[0] ||
                                        `File-${fileIndex + 1}`;
                                      const fileExt =
                                        fileName
                                          .split(".")
                                          .pop()
                                          ?.toUpperCase() || "FILE";

                                      // Check if this is image fallback (no plan file)
                                      const isImageFallback =
                                        fileUrl === item.image;

                                      return (
                                        <Button
                                          key={fileIndex}
                                          size="sm"
                                          variant="outline"
                                          className={`text-xs h-9 px-3 ${
                                            isImageFallback
                                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-300 text-blue-700"
                                              : "bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 border-teal-300 text-teal-700"
                                          } font-semibold shadow-sm transition-all`}
                                          onClick={() =>
                                            handleDownloadFile(
                                              fileUrl,
                                              fileName
                                            )
                                          }
                                        >
                                          <Download className="w-4 h-4 mr-1.5" />
                                          {isImageFallback
                                            ? `Download Image (${fileExt})`
                                            : `Download ${fileExt}`}
                                        </Button>
                                      );
                                    })}
                                  </div>
                                  {planFiles[0] === item.image && (
                                    <p className="text-xs text-blue-600 italic flex items-center">
                                      ℹ️ Plan file not available, showing
                                      product image for download
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
                                  <p className="text-xs text-amber-800 flex items-center">
                                    <span className="mr-2">⚠️</span>
                                    No downloadable files or images available
                                    for this item
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No items in this order
                    </p>
                  )}
                </div>
              </div>
              {/* Payment Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status:</span>
                    {selectedOrder.isPaid ? (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        Paid
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 px-3 py-1">
                        Not Paid
                      </Badge>
                    )}
                  </div>
                  {selectedOrder.paidAt && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Paid At:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.paidAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                    <span className="text-lg font-bold text-gray-900">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      ₹{selectedOrder.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {!selectedOrder.isPaid && (
                  <Button
                    onClick={() => {
                      handleMarkAsPaid(selectedOrder._id);
                      setIsDetailDialogOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Paid
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedOrderId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Yes, Delete Order
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default AdminOrdersPage;
