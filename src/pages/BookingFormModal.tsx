import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const BookingFormModal = ({ isOpen, onClose, packageName }) => {
  const [formData, setFormData] = useState({
    name: "",
    plotSize: "",
    floor: "",
    whatsapp: "",
    city: "", // Naya state field
    spaceType: "residential",
    area: "",
    style: "",
    details: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, spaceType: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", { ...formData, packageName });
    alert("Thank you for your booking! Our team will contact you shortly.");
    onClose();
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative bg-card rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Book Your Plan
              </h2>
              <p className="text-primary font-semibold">{packageName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          {/* Form Section */}
          <div className="flex-grow overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-foreground border-b pb-2 mb-6">
                  Your Details
                </h3>

                <div>
                  <Label htmlFor="name">Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plotSize">Plot Size (e.g., 30x50)</Label>
                    <Input
                      id="plotSize"
                      value={formData.plotSize}
                      onChange={handleChange}
                      placeholder="e.g., 30x50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Total Area (in sq.ft.)*</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 1500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="floor">Floors (e.g., G+1)</Label>
                  <Input
                    id="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="e.g., Ground, G+1, G+2"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp / Mobile No.*</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      placeholder="Enter your 10-digit number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City*</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Enter your city"
                    />
                  </div>
                </div>

                <div>
                  <Label>Space Type*</Label>
                  <RadioGroup
                    defaultValue="residential"
                    value={formData.spaceType}
                    onValueChange={handleRadioChange}
                    className="flex items-center space-x-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="residential" id="r1" />
                      <Label htmlFor="r1">Residential</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="commercial" id="r2" />
                      <Label htmlFor="r2">Commercial</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="style">Preferred Style (Optional)</Label>
                  <Input
                    id="style"
                    value={formData.style}
                    onChange={handleChange}
                    placeholder="e.g., Modern, Traditional, Minimalist"
                  />
                </div>

                <div>
                  <Label htmlFor="details">Project Details*</Label>
                  <Textarea
                    id="details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                    placeholder="Tell us more about your requirements, like number of rooms, Vastu needs, etc."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary mt-4 text-lg py-3"
                >
                  Book Now
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingFormModal;
