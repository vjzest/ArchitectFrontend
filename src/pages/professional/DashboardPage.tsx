import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Star, PlusCircle } from "lucide-react";

const summaryCards = [
  { title: "Products Listed", value: "15", icon: Package },
  { title: "Total Sales", value: "₹85,200", icon: DollarSign },
  { title: "Average Rating", value: "4.8", icon: Star },
];

const DashboardPage = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Professional Dashboard
      </h1>
      <p className="mt-1 text-gray-600">
        Manage your products and profile from here.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaryCards.map((card) => (
        <div
          key={card.title}
          className="bg-gray-50 border rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <card.icon className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{card.value}</p>
        </div>
      ))}
    </div>
    <div className="p-6 bg-primary/10 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-primary/20">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Have a New Design?</h2>
        <p className="text-gray-600 mt-1">
          Upload your latest house plans and reach thousands of potential
          clients.
        </p>
      </div>
      <Link to="add-product">
        <Button className="btn-primary flex items-center gap-2 shrink-0">
          <PlusCircle size={18} />
          Upload New Product
        </Button>
      </Link>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Sales</h2>
      <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500 border">
        Recent Sales Table Placeholder
      </div>
    </div>
  </div>
);
export default DashboardPage;
