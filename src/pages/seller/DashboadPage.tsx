import React from "react";
import { Link } from "react-router-dom";
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
  Package, // Changed from BookOpen for "Products"
} from "lucide-react";

// --- Mock Data (Dummy Data for UI) ---
// Backend se data fetch karne ki jagah, hum yahaan static data use kar rahe hain.
const mockSellerInfo = {
  name: "Creative Art Hub", // Seller ka naam
};

const mockSummary = {
  totalRevenue: 54250,
  totalOrders: 125,
  totalBuyers: 89, // "Customers" ko "Buyers" kar diya hai
  totalProducts: 25,
  recentOrders: [
    {
      _id: "order1",
      user: { name: "Aarav Sharma" },
      createdAt: "2023-10-26T10:00:00Z",
      isPaid: true,
      totalPrice: 2500,
    },
    {
      _id: "order2",
      user: { name: "Priya Singh" },
      createdAt: "2023-10-25T14:30:00Z",
      isPaid: true,
      totalPrice: 1200,
    },
    {
      _id: "order3",
      user: { name: "Rohan Verma" },
      createdAt: "2023-10-25T09:15:00Z",
      isPaid: false,
      totalPrice: 3150,
    },
    {
      _id: "order4",
      user: { name: "Sneha Gupta" },
      createdAt: "2023-10-24T18:45:00Z",
      isPaid: true,
      totalPrice: 899,
    },
  ],
};
// --- End of Mock Data ---

const SellerDashboardPage = () => {
  // useEffect, useDispatch, useSelector ko hata diya gaya hai.
  // Ab component seedhe mock data use karega.

  const summaryCards = [
    {
      title: "Total Revenue",
      value: `₹${mockSummary.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: mockSummary.totalOrders.toLocaleString(),
      icon: ShoppingCart,
    },
    {
      title: "Total Buyers",
      value: mockSummary.totalBuyers.toLocaleString(),
      icon: Users,
    },
    {
      title: "Total Products",
      value: mockSummary.totalProducts.toLocaleString(),
      icon: Package, // Icon updated for products
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome back, {mockSellerInfo.name || "Seller"}! Here's a summary of
            your store.
          </p>
        </div>
        <Link to="/seller/reports">
          <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
            Generate Report
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {card.title}
              </h3>
              <card.icon className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[200px]">Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSummary.recentOrders &&
              mockSummary.recentOrders.length > 0 ? (
                mockSummary.recentOrders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {order.user?.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>
                      {order.isPaid ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Not Paid</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{order.totalPrice.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-gray-500"
                  >
                    No recent orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-4 p-4 text-center border-t">
            <Link to="/seller/orders">
              <Button variant="link" className="text-orange-600 font-semibold">
                View All Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
