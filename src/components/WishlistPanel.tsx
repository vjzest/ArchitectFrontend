import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X, HeartCrack, ShoppingCart, Loader2 } from "lucide-react";
import house3 from "@/assets/house-3.jpg"; // एक फॉलबैक इमेज

type WishlistPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

// WishlistItem interface को दोनों तरह के डेटा को सपोर्ट करने के लिए अपडेट करें
interface WishlistItem {
  productId: string;
  name?: string; // UI से
  Name?: string; // JSON से
  price?: number;
  "Regular price"?: number;
  salePrice?: number;
  "Sale price"?: number;
  image?: string;
  Images?: string;
  size?: string;
  "Attribute 1 value(s)"?: string;
  [key: string]: any; // किसी भी अन्य फील्ड के लिए
}

const WishlistPanel: React.FC<WishlistPanelProps> = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addItem, state: cartState } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (item: WishlistItem) => {
    // कार्ट में भेजने से पहले डेटा को नॉर्मलाइज करें
    const itemName = item.name || item.Name || "Untitled Plan";
    const regularPrice = item.price ?? item["Regular price"] ?? 0;
    const itemSalePrice = item.salePrice ?? item["Sale price"];
    const itemImage =
      item.image || (item.Images ? item.Images.split(",")[0].trim() : house3);
    const itemSize = item.size || item["Attribute 1 value(s)"];
    const displayPrice = itemSalePrice != null ? itemSalePrice : regularPrice;

    await addItem({
      productId: item.productId,
      name: itemName,
      price: displayPrice,
      image: itemImage,
      size: itemSize,
      quantity: 1,
    });
    removeFromWishlist(item.productId);
    onClose();
    navigate("/cart");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-2xl font-bold">
            Your Wishlist ({wishlistItems.length})
          </SheetTitle>
        </SheetHeader>
        {wishlistItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <HeartCrack className="w-16 h-16 mb-4 text-primary/30" />
            <h3 className="text-xl font-semibold">Your Wishlist is Empty</h3>
            <p className="mt-2 max-w-xs">
              Start exploring and add your favorite plans!
            </p>
            <Button asChild className="mt-6" onClick={onClose}>
              <Link to="/products">Explore Plans</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {wishlistItems.map((item) => {
              // हर आइटम के लिए डेटा को सही से पढ़ें
              const itemName = item.name || item.Name || "Untitled Plan";
              const regularPrice = item.price ?? item["Regular price"] ?? 0;
              const itemSalePrice = item.salePrice ?? item["Sale price"];
              const itemImage =
                item.image ||
                (item.Images ? item.Images.split(",")[0].trim() : house3);
              const itemSize = item.size || item["Attribute 1 value(s)"];
              const displayPrice =
                itemSalePrice != null ? itemSalePrice : regularPrice;

              return (
                <div
                  key={item.productId}
                  className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50"
                >
                  <Link to={`/product/${item.productId}`} onClick={onClose}>
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  </Link>
                  <div className="flex-grow">
                    <Link
                      to={`/product/${item.productId}`}
                      onClick={onClose}
                      className="hover:underline"
                    >
                      <h4 className="font-semibold leading-tight">
                        {itemName}
                      </h4>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {itemSize}
                    </p>
                    <p className="text-lg font-bold text-primary mt-1">
                      ₹{displayPrice.toLocaleString()}
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 w-full sm:w-auto"
                      onClick={() => handleAddToCart(item)}
                      disabled={cartState.loading}
                    >
                      {cartState.loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="mr-2 h-4 w-4" />
                      )}
                      Add to Cart
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8 flex-shrink-0"
                    onClick={() => removeFromWishlist(item.productId)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistPanel;
