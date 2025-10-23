import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/blogs`;

// Helper to get token
const getToken = (getState: () => RootState) => {
  const state = getState();
  return state.user.userInfo?.token;
};

// =================================================================
// ✅✅ INTERFACE KO NAYE h1Text FIELD KE SAATH UPDATE KIYA GAYA HAI ✅✅
// =================================================================
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  mainImage: string;
  status: "Published" | "Draft";
  tags: string[];
  h1Text?: string; // Optional H1 tag
  metaDescription?: string;
  metaKeywords?: string[];
  imageAltText: string;
  imageTitleText?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  posts: BlogPost[];
  post: BlogPost | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BlogState = {
  posts: [],
  post: null,
  status: "idle",
  actionStatus: "idle",
  error: null,
};

// --- Public Thunks ---
export const fetchAllPosts = createAsyncThunk(
  "blog/fetchAllPublic",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const fetchPostBySlug = createAsyncThunk(
  "blog/fetchBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/slug/${slug}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Post not found");
    }
  }
);

// --- ADMIN THUNKS ---
export const fetchAllPostsAdmin = createAsyncThunk<
  BlogPost[],
  void,
  { state: RootState }
>("blog/fetchAllAdmin", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/all`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const createPost = createAsyncThunk<
  BlogPost,
  FormData,
  { state: RootState }
>("blog/create", async (postData, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(API_URL, postData, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const updatePost = createAsyncThunk<
  BlogPost,
  { postId: string; postData: FormData },
  { state: RootState }
>(
  "blog/update",
  async ({ postId, postData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.put(
        `${API_URL}/${postId}`,
        postData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deletePost = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("blog/delete", async (postId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${postId}`, config);
    return postId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.post = null;
      state.status = "idle";
    },
    resetBlogActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const listPending = (state: BlogState) => {
      state.status = "loading";
      state.error = null;
    };
    const listRejected = (state: BlogState, action: any) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    };
    const actionPending = (state: BlogState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (state: BlogState, action: any) => {
      state.actionStatus = "failed";
      state.error = action.payload || action.error.message;
    };

    builder
      .addCase(fetchAllPosts.pending, listPending)
      .addCase(
        fetchAllPosts.fulfilled,
        (state, action: PayloadAction<BlogPost[]>) => {
          state.status = "succeeded";
          state.posts = action.payload;
        }
      )
      .addCase(fetchAllPosts.rejected, listRejected)
      .addCase(fetchPostBySlug.pending, listPending)
      .addCase(
        fetchPostBySlug.fulfilled,
        (state, action: PayloadAction<BlogPost>) => {
          state.status = "succeeded";
          state.post = action.payload;
        }
      )
      .addCase(fetchPostBySlug.rejected, listRejected)
      .addCase(fetchAllPostsAdmin.pending, listPending)
      .addCase(
        fetchAllPostsAdmin.fulfilled,
        (state, action: PayloadAction<BlogPost[]>) => {
          state.status = "succeeded";
          state.posts = action.payload;
        }
      )
      .addCase(fetchAllPostsAdmin.rejected, listRejected)
      .addCase(createPost.pending, actionPending)
      .addCase(
        createPost.fulfilled,
        (state, action: PayloadAction<BlogPost>) => {
          state.actionStatus = "succeeded";
          state.posts.unshift(action.payload);
        }
      )
      .addCase(createPost.rejected, actionRejected)
      .addCase(updatePost.pending, actionPending)
      .addCase(
        updatePost.fulfilled,
        (state, action: PayloadAction<BlogPost>) => {
          state.actionStatus = "succeeded";
          const index = state.posts.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) {
            state.posts[index] = action.payload;
          } else {
            state.posts.unshift(action.payload);
          }
        }
      )
      .addCase(updatePost.rejected, actionRejected)
      .addCase(deletePost.pending, actionPending)
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionStatus = "succeeded";
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePost.rejected, actionRejected);
  },
});

export const { clearCurrentPost, resetBlogActionStatus } = blogSlice.actions;
export default blogSlice.reducer;
