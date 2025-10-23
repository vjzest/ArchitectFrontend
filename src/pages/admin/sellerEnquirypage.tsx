import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, ServerCrash, Eye, Inbox, X, Save, User, Mail, Phone, Package as ProductIcon, Store } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchAllInquiries, fetchInquiryById, updateInquiryStatus } from "@/lib/features/sellerinquiries/sellerinquirySlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- INQUIRY MODAL COMPONENT (ISI PAGE MEIN) ---
const InquiryDetailModal = ({ inquiryId, onClose, onUpdate }) => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedInquiry, actionStatus } = useSelector((state: RootState) => state.sellerInquiries);
  const [status, setStatus] = useState("");

  useEffect(() => { if (inquiryId) dispatch(fetchInquiryById(inquiryId)); }, [inquiryId, dispatch]);
  useEffect(() => { if (selectedInquiry) setStatus(selectedInquiry.status); }, [selectedInquiry]);
  
  const handleStatusUpdate = () => {
    dispatch(updateInquiryStatus({ inquiryId, status })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success("Status updated successfully!");
        onUpdate();
        onClose();
      } else {
        toast.error("Failed to update status.");
      }
    });
  };

  if (!selectedInquiry && actionStatus === 'loading') return <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"><Loader2 className="animate-spin text-white h-10 w-10"/></div>;
  if (!selectedInquiry) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X/></button>
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800">Inquiry Details</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2"><h3 className="font-bold text-gray-700 flex items-center gap-2"><User size={16}/> Customer Info</h3><p><span className="font-semibold text-gray-500">Name:</span> {selectedInquiry.name}</p><p><span className="font-semibold text-gray-500">Email:</span> {selectedInquiry.email}</p><p><span className="font-semibold text-gray-500">Phone:</span> {selectedInquiry.phone}</p></div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2"><h3 className="font-bold text-gray-700 flex items-center gap-2"><ProductIcon size={16}/> Product Info</h3><p><span className="font-semibold text-gray-500">Product:</span> {selectedInquiry.product.name}</p><p><span className="font-semibold text-gray-500">Date:</span> {new Date(selectedInquiry.createdAt).toLocaleString()}</p><div className="flex items-center gap-2 pt-1"><Store size={16} className="text-gray-500"/><div><p className="text-xs text-gray-400">Seller</p><p className="font-semibold">{selectedInquiry.seller.businessName}</p></div></div></div>
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg"><h3 className="font-bold text-gray-700 mb-2">Message</h3><p className="text-gray-600 whitespace-pre-wrap">{selectedInquiry.message}</p></div>
                <div className="md:col-span-2 border-t pt-6"><h3 className="font-bold text-gray-700 mb-2">Update Status</h3><div className="flex items-center gap-4"><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-[180px] h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Contacted">Contacted</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent></Select><Button onClick={handleStatusUpdate} disabled={actionStatus === 'loading'} className="h-11">{actionStatus === 'loading' ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}Save Status</Button></div></div>
            </div>
        </div>
      </div>
    </div>
  );
};


// --- ADMIN INQUIRIES PAGE COMPONENT ---
const AdminInquiriesPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const { inquiries, listStatus, error } = useSelector((state: RootState) => state.sellerInquiries);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInquiryId, setSelectedInquiryId] = useState(null);

    const loadInquiries = () => {
        dispatch(fetchAllInquiries());
    };

    useEffect(() => {
        loadInquiries();
    }, [dispatch]);

    const handleViewDetails = (inquiryId) => {
        setSelectedInquiryId(inquiryId);
        setIsModalOpen(true);
    };
    
    const getStatusVariant = (status) => { /* ... switch case ... */ };

    if (listStatus === 'loading') return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-orange-500" /></div>;
    if (listStatus === 'failed') return <div className="text-center py-20"><ServerCrash /><h3>Failed to load inquiries.</h3><p>{String(error)}</p></div>;

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">All Product Inquiries</h1>
            <div className="bg-white rounded-lg shadow-md border overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-gray-50 border-b"><tr><th className="p-4 font-semibold">Product</th><th className="p-4 font-semibold">Seller</th><th className="p-4 font-semibold">Customer Name</th><th className="p-4 font-semibold">Date</th><th className="p-4 font-semibold">Status</th><th className="p-4 font-semibold text-right">Actions</th></tr></thead>
                    <tbody>
                        {inquiries.length > 0 ? inquiries.map(inquiry => (
                            <tr key={inquiry._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{inquiry.product?.name || 'N/A'}</td>
                                <td className="p-4">{inquiry.seller?.businessName || 'N/A'}</td>
                                <td className="p-4">{inquiry.name}</td>
                                <td className="p-4">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                                <td className="p-4"><Badge variant={getStatusVariant(inquiry.status)}>{inquiry.status}</Badge></td>
                                <td className="p-4 text-right"><Button variant="ghost" size="sm" onClick={() => handleViewDetails(inquiry._id)}><Eye className="mr-2 h-4 w-4"/> View Details</Button></td>
                            </tr>
                        )) : ( <tr><td colSpan={6} className="text-center p-16 text-gray-500"><Inbox className="mx-auto h-12 w-12 text-gray-400"/><p className="mt-2 font-semibold">No inquiries found in the system.</p></td></tr> )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <InquiryDetailModal inquiryId={selectedInquiryId} onClose={() => setIsModalOpen(false)} onUpdate={loadInquiries} />}
        </div>
    );
};

export default AdminInquiriesPage;