import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";

// Interface for a single item in the cart
interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
  taxRate?: number;
  source?: "admin" | "professional"; // <-- ADD THIS FIELD
}

// Interface for the context value
interface CartContextType {
  state: { items: CartItem[]; loading: boolean };
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      setLoading(true);
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        setItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      setItems([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, loading]);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === newItem.productId
      );
      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map((item) =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        );
      }
      // If item is new, add it to the cart
      return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
    });
    toast.success(`${newItem.name} added to cart!`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(
      (prevItems) =>
        prevItems
          .map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
          .filter((item) => item.quantity > 0) // Remove if quantity is 0 or less
    );
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
    toast.info("Item removed from cart.");
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const value: CartContextType = {
    state: { items, loading },
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
