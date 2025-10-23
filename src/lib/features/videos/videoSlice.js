import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchProducts } from "@/lib/features/products/productSlice";

const getToken = (getState) => {
  const { user } = getState();
  return user.userInfo?.token;
};

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/videos`;

// --- ASYNC THUNKS ---
export const fetchVideos = createAsyncThunk(
  "videos/fetchAll",
  async (topic = null, { rejectWithValue }) => {
    try {
      const params = topic ? { topic } : {};
      const { data } = await axios.get(API_URL, { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch videos"
      );
    }
  }
);

export const fetchTopics = createAsyncThunk(
  "videos/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/topics`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch topics"
      );
    }
  }
);

export const addVideoLink = createAsyncThunk(
  "videos/addLink",
  async (
    { title, youtubeLink, topic, productLink },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { title, youtubeLink, topic };
      // सिर्फ तभी productLink भेजें जब वह मौजूद हो
      if (productLink && productLink !== "none") {
        payload.productLink = productLink;
      }
      const { data } = await axios.post(API_URL, payload, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add video link"
      );
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "videos/delete",
  async (videoId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${videoId}`, config);
      return videoId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete video"
      );
    }
  }
);

const initialState = {
  videos: [],
  topics: [],
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        console.error("Failed to fetch topics:", action.payload);
      });

    builder
      .addCase(addVideoLink.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(addVideoLink.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.videos.unshift(action.payload);
      })
      .addCase(addVideoLink.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(deleteVideo.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.videos = state.videos.filter((v) => v._id !== action.payload);
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });
  },
});

export { fetchProducts as fetchAllProductsForDropdown };
export const { resetActionStatus } = videoSlice.actions;
export default videoSlice.reducer;
