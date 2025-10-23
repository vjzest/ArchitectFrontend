import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/cart`;

const getToken = (state: RootState) => {
  const { user } = state;
  return user.userInfo?.token;
};

// इंटरफेस को अपडेट करें ताकि यह बैकएंड से आने वाली सभी फील्ड्स को हैंडल कर सके
export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // यह अब फाइनल कीमत होगी (sale या regular)
  salePrice?: number;
  isSale?: boolean;
  taxRate?: number;
  image?: string;
  size?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: CartState = {
  items: [],
  total: 0,
  status: "idle",
  error: null,
};

// --- Async Thunks ---

export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState }
>("cart/fetchCart", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) return [];
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data.items || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch cart"
    );
  }
});

// FIX: यहाँ पूरा itemData भेजा जाएगा, सिर्फ productId और quantity नहीं
export const addItemToCart = createAsyncThunk<
  CartItem[],
  CartItem, // अब पूरा CartItem ऑब्जेक्ट एक्सेप्ट करें
  { state: RootState }
>("cart/addItem", async (itemData, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(API_URL, itemData, config);
    return data.items;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add item to cart"
    );
  }
});

export const updateCartItemQuantity = createAsyncThunk<
  CartItem[],
  { productId: string; quantity: number },
  { state: RootState }
>(
  "cart/updateQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        API_URL,
        { productId, quantity },
        config
      );
      return data.items;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

export const removeCartItem = createAsyncThunk<
  CartItem[],
  string,
  { state: RootState }
>("cart/removeItem", async (productId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete(`${API_URL}/${productId}`, config);
    return data.items;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to remove item from cart"
    );
  }
});

export const clearCartDB = createAsyncThunk<void, void, { state: RootState }>(
  "cart/clearCartDB",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(API_URL, config);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    const handleFulfilled = (
      state: CartState,
      action: PayloadAction<CartItem[]>
    ) => {
      state.status = "succeeded";
      state.items = action.payload;
      state.total = action.payload.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    };
    const handlePending = (state: CartState) => {
      state.status = "loading";
    };
    const handleRejected = (state: CartState, action: AnyAction) => {
      state.status = "failed";
      state.error = action.payload;
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addItemToCart.pending, handlePending)
      .addCase(addItemToCart.fulfilled, handleFulfilled)
      .addCase(addItemToCart.rejected, handleRejected)
      .addCase(updateCartItemQuantity.pending, handlePending)
      .addCase(updateCartItemQuantity.fulfilled, handleFulfilled)
      .addCase(updateCartItemQuantity.rejected, handleRejected)
      .addCase(removeCartItem.pending, handlePending)
      .addCase(removeCartItem.fulfilled, handleFulfilled)
      .addCase(removeCartItem.rejected, handleRejected)
      .addCase(clearCartDB.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.status = "succeeded";
      });
  },
});
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
