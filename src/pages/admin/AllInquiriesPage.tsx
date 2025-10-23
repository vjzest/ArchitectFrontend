import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  fetchAllInquiries,
  deleteInquiry,
  resetActionStatus,
} from "@/lib/features/corporateInquiries/inquirySlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Input component import kiya gaya
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Select components import kiye gaye
import { Loader2, Trash2, Edit, Inbox, Filter, X } from "lucide-react";
import EditInquiryModal from "./EditInquiryModal";

// Type definitions (koi badlav nahi)
type InquiryType = {
  _id: string;
  companyName: string;
  contactPerson: string;
  workEmail: string;
  projectType: string;
  status: string;
  createdAt: string;
};

type RootStateType = {
  corporateInquiries: {
    inquiries: InquiryType[];
    listStatus: string;
    actionStatus: string;
    error: string | null;
  };
};

// getStatusClass function (koi badlav nahi)
const getStatusClass = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-700";
    case "Contacted":
      return "bg-yellow-100 text-yellow-700";
    case "In Progress":
      return "bg-purple-100 text-purple-700";
    case "Closed":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AllInquiriesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { inquiries, listStatus, actionStatus, error } = useSelector(
    (state: RootStateType) => state.corporateInquiries
  );

  // Modal ke liye states (koi badlav nahi)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryType | null>(
    null
  );

  // --- NAYA CODE: Filter ke liye States ---
  const [filters, setFilters] = useState({
    name: "",
    companyName: "",
    projectType: "All",
    status: "All",
    date: "",
  });

  useEffect(() => {
    dispatch(fetchAllInquiries() as any);
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "failed") {
      toast.error(String(error));
      dispatch(resetActionStatus() as any);
    }
  }, [actionStatus, error, dispatch]);

  // --- NAYA CODE: Filtered inquiries ka logic ---
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const inquiryDate = format(new Date(inquiry.createdAt), "yyyy-MM-dd");

      return (
        inquiry.contactPerson
          .toLowerCase()
          .includes(filters.name.toLowerCase()) &&
        inquiry.companyName
          .toLowerCase()
          .includes(filters.companyName.toLowerCase()) &&
        (filters.projectType === "All" ||
          inquiry.projectType === filters.projectType) &&
        (filters.status === "All" || inquiry.status === filters.status) &&
        (filters.date === "" || inquiryDate === filters.date)
      );
    });
  }, [inquiries, filters]);

  // Unique project types nikalne ke liye
  const projectTypes = useMemo(
    () => [...new Set(inquiries.map((i) => i.projectType))],
    [inquiries]
  );

  // Clear filters ka function
  const clearFilters = () => {
    setFilters({
      name: "",
      companyName: "",
      projectType: "All",
      status: "All",
      date: "",
    });
  };

  const handleDelete = (inquiryId: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      dispatch(deleteInquiry(inquiryId) as any).then((res: any) => {
        if (!res.error) {
          toast.success("Inquiry deleted successfully!");
        }
      });
    }
  };

  const handleEdit = (inquiry: InquiryType) => {
    setSelectedInquiry(inquiry);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedInquiry(null);
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Corporate Inquiries
        </h1>
        <p className="text-gray-600">
          View and manage all corporate project inquiries.
        </p>

        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
          <div className="flex items-center gap-2 font-semibold text-gray-700">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Contact Name</label>
              <Input
                placeholder="Search by name..."
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Company Name</label>
              <Input
                placeholder="Search by company..."
                value={filters.companyName}
                onChange={(e) =>
                  setFilters({ ...filters, companyName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Project Type</label>
              <Select
                value={filters.projectType}
                onValueChange={(value) =>
                  setFilters({ ...filters, projectType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />
            </div>
            <Button variant="outline" onClick={clearFilters} className="h-10">
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {listStatus === "loading" ? (
            <div className="p-12 text-center text-gray-500">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            </div>
          ) : !inquiries || inquiries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Inbox className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 font-semibold">No inquiries found.</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Inbox className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 font-semibold">
                No inquiries match the current filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Company
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Contact
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Project Type
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Received On
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">
                        {inquiry.companyName}
                      </td>
                      <td className="p-4 text-gray-600">
                        {inquiry.contactPerson}
                        <br />
                        <span className="text-xs text-gray-500">
                          {inquiry.workEmail}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {inquiry.projectType}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                            inquiry.status
                          )}`}
                        >
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {format(new Date(inquiry.createdAt), "dd MMM, yyyy")}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(inquiry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-500"
                            onClick={() => handleDelete(inquiry._id)}
                            disabled={actionStatus === "loading"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {isEditModalOpen && selectedInquiry && (
        <EditInquiryModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          inquiry={selectedInquiry}
        />
      )}
    </>
  );
};

export default AllInquiriesPage;
