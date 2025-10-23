import React from "react";
import { useCurrency } from "../contexts/CurrencyContext";

interface DisplayPriceProps {
  inrPrice: number;
}

const DisplayPrice: React.FC<DisplayPriceProps> = ({ inrPrice }) => {
  const { rate, symbol } = useCurrency();

  if (typeof inrPrice !== "number" || inrPrice <= 0) {
    return <span>Free</span>;
  }

  const convertedPrice = inrPrice * rate;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedPrice);

  return (
    <span>
      {symbol}
      {formattedPrice}
    </span>
  );
};

export default DisplayPrice;
