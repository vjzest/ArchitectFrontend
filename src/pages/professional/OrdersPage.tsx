import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchMyProfessionalOrders } from "@/lib/features/professional/professionalOrderSlice";
import { Eye, CheckCircle, Clock, Loader2, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import DisplayPrice from "@/components/DisplayPrice";

const getStatusClass = (isPaid: boolean) => {
  return isPaid
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700";
};

const OrdersPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.professionalOrders
  );

  useEffect(() => {
    dispatch(fetchMyProfessionalOrders());
  }, [dispatch]);

  const summary = React.useMemo(() => {
    const completed = orders.filter((order) => order.isPaid).length;
    const pending = orders.filter((order) => !order.isPaid).length;
    return { completed, pending };
  }, [orders]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-12 text-destructive">
        <ServerCrash className="mx-auto h-12 w-12" />
        <p className="mt-4 font-semibold">Failed to load orders.</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Sales</h1>
        <p className="mt-1 text-gray-600">
          Track and manage sales of your products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 border rounded-xl p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500">
              Pending Payments
            </h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {summary.pending}
          </p>
        </div>
        <div className="bg-gray-50 border rounded-xl p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500">
              Completed Sales
            </h3>
            <CheckCircle className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {summary.completed}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Order ID
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Date
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Customer
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Product(s) Sold
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Your Earning
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Status
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-500">
                    You have no sales yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  // Calculate total earnings for the professional from this order
                  const professionalEarning = order.orderItems.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  );

                  return (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium text-primary">
                        {order.orderId}
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-800">
                        {order.user?.name || "Guest User"}
                      </td>
                      <td className="p-4 text-gray-800 font-medium">
                        {order.orderItems.map((item) => item.name).join(", ")}
                      </td>
                      <td className="p-4 text-gray-600 font-bold">
                        <DisplayPrice inrPrice={professionalEarning} />
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.isPaid)}`}
                        >
                          {order.isPaid ? "Paid" : "Pending Payment"}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
