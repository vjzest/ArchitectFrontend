import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/gallery`;

export interface GalleryItem {
  _id: string;
  title: string;
  altText?: string; 
  category: string;
  imageUrl: string;
  productLink?: string; 
  createdAt?: string;
}

interface GalleryState {
  items: GalleryItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GalleryState = {
  items: [],
  status: "idle",
  actionStatus: "idle",
  error: null,
};


export const fetchGalleryItems = createAsyncThunk(
  "gallery/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not fetch gallery items."
      );
    }
  }
);

export const createGalleryItem = createAsyncThunk<GalleryItem, FormData>(
  "gallery/createItem",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as RootState;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.userInfo?.token}`,
        },
      };
      const { data } = await axios.post(API_URL, formData, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload image."
      );
    }
  }
);

export const deleteGalleryItem = createAsyncThunk<string, string>(
  "gallery/deleteItem",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as RootState;
      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo?.token}`,
        },
      };
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete image."
      );
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchGalleryItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchGalleryItems.fulfilled,
        (state, action: PayloadAction<GalleryItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchGalleryItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create
      .addCase(createGalleryItem.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(
        createGalleryItem.fulfilled,
        (state, action: PayloadAction<GalleryItem>) => {
          state.actionStatus = "succeeded";
          state.items.unshift(action.payload);
        }
      )
      .addCase(createGalleryItem.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteGalleryItem.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(
        deleteGalleryItem.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.items = state.items.filter(
            (item) => item._id !== action.payload
          );
        }
      )
      .addCase(deleteGalleryItem.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetActionStatus } = gallerySlice.actions;
export default gallerySlice.reducer;
