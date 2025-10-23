import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchAllPackages,
  deletePackage,
  resetActionStatus,
} from "@/lib/features/packages/packageSlice";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";

const PackageListPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { packages, status, actionStatus, error } = useSelector(
    (state: RootState) => state.packages
  );

  useEffect(() => {
    // कंपोनेंट लोड होने पर सभी पैकेज प्राप्त करें
    dispatch(fetchAllPackages());

    // जब कंपोनेंट अनमाउंट हो तो actionStatus को रीसेट करें
    return () => {
      dispatch(resetActionStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    // अगर कोई डिलीट या अपडेट ऑपरेशन सफल होता है, तो सूची को फिर से लोड करें
    if (actionStatus === "succeeded") {
      dispatch(fetchAllPackages());
    }
  }, [actionStatus, dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      dispatch(deletePackage(id));
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (status === "failed") {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Packages</h1>
        <Button asChild>
          <Link to="/admin/packages/add">Add New Package</Link>
        </Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Type</th>
              <th className="p-4">Popular</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{pkg.title}</td>
                <td className="p-4">
                  ₹{pkg.price} {pkg.unit}
                </td>
                <td className="p-4 capitalize">{pkg.packageType}</td>
                <td className="p-4">{pkg.isPopular ? "Yes" : "No"}</td>
                <td className="p-4 flex gap-2 justify-end">
                  <Link to={`/admin/packages/edit/${pkg._id}`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(pkg._id)}
                    disabled={actionStatus === "loading"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageListPage;
