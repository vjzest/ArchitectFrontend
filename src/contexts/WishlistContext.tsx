// contexts/WishlistContext.tsx

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "@/lib/features/wishlist/wishlistSlice";

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  size?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { toast } = useToast();

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchWishlist());
    } else {
      dispatch(clearWishlist());
    }
  }, [userInfo, dispatch]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const addToWishlistAPI = (product: WishlistItem) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
      });
      navigate("/login");
      return;
    }
    if (isInWishlist(product.productId)) return;

    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added.`,
    });
    dispatch(addToWishlist(product));
  };

  const removeFromWishlistAPI = (productId: string) => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    const itemToRemove = wishlistItems.find(
      (item) => item.productId === productId
    );
    if (!itemToRemove) return;

    toast({
      title: "Removed from Wishlist",
      description: `${itemToRemove.name} has been removed.`,
      variant: "destructive",
    });
    dispatch(removeFromWishlist(productId));
  };

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist: addToWishlistAPI,
    removeFromWishlist: removeFromWishlistAPI,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
