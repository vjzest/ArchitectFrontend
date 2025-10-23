import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Pencil, PlusCircle } from "lucide-react";

// Placeholder data for addresses. In a real app, you would fetch this from a user's profile.
const userAddresses = {
  billing: {
    name: "Vijay Kumar",
    addressLine1: "House No. 123, Sector 45",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122001",
    country: "India",
    phone: "9876543210",
  },
  shipping: null, // Example where shipping address is not set yet
};

// A reusable component to display an address card
const AddressCard = ({ title, address, onEditClick }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {address && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditClick}
            className="flex items-center gap-2 text-primary hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-md border p-6 min-h-[180px] flex flex-col justify-center">
        {address ? (
          <div className="space-y-1 text-gray-600">
            <p className="font-semibold text-gray-800">{address.name}</p>
            <p>{address.addressLine1}</p>
            <p>{`${address.city}, ${address.state} - ${address.pincode}`}</p>
            <p>{address.country}</p>
            <p>Phone: {address.phone}</p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="mb-2">
              You have not set up this type of address yet.
            </p>
            <Button
              variant="outline"
              onClick={onEditClick}
              className="text-primary border-primary hover:bg-primary/5 hover:text-primary"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const AddressesPage = () => {
  // In a real app, these functions would open a modal or navigate to an edit page.
  const handleEditBilling = () => {
    alert("Editing Billing Address...");
  };

  const handleEditShipping = () => {
    alert("Editing Shipping Address...");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Addresses</h1>
        <p className="mt-2 text-gray-600">
          Manage your billing and shipping addresses for a faster checkout
          experience.
        </p>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <AddressCard
          title="Billing Address"
          address={userAddresses.billing}
          onEditClick={handleEditBilling}
        />
        <AddressCard
          title="Shipping Address"
          address={userAddresses.shipping}
          onEditClick={handleEditShipping}
        />
      </div>
    </div>
  );
};

export default AddressesPage;
