import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`;
const getToken = (state: RootState) => state.user.userInfo?.token;

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  size?: string;
}

interface WishlistState {
  items: WishlistItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: WishlistState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchWishlist = createAsyncThunk<
  WishlistItem[],
  void,
  { state: RootState }
>("wishlist/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) return [];
    const { data } = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.items || [];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

// FIX: यहाँ पूरा productData भेजा जाएगा
export const addToWishlist = createAsyncThunk<
  WishlistItem[],
  WishlistItem,
  { state: RootState }
>("wishlist/add", async (productData, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const { data } = await axios.post(
      API_URL + "/add",
      productData, // पहले सिर्फ { productId } था, अब पूरा ऑब्जेक्ट भेजें
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data.items;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const removeFromWishlist = createAsyncThunk<
  WishlistItem[],
  string,
  { state: RootState }
>("wishlist/remove", async (productId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const { data } = await axios.delete(`${API_URL}/remove/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.items;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: WishlistState) => {
      state.status = "loading";
    };
    const handleRejected = (state: WishlistState, action: AnyAction) => {
      state.status = "failed";
      state.error = action.payload;
    };
    const handleFulfilled = (
      state: WishlistState,
      action: PayloadAction<WishlistItem[]>
    ) => {
      state.status = "succeeded";
      state.items = action.payload;
    };
    builder
      .addCase(fetchWishlist.pending, handlePending)
      .addCase(fetchWishlist.fulfilled, handleFulfilled)
      .addCase(fetchWishlist.rejected, handleRejected);
    builder
      .addCase(addToWishlist.pending, handlePending)
      .addCase(addToWishlist.fulfilled, handleFulfilled)
      .addCase(addToWishlist.rejected, handleRejected);
    builder
      .addCase(removeFromWishlist.pending, handlePending)
      .addCase(removeFromWishlist.fulfilled, handleFulfilled)
      .addCase(removeFromWishlist.rejected, handleRejected);
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
