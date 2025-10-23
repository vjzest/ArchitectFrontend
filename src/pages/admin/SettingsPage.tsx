import { useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const tabs = ["general", "products", "shipping", "payments"];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-4">
        {/* Yahan har tab ke liye content conditionally render hoga */}
        {activeTab === "general" && (
          <div>
            <h2 className="text-xl font-semibold">General Settings</h2>
            <p className="text-gray-500 mt-2">
              Update your store's general information.
            </p>
          </div>
        )}
        {activeTab === "products" && (
          <div>
            <h2 className="text-xl font-semibold">Product Settings</h2>
            <p className="text-gray-500 mt-2">
              Manage product-related settings.
            </p>
          </div>
        )}
        {activeTab === "shipping" && (
          <div>
            <h2 className="text-xl font-semibold">Shipping Settings</h2>
            <p className="text-gray-500 mt-2">
              Configure shipping zones and rates.
            </p>
          </div>
        )}
        {activeTab === "payments" && (
          <div>
            <h2 className="text-xl font-semibold">Payment Settings</h2>
            <p className="text-gray-500 mt-2">
              Connect and manage payment gateways.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SettingsPage;
