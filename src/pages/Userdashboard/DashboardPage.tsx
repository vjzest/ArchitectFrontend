// src/pages/dashboard/DashboardPage.jsx

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Download, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders, status } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 2);
  }, [orders]);

  const summaryCards = useMemo(() => {
    const completedOrders = orders.filter((order) => order.isPaid);
    return [
      {
        title: "Total Orders",
        value: orders.length,
        icon: ShoppingCart,
        link: "orders",
      },
      {
        title: "Available Downloads",
        value: completedOrders.length,
        icon: Download,
        link: "downloads",
      },
      {
        title: "Account Details",
        value: "Manage Info",
        icon: User,
        link: "account-details",
      },
    ];
  }, [orders]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Hello,{" "}
          <span className="font-semibold text-orange-600">
            {userInfo?.name || "User"}
          </span>
          ! Welcome back.
        </p>
      </div>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <Link to={card.link} key={index}>
            <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-between transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-orange-500">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-full">
                <card.icon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        {orders.length > 0 ? (
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
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-t">
                      <td className="p-4 font-medium text-orange-600">
                        #{order._id.substring(0, 8)}...
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {order.isPaid ? (
                          <Badge className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Processing
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 text-gray-800 font-medium">
                        ₹{order.totalPrice.toLocaleString()} for{" "}
                        {order.orderItems.length} item(s)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 text-right">
              <Link to="orders">
                <Button
                  variant="link"
                  className="text-orange-600 font-semibold"
                >
                  View All Orders →
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">
              You have no recent orders to display.
            </p>
            <Link to="/products">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Your First Project
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
