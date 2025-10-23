import React from "react";
import { useCurrency } from "../contexts/CurrencyContext";
import { Button } from "./ui/button";
import { Repeat } from "lucide-react"; // Ek icon import karein

const FloatingCurrencySwitcher: React.FC = () => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "200px",
        right: "20px",
        zIndex: 1000, // Yeh button ko dusre content ke upar rakhega
      }}
    >
      <Button
        variant="outline"
        onClick={toggleCurrency}
        className="bg-white shadow-lg rounded-full p-3 h-auto"
        aria-label={`Switch to ${currency === "INR" ? "USD" : "INR"}`}
      >
        <Repeat className="h-5 w-5 mr-2" />
        {currency === "INR" ? "INR" : "USD"}
      </Button>
    </div>
  );
};

export default FloatingCurrencySwitcher;
