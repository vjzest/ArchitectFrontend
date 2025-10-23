// src/pages/admin/AdminDashboardPage.jsx

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchDashboardSummary } from "@/lib/features/admin/adminSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Briefcase,
  Loader2,
  BookOpen,
} from "lucide-react";

const AdminDashboardPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { summary, status } = useSelector((state: RootState) => state.admin);
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  // Loading state
  if (status === "loading" || !summary) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Revenue",
      value: `₹${summary.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: summary.totalOrders.toLocaleString(),
      icon: ShoppingCart,
    },
    {
      title: "Total Customers",
      value: summary.totalCustomers.toLocaleString(),
      icon: Users,
    },
    {
      title: "Total Plans",
      value: summary.totalProducts.toLocaleString(),
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome back, {userInfo?.name || "Admin"}! Here's a summary of your
            store.
          </p>
        </div>
        <Link to="/admin/reports">
          <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
            Generate Report
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium text-gray-500">
                {card.title}
              </h3>
              <card.icon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.recentOrders && summary.recentOrders.length > 0 ? (
                summary.recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div className="font-medium">
                        {order.user?.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.isPaid ? (
                        <Badge>Paid</Badge>
                      ) : (
                        <Badge variant="destructive">Not Paid</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{order.totalPrice.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    No recent orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-4 text-center">
            <Link to="/admin/orders">
              <Button variant="link" className="text-orange-600">
                View All Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
