"use client"; // Este componente es interactivo

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  FC,
  FormEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchContractors } from "@/lib/features/users/userSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/inquiries/inquirySlice";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MapPin,
  Star,
  Building,
  Phone,
  X,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";

// --- Definiciones de Tipos ---
type ContractorType = {
  _id: string;
  name: string;
  companyName?: string;
  city?: string;
  address?: string;
  experience?: string;
  photoUrl?: string;
  shopImageUrl?: string; // Se incluye la imagen de la tienda
  phone?: string;
  profession?: string;
  status?: string;
};

const contractorSubCategories = [
  "General Contractor",
  "Civil Contractor",
  "Interior Contractor",
  "Electrical Contractor",
  "Plumbing Contractor",
];

// --- Componente ContactModal (Restaurado y Funcional) ---
const ContactModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  user: ContractorType | null;
}> = ({ isOpen, onClose, user }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus } = useSelector((state: RootState) => state.inquiries);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      recipient: user._id,
      recipientInfo: {
        name: user.name,
        role: "Contractor",
        phone: user.phone,
        city: user.city,
        address: user.address,
        detail: `${user.profession} - ${user.experience}`,
      },
      senderName: formData.get("name") as string,
      senderEmail: formData.get("email") as string,
      senderWhatsapp: formData.get("whatsapp") as string,
      requirements: formData.get("requirements") as string,
    };
    dispatch(createInquiry(inquiryData)).then((result) => {
      if (createInquiry.fulfilled.match(result)) {
        toast.success(`Your inquiry has been sent to ${user.name}!`);
        dispatch(resetActionStatus());
        onClose();
      } else {
        toast.error(String(result.payload) || "An error occurred.");
        dispatch(resetActionStatus());
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 z-10"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Contact {user.name}
                </h2>
                <p className="text-gray-500">
                  Share your project details to get a quote.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div>
                <Label htmlFor="email">Your Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="+91..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="requirements">Project Details</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="e.g., I need a contractor for a 2-story building..."
                  rows={4}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={actionStatus === "loading"}
              >
                {actionStatus === "loading" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {actionStatus === "loading" ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Componente Principal de la Sección ---
const ContractorsSection: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { contractors, contractorListStatus } = useSelector(
    (state: RootState) => state.user
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [cityFilter, setCityFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] =
    useState<ContractorType | null>(null);

  useEffect(() => {
    dispatch(fetchContractors());
  }, [dispatch]);

  const filteredContractors = useMemo(() => {
    if (!Array.isArray(contractors)) return [];
    return contractors.filter((c: ContractorType) => {
      const isApproved = c.status === "Approved";
      const matchesCity =
        !cityFilter || c.city?.toLowerCase().includes(cityFilter.toLowerCase());
      const matchesSubCategory =
        subCategoryFilter === "all" || c.profession === subCategoryFilter;
      return isApproved && matchesCity && matchesSubCategory;
    });
  }, [cityFilter, subCategoryFilter, contractors]);

  const handleContactClick = (contractor: ContractorType) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <section className="py-20 bg-soft-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              Hire Local Contractors
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Find experienced contractors in your city to bring projects to
              life.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-10 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="city-filter"
                className="font-semibold text-gray-700"
              >
                Filter by City
              </Label>
              <div className="relative mt-2">
                <Input
                  id="city-filter"
                  placeholder="e.g., Pune, Mumbai..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="pl-10 h-12"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <Label
                htmlFor="subcategory-filter"
                className="font-semibold text-gray-700"
              >
                Filter by Profession
              </Label>
              <div className="relative mt-2">
                <Select
                  value={subCategoryFilter}
                  onValueChange={setSubCategoryFilter}
                >
                  <SelectTrigger className="pl-10 h-12">
                    <SelectValue placeholder="Select Profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Professions</SelectItem>
                    {contractorSubCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {contractorListStatus === "loading" && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}

          {contractorListStatus === "succeeded" && (
            <div className="relative">
              {filteredContractors.length > 3 && (
                <>{/* Botones de desplazamiento */}</>
              )}
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scroll-smooth py-4 -mx-4 px-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="flex gap-8">
                  {filteredContractors.length > 0 ? (
                    filteredContractors.map((contractor) => (
                      <div
                        key={contractor._id}
                        className="bg-white rounded-xl p-4 flex flex-col group transition-all duration-300 border-2 border-transparent hover:border-primary hover:shadow-xl hover:-translate-y-2 w-72 flex-shrink-0 snap-start"
                      >
                        <div className="h-40 bg-gray-200 relative">
                          <img
                            src={
                              contractor.shopImageUrl ||
                              "https://via.placeholder.com/300x200?text=No+Shop+Image"
                            }
                            alt={`${contractor.companyName || contractor.name}'s shop`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 pt-12 flex flex-col flex-grow relative -mt-10">
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                            <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                              <AvatarImage
                                src={contractor.photoUrl}
                                alt={contractor.name}
                              />
                              <AvatarFallback className="text-xl font-bold bg-gray-200 text-gray-600">
                                {contractor.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="text-center pt-2 flex-grow">
                            <h3 className="font-bold text-lg text-gray-800">
                              {contractor.name}
                            </h3>
                            <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm mt-1">
                              <Building className="w-4 h-4 text-primary" />
                              <span>{contractor.companyName}</span>
                            </div>
                            <div className="mt-3 space-y-1.5 text-sm text-left text-gray-500">
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 shrink-0 text-primary" />
                                <span>{contractor.profession}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 shrink-0 text-primary" />
                                <span>{contractor.experience}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                                <span>
                                  {contractor.address}, {contractor.city}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleContactClick(contractor)}
                            className="mt-4 w-full btn-primary h-10"
                            type="button"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Now
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-12 text-gray-500 bg-white/50 rounded-xl">
                      <p>No contractors found matching your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedContractor}
      />
    </>
  );
};

export default ContractorsSection;
