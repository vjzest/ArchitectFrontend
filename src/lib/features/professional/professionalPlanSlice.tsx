import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/professional-plans`;

// Helper to get token from state
const getToken = (state: RootState) => {
  const { user } = state;
  return (
    user.userInfo?.token ||
    user.userInfo?.accessToken ||
    user.userInfo?.data?.token
  );
};

// --- Interfaces ---
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
}

export interface Plan {
  _id: string;
  planName: string;
  name: string;
  description: string;
  productNo: string;
  plotSize: string;
  plotArea: number;
  rooms: number;
  bathrooms?: number;
  kitchen?: number;
  floors?: number;
  direction?: string;
  city: string[] | string;
  country: string[] | string;
  planType: string;
  price: number;
  salePrice?: number;
  isSale?: boolean;
  category: string[] | string;
  propertyType?: string;
  status?: string;
  mainImage: string;
  galleryImages?: string[];
  planFile: string[];
  headerImage?: string;
  rating?: number;
  numReviews?: number;
  youtubeLink?: string;
  reviews?: Review[];
  contactDetails?: { name?: string; email?: string; phone?: string };
  seo?: SeoData;
  [key: string]: any;
}

interface PaginatedPlanResponse {
  plans: Plan[];
  page: number;
  pages: number;
}

interface ProfessionalPlanState {
  plans: Plan[];
  plan: Plan | null;
  page: number;
  pages: number;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: ProfessionalPlanState = {
  plans: [],
  plan: null,
  page: 1,
  pages: 1,
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

// --- ASYNC THUNKS ---

export const fetchAllApprovedPlans = createAsyncThunk<
  PaginatedPlanResponse,
  { [key: string]: any },
  { rejectValue: string }
>("professionalPlans/fetchAllApproved", async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_URL, { params });
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch approved plans"
    );
  }
});

export const fetchMyPlans = createAsyncThunk<
  Plan[],
  void,
  { state: RootState }
>("professionalPlans/fetchMy", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) return rejectWithValue("Authentication token not found.");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/my-plans`, config);
    return Array.isArray(data) ? data : data.plans || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch your plans"
    );
  }
});

export const fetchPlanById = createAsyncThunk<
  Plan,
  string,
  { rejectValue: string }
>("professionalPlans/fetchById", async (planId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/${planId}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Plan not found");
  }
});

export const fetchPlanBySlug = createAsyncThunk<
  Plan,
  string,
  { rejectValue: string }
>("professionalPlans/fetchBySlug", async (slug, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/slug/${slug}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Plan not found");
  }
});

export const createPlan = createAsyncThunk<
  Plan,
  FormData,
  { state: RootState }
>(
  "professionalPlans/create",
  async (planData, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) return rejectWithValue("Authentication token not found.");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(API_URL, planData, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create plan"
      );
    }
  }
);

export const updatePlan = createAsyncThunk<
  Plan,
  { planId: string; planData: FormData },
  { state: RootState }
>(
  "professionalPlans/update",
  async ({ planId, planData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) return rejectWithValue("Authentication token not found.");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/${planId}`,
        planData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update plan"
      );
    }
  }
);

export const deletePlan = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("professionalPlans/delete", async (planId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) return rejectWithValue("Authentication token not found.");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${planId}`, config);
    return planId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete plan"
    );
  }
});

export const createPlanReview = createAsyncThunk<
  { message: string },
  { planId: string; reviewData: { rating: number; comment: string } },
  { state: RootState; rejectValue: string }
>(
  "professionalPlans/createReview",
  async ({ planId, reviewData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) return rejectWithValue("Authentication token not found.");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${API_URL}/${planId}/reviews`,
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

// --- SLICE DEFINITION ---

const professionalPlanSlice = createSlice({
  name: "professionalPlans",
  initialState,
  reducers: {
    resetPlanActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
    resetPlanState: (state) => {
      state.plan = null;
      state.listStatus = "idle";
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Helper functions for pending/rejected states
    const listPending = (state: ProfessionalPlanState) => {
      state.listStatus = "loading";
      state.error = null;
    };
    const listRejected = (state: ProfessionalPlanState, action: AnyAction) => {
      state.listStatus = "failed";
      state.error = action.payload;
    };
    const actionPending = (state: ProfessionalPlanState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (
      state: ProfessionalPlanState,
      action: AnyAction
    ) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    // Fetch All Plans (Updated for pagination)
    builder.addCase(fetchAllApprovedPlans.pending, listPending);
    builder.addCase(
      fetchAllApprovedPlans.fulfilled,
      (state, action: PayloadAction<PaginatedPlanResponse>) => {
        state.listStatus = "succeeded";
        state.plans = action.payload.plans;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      }
    );
    builder.addCase(fetchAllApprovedPlans.rejected, listRejected);

    // Fetch My Plans
    builder.addCase(fetchMyPlans.pending, listPending);
    builder.addCase(
      fetchMyPlans.fulfilled,
      (state, action: PayloadAction<Plan[]>) => {
        state.listStatus = "succeeded";
        state.plans = action.payload;
      }
    );
    builder.addCase(fetchMyPlans.rejected, listRejected);

    // Fetch Plan by ID or Slug
    const fetchSinglePlanFulfilled = (
      state: ProfessionalPlanState,
      action: PayloadAction<Plan>
    ) => {
      state.listStatus = "succeeded";
      state.plan = action.payload;
      // Also add/update it in the main list if it's not there
      const index = state.plans.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      } else {
        state.plans.unshift(action.payload);
      }
    };
    builder
      .addCase(fetchPlanById.pending, listPending)
      .addCase(fetchPlanById.fulfilled, fetchSinglePlanFulfilled)
      .addCase(fetchPlanById.rejected, listRejected);
    builder
      .addCase(fetchPlanBySlug.pending, listPending)
      .addCase(fetchPlanBySlug.fulfilled, fetchSinglePlanFulfilled)
      .addCase(fetchPlanBySlug.rejected, listRejected);

    // Create Plan
    builder.addCase(createPlan.pending, actionPending);
    builder.addCase(
      createPlan.fulfilled,
      (state, action: PayloadAction<Plan>) => {
        state.actionStatus = "succeeded";
        state.plans.unshift(action.payload);
      }
    );
    builder.addCase(createPlan.rejected, actionRejected);

    // Update Plan
    builder.addCase(updatePlan.pending, actionPending);
    builder.addCase(
      updatePlan.fulfilled,
      (state, action: PayloadAction<Plan>) => {
        state.actionStatus = "succeeded";
        state.plans = state.plans.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        if (state.plan?._id === action.payload._id) {
          state.plan = action.payload;
        }
      }
    );
    builder.addCase(updatePlan.rejected, actionRejected);

    // Delete Plan
    builder.addCase(deletePlan.pending, actionPending);
    builder.addCase(
      deletePlan.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.actionStatus = "succeeded";
        state.plans = state.plans.filter((p) => p._id !== action.payload);
        if (state.plan?._id === action.payload) {
          state.plan = null;
        }
      }
    );
    builder.addCase(deletePlan.rejected, actionRejected);

    // Create Review
    builder.addCase(createPlanReview.pending, actionPending);
    builder.addCase(createPlanReview.fulfilled, (state) => {
      state.actionStatus = "succeeded";
    });
    builder.addCase(createPlanReview.rejected, actionRejected);
  },
});

export const { resetPlanActionStatus, resetPlanState } =
  professionalPlanSlice.actions;
export default professionalPlanSlice.reducer;
