// File: lib/features/users/userSlice.js

import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const getToken = (state: RootState) => state.user.userInfo?.token;

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo") as string)
  : null;

interface UserInfo {
  _id: string;
  name?: string;
  email: string;
  token?: string;
  photoUrl?: string;
  role?: string;
  businessName?: string;
  shopImageUrl?: string;
  companyName?: string;
  materialType?: string;
  city?: string;
  address?: string;
  experience?: string;
  isApproved?: boolean;
  status?: string;
  [key: string]: any;
}

interface UserState {
  userInfo: UserInfo | null;
  users: UserInfo[];
  sellers: UserInfo[];
  contractors: UserInfo[];
  pagination: any;
  stats: any;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  sellerListStatus: "idle" | "loading" | "succeeded" | "failed";
  contractorListStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: UserState = {
  userInfo: userInfoFromStorage,
  users: [],
  sellers: [],
  contractors: [],
  pagination: null,
  stats: null,
  listStatus: "idle",
  sellerListStatus: "idle",
  contractorListStatus: "idle",
  actionStatus: "idle",
  error: null,
};

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

// --- Public Thunks for Sellers and Contractors ---
export const fetchSellers = createAsyncThunk(
  "user/fetchSellers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}?role=seller`);
      return data.users || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sellers"
      );
    }
  }
);

export const fetchContractors = createAsyncThunk(
  "user/fetchContractors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}?role=Contractor`);
      return data.users || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contractors"
      );
    }
  }
);

// --- Authentication Thunks ---
export const registerUser = createAsyncThunk<UserInfo, FormData>(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post(
        `${API_URL}/register`,
        userData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk<
  UserInfo,
  { email: string; password: string }
>("user/login", async (userData, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(`${API_URL}/login`, userData, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const updateProfile = createAsyncThunk<
  UserInfo,
  FormData,
  { state: RootState }
>("user/updateProfile", async (formData, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    if (!state.user.userInfo) {
      throw new Error("User not logged in");
    }
    const userId = state.user.userInfo._id;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(`${API_URL}/${userId}`, formData, config);
    const updatedUserInfo = { ...state.user.userInfo, ...data };
    return updatedUserInfo;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update profile"
    );
  }
});

// --- Admin Thunks for User Management ---
export const fetchUsers = createAsyncThunk<
  { users: UserInfo[]; pagination: any },
  Record<string, any>,
  { state: RootState }
>("user/fetchAll", async (params = {}, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` }, params };
    const { data } = await axios.get(API_URL, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});

export const updateUserByAdmin = createAsyncThunk<
  UserInfo,
  { userId: string; userData: any },
  { state: RootState }
>("user/updateByAdmin", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(
      `${API_URL}/${args.userId}`,
      args.userData,
      config
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update user"
    );
  }
});

export const createUserByAdmin = createAsyncThunk<
  UserInfo,
  any,
  { state: RootState }
>("user/createByAdmin", async (userData, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `${API_URL}/admin/create`,
      userData,
      config
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create user"
    );
  }
});

export const deleteUserByAdmin = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("user/deleteByAdmin", async (userId, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${userId}`, config);
    return userId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete user"
    );
  }
});

export const getUserStats = createAsyncThunk<any, void, { state: RootState }>(
  "user/getStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = getToken(state);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/stats`, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userInfo");
      state.userInfo = null;
      state.users = [];
      state.sellers = [];
      state.contractors = [];
      state.listStatus = "idle";
      state.sellerListStatus = "idle";
      state.contractorListStatus = "idle";
      state.actionStatus = "idle";
      state.error = null;
    },
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const actionPending = (state: UserState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (state: UserState, action: AnyAction) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    // Auth & Profile
    builder
      .addCase(registerUser.pending, actionPending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.userInfo = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, actionRejected)

      .addCase(loginUser.pending, actionPending)
      // --- YAHAN BADLAAV KIYA GAYA HAI ---
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          // Ab yeh sabhi roles ke liye kaam karega.
          // Backend ab pending users ko handle kar raha hai.
          state.actionStatus = "succeeded";
          state.userInfo = action.payload;
          localStorage.setItem("userInfo", JSON.stringify(action.payload));
        }
      )
      .addCase(loginUser.rejected, actionRejected)

      .addCase(updateProfile.pending, actionPending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.userInfo = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, actionRejected);

    // Admin List
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    // Admin Actions
    builder
      .addCase(createUserByAdmin.pending, actionPending)
      .addCase(createUserByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.users.unshift(action.payload);
      })
      .addCase(createUserByAdmin.rejected, actionRejected)
      .addCase(updateUserByAdmin.pending, actionPending)
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateUserByAdmin.rejected, actionRejected)
      .addCase(deleteUserByAdmin.pending, actionPending)
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUserByAdmin.rejected, actionRejected)
      .addCase(getUserStats.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    // Public Sellers List
    builder
      .addCase(fetchSellers.pending, (state) => {
        state.sellerListStatus = "loading";
      })
      .addCase(
        fetchSellers.fulfilled,
        (state, action: PayloadAction<UserInfo[]>) => {
          state.sellerListStatus = "succeeded";
          state.sellers = action.payload;
        }
      )
      .addCase(fetchSellers.rejected, (state, action: AnyAction) => {
        state.sellerListStatus = "failed";
        state.error = action.payload;
      });

    // Public Contractors List
    builder
      .addCase(fetchContractors.pending, (state) => {
        state.contractorListStatus = "loading";
      })
      .addCase(
        fetchContractors.fulfilled,
        (state, action: PayloadAction<UserInfo[]>) => {
          state.contractorListStatus = "succeeded";
          state.contractors = action.payload;
        }
      )
      .addCase(fetchContractors.rejected, (state, action: AnyAction) => {
        state.contractorListStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, resetActionStatus } = userSlice.actions;
export default userSlice.reducer;
