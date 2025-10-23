import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RootState, AppDispatch } from "@/lib/store";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2 } from "lucide-react";
import { format } from "date-fns";

const MyOrdersPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, status } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // This is a placeholder. In a real app, you'd get the download link from the product data.
  const handleDownload = (item) => {
    alert(`Downloading ${item.name}...`);
    // Example: You would need to fetch the full product details to get its planFile URL
    // window.open(item.productId.planFile, '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {status === "loading" && <Loader2 className="w-8 h-8 animate-spin" />}
      {status === "succeeded" &&
        (orders.length === 0 ? (
          <p>
            You have no orders yet.{" "}
            <Link to="/products" className="text-primary underline">
              Browse products
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold">
                    Order #{order._id.substring(0, 8)}
                  </h2>
                  <Badge variant={order.isPaid ? "default" : "destructive"}>
                    {order.isPaid ? "Paid" : "Not Paid"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Placed on: {format(new Date(order.createdAt), "dd MMM, yyyy")}
                </p>
                <div className="space-y-2">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center"
                    >
                      <span>{item.name}</span>
                      {order.isPaid ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(item)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Payment Pending
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default MyOrdersPage;
