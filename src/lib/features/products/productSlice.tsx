import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

const getToken = (getState: () => RootState) => {
  const { user } = getState();
  return user.userInfo?.token;
};

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  altText?: string;
}

export interface Product {
  _id: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  description: string;
  price: number;
  isSale?: boolean;
  salePrice?: number;
  category: string | string[];
  planType?: string;
  plotSize?: string;
  plotArea?: number;
  rooms?: number | string;
  bathrooms?: number;
  kitchen?: number;
  floors?: number | string;
  direction?: string;
  country?: string[];
  city?: string | string[];
  propertyType?: string;
  mainImage?: string;
  planFile?: string[];
  galleryImages?: string[];
  youtubeLink?: string;
  reviews?: Review[];
  rating?: number;
  numReviews?: number;
  seo?: SeoData;
  taxRate?: number;
  crossSellProducts?: Product[];
  upSellProducts?: Product[];
  productNo?: string | number;
  ID?: number;
  Type?: string;
  SKU?: string;
  Name?: string;
  Published?: number;
  "Is featured?"?: number;
  "Visibility in catalog"?: string;
  "Short description"?: string;
  "Regular price"?: number;
  "Sale price"?: number;
  "Tax status"?: string;
  "Tax class"?: number;
  "In stock?"?: number;
  Categories?: string;
  Tags?: string;
  Images?: string;
  Upsells?: string;
  "Cross-sells"?: string;
  Position?: number;
  "Attribute 1 name"?: string;
  "Attribute 1 value(s)"?: string;
  "Attribute 2 name"?: string;
  "Attribute 2 value(s)"?: string;
  "Attribute 3 name"?: string;
  "Attribute 3 value(s)"?: string;
  "Attribute 4 name"?: string;
  "Attribute 4 value(s)"?: string;
  "Attribute 5 name"?: string;
  "Attribute 5 value(s)"?: string;
  "Download 1 URL"?: string;
  "Download 2 URL"?: string;
  "Download 3 URL"?: string;
  [key: string]: any;
}

interface FetchProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  count: number;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  page: number;
  pages: number;
  count: number;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}
const initialState: ProductState = {
  products: [],
  product: null,
  page: 1,
  pages: 1,
  count: 0,
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk<
  FetchProductsResponse,
  { [key: string]: any },
  { rejectValue: string }
>("products/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_URL, { params });
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
});

export const fetchProductBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchBySlug", async (slug, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/slug/${slug}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Product not found"
    );
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchById", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/${productId}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Product not found"
    );
  }
});

export const createProduct = createAsyncThunk<
  Product,
  FormData,
  { state: RootState; rejectValue: string }
>("products/create", async (productData, { getState, rejectWithValue }) => {
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
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create product"
    );
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { productId: string; productData: FormData },
  { state: RootState; rejectValue: string }
>(
  "products/update",
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
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("products/delete", async (productId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${productId}`, config);
    return productId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete product"
    );
  }
});

export const createReview = createAsyncThunk<
  { message: string },
  { productId: string; reviewData: { rating: number; comment: string } },
  { state: RootState; rejectValue: string }
>(
  "products/createReview",
  async ({ productId, reviewData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${API_URL}/${productId}/reviews`,
        reviewData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit review"
      );
    }
  }
);

export const removeCsvImage = createAsyncThunk<
  Product,
  { productId: string; imageUrl: string },
  { state: RootState; rejectValue: string }
>(
  "products/removeCsvImage",
  async ({ productId, imageUrl }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { imageUrl },
      };
      const { data } = await axios.delete(
        `${API_URL}/${productId}/csv-image`,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove image"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.product = null;
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const actionPending = (state: ProductState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (state: ProductState, action: AnyAction) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    builder.addCase(fetchProducts.pending, (state) => {
      state.listStatus = "loading";
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<FetchProductsResponse>) => {
        state.listStatus = "succeeded";
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.count = action.payload.count;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action: AnyAction) => {
      state.listStatus = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchProductById.pending, (state) => {
      state.listStatus = "loading";
    });
    builder.addCase(
      fetchProductById.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.listStatus = "succeeded";
        state.product = action.payload;
      }
    );
    builder.addCase(fetchProductById.rejected, (state, action: AnyAction) => {
      state.listStatus = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchProductBySlug.pending, (state) => {
      state.listStatus = "loading";
    });
    builder.addCase(
      fetchProductBySlug.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.listStatus = "succeeded";
        state.product = action.payload;
      }
    );
    builder.addCase(fetchProductBySlug.rejected, (state, action: AnyAction) => {
      state.listStatus = "failed";
      state.error = action.payload;
    });

    builder
      .addCase(createProduct.pending, actionPending)
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.actionStatus = "succeeded";
          state.products.unshift(action.payload);
        }
      )
      .addCase(createProduct.rejected, actionRejected);
    builder
      .addCase(updateProduct.pending, actionPending)
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.actionStatus = "succeeded";
          state.products = state.products.map((p) =>
            p._id === action.payload._id ? action.payload : p
          );
          if (state.product?._id === action.payload._id) {
            state.product = action.payload;
          }
        }
      )
      .addCase(updateProduct.rejected, actionRejected);
    builder
      .addCase(deleteProduct.pending, actionPending)
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.products = state.products.filter(
            (p) => p._id !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, actionRejected);
    builder
      .addCase(createReview.pending, actionPending)
      .addCase(createReview.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(createReview.rejected, actionRejected);
    builder
      .addCase(removeCsvImage.pending, actionPending)
      .addCase(
        removeCsvImage.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.actionStatus = "succeeded";
          state.products = state.products.map((p) =>
            p._id === action.payload._id ? action.payload : p
          );
          if (state.product?._id === action.payload._id) {
            state.product = action.payload;
          }
        }
      )
      .addCase(removeCsvImage.rejected, actionRejected);
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
