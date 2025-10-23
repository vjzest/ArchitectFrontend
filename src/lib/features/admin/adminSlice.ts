// lib/features/admin/adminSlice.js
import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;

const getToken = (state: RootState) => state.user.userInfo?.token;

// Interfaces for data types
interface SummaryData {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
}
interface User {
  _id: string;
  [key: string]: any;
}
interface Order {
  _id: string;
  [key: string]: any;
}
interface Product {
  _id: string;
  [key: string]: any;
}
interface ProfessionalPlan {
  _id: string;
  [key: string]: any;
}
interface ReportData {
  summary: {
    netSales: number;
    orders: number;
    customers: number;
    avgOrderValue: number;
  };
  salesOverTime: { date: string; sales: number }[];
  topProducts: { name: string; sales: number }[];
}

interface AdminState {
  summary: SummaryData | null;
  users: User[];
  orders: Order[];
  products: Product[];
  professionalPlans: ProfessionalPlan[];
  requestsAndInquiries: any;
  reports: ReportData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}
const initialState: AdminState = {
  summary: null,
  users: [],
  orders: [],
  products: [],
  professionalPlans: [],
  requestsAndInquiries: {},
  reports: null,
  status: "idle",
  actionStatus: "idle",
  error: null,
};
export const fetchDashboardSummary = createAsyncThunk<
  SummaryData,
  void,
  { state: RootState }
>("admin/fetchSummary", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/summary`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch summary"
    );
  }
});

export const fetchAllUsersAdmin = createAsyncThunk<
  User[],
  void,
  { state: RootState }
>("admin/fetchAllUsers", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/users`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});
export const updateUserAdmin = createAsyncThunk<
  User,
  { userId: string; userData: any },
  { state: RootState }
>(
  "admin/updateUser",
  async ({ userId, userData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${API_URL}/users/${userId}`,
        userData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);
export const deleteUserAdmin = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("admin/deleteUser", async (userId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/users/${userId}`, config);
    return userId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete user"
    );
  }
});
export const fetchAllProfessionalPlansAdmin = createAsyncThunk<
  ProfessionalPlan[],
  void,
  { state: RootState }
>("admin/fetchAllPlans", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/professional-plans`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch plans"
    );
  }
});
export const updatePlanStatusAdmin = createAsyncThunk<
  ProfessionalPlan,
  { planId: string; status: string },
  { state: RootState }
>(
  "admin/updatePlanStatus",
  async ({ planId, status }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${API_URL}/professional-plans/${planId}/status`,
        { status },
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update plan status"
      );
    }
  }
);
export const fetchReportsData = createAsyncThunk<
  ReportData,
  void,
  { state: RootState }
>("admin/fetchReports", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/reports-data`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch reports data"
    );
  }
});
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const listPending = (state: AdminState) => {
      state.status = "loading";
      state.error = null;
    };
    const listFailed = (state: AdminState, action: AnyAction) => {
      state.status = "failed";
      state.error = action.payload;
    };
    const actionPending = (state: AdminState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionFailed = (state: AdminState, action: AnyAction) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    // Summary
    builder
      .addCase(fetchDashboardSummary.pending, listPending)
      .addCase(
        fetchDashboardSummary.fulfilled,
        (state, action: PayloadAction<SummaryData>) => {
          state.status = "succeeded";
          state.summary = action.payload;
        }
      )
      .addCase(fetchDashboardSummary.rejected, listFailed);
    // Users
    builder
      .addCase(fetchAllUsersAdmin.pending, listPending)
      .addCase(
        fetchAllUsersAdmin.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.status = "succeeded";
          state.users = action.payload;
        }
      )
      .addCase(fetchAllUsersAdmin.rejected, listFailed)
      .addCase(updateUserAdmin.pending, actionPending)
      .addCase(
        updateUserAdmin.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.actionStatus = "succeeded";
          state.users = state.users.map((u) =>
            u._id === action.payload._id ? action.payload : u
          );
        }
      )
      .addCase(updateUserAdmin.rejected, actionFailed)
      .addCase(deleteUserAdmin.pending, actionPending)
      .addCase(
        deleteUserAdmin.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.users = state.users.filter((u) => u._id !== action.payload);
        }
      )
      .addCase(deleteUserAdmin.rejected, actionFailed);
    builder
      .addCase(fetchAllProfessionalPlansAdmin.pending, listPending)
      .addCase(
        fetchAllProfessionalPlansAdmin.fulfilled,
        (state, action: PayloadAction<ProfessionalPlan[]>) => {
          state.status = "succeeded";
          state.professionalPlans = action.payload;
        }
      )
      .addCase(fetchAllProfessionalPlansAdmin.rejected, listFailed)
      .addCase(updatePlanStatusAdmin.pending, actionPending)
      .addCase(
        updatePlanStatusAdmin.fulfilled,
        (state, action: PayloadAction<ProfessionalPlan>) => {
          state.actionStatus = "succeeded";
          state.professionalPlans = state.professionalPlans.map((p) =>
            p._id === action.payload._id ? action.payload : p
          );
        }
      )
      .addCase(updatePlanStatusAdmin.rejected, actionFailed);
    // Reports Data
    builder
      .addCase(fetchReportsData.pending, listPending)
      .addCase(
        fetchReportsData.fulfilled,
        (state, action: PayloadAction<ReportData>) => {
          state.status = "succeeded";
          state.reports = action.payload;
        }
      )
      .addCase(fetchReportsData.rejected, listFailed);
  },
});
export const { resetAdminActionStatus } = adminSlice.actions;
export default adminSlice.reducer;
