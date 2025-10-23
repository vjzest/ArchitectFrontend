import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state, ab isme pagination ki jaankari bhi save hogi
const initialState = {
  products: [],
  pagination: null,
  status: "idle", // For fetching data (e.g., loading, succeeded, failed)
  actionStatus: "idle", // For actions like create, update, delete
  error: null,
};

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/seller/products`;

// Helper function to get token from state
const getToken = (getState) => {
  const { user } = getState();
  return user.userInfo?.token;
};

// --- THUNK FOR PUBLIC MARKETPLACE (PAGINATION KE SAATH) ---
export const fetchPublicSellerProducts = createAsyncThunk(
  "sellerProducts/fetchPublicAll",
  async (page = 1, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/products/public/all?page=${page}`
      );
      // Backend se { products, page, pages, totalProducts } aayega
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch marketplace products"
      );
    }
  }
);

// --- SELLER-SPECIFIC THUNKS (SELLER DASHBOARD KE LIYE) ---

// Fetch products for the logged-in seller's dashboard
export const fetchSellerProducts = createAsyncThunk(
  "sellerProducts/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(API_URL, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your products"
      );
    }
  }
);

// Create a new product by the logged-in seller
export const createSellerProduct = createAsyncThunk(
  "sellerProducts/create",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(API_URL, productData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// Update an existing product by the logged-in seller
export const updateSellerProduct = createAsyncThunk(
  "sellerProducts/update",
  async ({ productId, productData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/${productId}`,
        productData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Delete a product by the logged-in seller
export const deleteSellerProduct = createAsyncThunk(
  "sellerProducts/delete",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${productId}`, config);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// --- SLICE DEFINITION ---

const sellerProductSlice = createSlice({
  name: "sellerProducts",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Public Products for Marketplace
      .addCase(fetchPublicSellerProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPublicSellerProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          totalProducts: action.payload.totalProducts,
        };
      })
      .addCase(fetchPublicSellerProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch Logged-in Seller's Products
      .addCase(fetchSellerProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.pagination = null;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create a Product
      .addCase(createSellerProduct.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(createSellerProduct.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.products.unshift(action.payload);
      })
      .addCase(createSellerProduct.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Update a Product
      .addCase(updateSellerProduct.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateSellerProduct.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateSellerProduct.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Delete a Product
      .addCase(deleteSellerProduct.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteSellerProduct.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetActionStatus } = sellerProductSlice.actions;
export default sellerProductSlice.reducer;
