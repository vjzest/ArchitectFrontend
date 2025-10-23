import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CurrencyContextType {
  currency: "INR" | "USD";
  rate: number;
  symbol: string;
  toggleCurrency: () => void;
}

interface CurrencyProviderProps {
  children: ReactNode;
}

const INR_TO_USD_RATE = 0.012;

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [rate, setRate] = useState<number>(1);
  const [symbol, setSymbol] = useState<string>("₹");

  useEffect(() => {
    if (currency === "USD") {
      setRate(INR_TO_USD_RATE);
      setSymbol("$");
    } else {
      setRate(1);
      setSymbol("₹");
    }
  }, [currency]);

  const toggleCurrency = (): void => {
    setCurrency((prevCurrency) => (prevCurrency === "INR" ? "USD" : "INR"));
  };

  const value: CurrencyContextType = {
    currency,
    rate,
    symbol,
    toggleCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
