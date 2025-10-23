import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { toast } from "sonner"; // Sonner टोस्ट का उपयोग करेंगे

import { RootState, AppDispatch } from "@/lib/store";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const getStatusBadgeVariant = (isPaid) => {
  return isPaid ? "default" : "destructive";
};

const MyOrdersPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, status: orderStatus } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleDownload = (item) => {
    // --- ✨ सुरक्षित डाउनलोड लॉजिक ---
    // 1. जाँचें कि productId और planFile मौजूद हैं
    if (
      !item.productId ||
      !item.productId.planFile ||
      item.productId.planFile.length === 0
    ) {
      toast.error(
        "Download file is not available for this product. Please contact support."
      );
      return;
    }

    // 2. पहला फ़ाइल लिंक प्राप्त करें
    const fileUrl = item.productId.planFile[0];

    if (fileUrl) {
      toast.info("Your download is starting...");
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute(
        "download",
        `${item.name.replace(/\s+/g, "-")}-plan.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (orderStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Your Orders & Downloads
        </h1>
        <p className="mt-2 text-gray-600">
          Review your past orders and download your purchased plans here.
        </p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-xl font-semibold text-gray-800">
            No Orders Found
          </h3>
          <p className="mt-1 text-gray-500">
            You haven't placed any orders with us yet.
          </p>
          <div className="mt-6">
            <Link to="/products">
              <Button className="btn-primary">Browse House Plans</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md border p-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 pb-3 border-b">
                <div>
                  <span className="font-semibold text-gray-800">Order ID:</span>
                  <span className="ml-2 text-primary font-mono text-sm">
                    #{order._id.substring(0, 8)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                  <span>
                    Date: {format(new Date(order.createdAt), "dd MMM, yyyy")}
                  </span>
                </div>
                <Badge variant={getStatusBadgeVariant(order.isPaid)}>
                  {order.isPaid ? "Paid & Completed" : "Payment Pending"}
                </Badge>
              </div>

              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div
                    // --- ✨ बदलाव यहाँ किया गया है ---
                    key={item._id} // item._id का उपयोग करें जो हमेशा यूनिक होता है
                    className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {order.isPaid ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(item)}
                        disabled={!item.productId}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {item.productId ? "Download Plan" : "Not Available"}
                      </Button>
                    ) : (
                      <span className="text-sm text-gray-400 font-medium">
                        Payment Required
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
