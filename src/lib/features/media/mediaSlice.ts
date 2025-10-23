import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

// प्रोडक्ट इंटरफ़ेस को दोबारा इस्तेमाल करें
import { Product } from "../products/productSlice";

interface MediaState {
  items: Product[];
  page: number;
  pages: number;
  count: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: MediaState = {
  items: [],
  page: 1,
  pages: 1,
  count: 0,
  status: "idle",
  error: null,
};

const getToken = (getState: () => RootState) => {
  const { user } = getState();
  return user.userInfo?.token;
};

export const fetchMediaItems = createAsyncThunk<
  { products: Product[]; page: number; pages: number; count: number },
  { pageNumber?: number; searchTerm?: string },
  { state: RootState; rejectValue: string }
>("media/fetchAll", async (params, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params,
    };
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/media/all-products`,
      config
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch media items"
    );
  }
});

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMediaItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.count = action.payload.count;
      })
      .addCase(fetchMediaItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default mediaSlice.reducer;
