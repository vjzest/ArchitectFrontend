// src/pages/admin/ReportsPage.jsx

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchReportsData } from "@/lib/features/admin/adminSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Download,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { format } from "date-fns";

const ReportsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { reports, status } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchReportsData());
  }, [dispatch]);

  const summaryData = useMemo(() => {
    if (!reports) return [];
    return [
      {
        title: "Net Sales",
        value: `₹${reports.summary.netSales.toLocaleString()}`,
        icon: DollarSign,
      },
      {
        title: "Orders",
        value: reports.summary.orders.toLocaleString(),
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        value: reports.summary.customers.toLocaleString(),
        icon: Users,
      },
      {
        title: "Avg. Order Value",
        value: `₹${reports.summary.avgOrderValue.toFixed(2)}`,
        icon: TrendingUp,
      },
    ];
  }, [reports]);

  const COLORS = ["#FF8042", "#00C49F", "#0088FE", "#FFBB28", "#FF4444"];

  if (status === "loading" || !reports) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="ml-4 text-lg">Generating Reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
          <p className="mt-1 text-gray-600">
            Analyze your store's performance with detailed reports.
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 w-full md:w-auto flex items-center gap-2">
          <Download size={18} /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {card.title}
              </CardTitle>
              <card.icon className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Net sales for the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart
                data={reports.salesOverTime}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) => format(new Date(str), "MMM d")}
                  stroke="#888888"
                  fontSize={12}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "0.5rem" }}
                  formatter={(value: number) => [
                    `₹${value.toLocaleString()}`,
                    "Sales",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#F97316"
                  fill="url(#colorSales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your 5 best performing products.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={reports.topProducts}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f7fafc" }}
                  contentStyle={{ borderRadius: "0.5rem" }}
                  formatter={(value: number) => [value, "Sales"]}
                />
                <Bar dataKey="sales" barSize={20}>
                  {reports.topProducts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
