import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Types
interface PremiumRequest {
  _id: string;
  packageName: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp: string;
  city: string;
  address?: string;
  requirements?: string;
  status: "Pending" | "Contacted" | "In Progress" | "Completed" | "Cancelled";
  createdAt: string;
  updatedAt?: string;
}

interface PremiumRequestState {
  requests: PremiumRequest[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface CreateRequestData {
  packageName: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp: string;
  city: string;
  address?: string;
  requirements?: string;
}

interface UpdateRequestData {
  requestId: string;
  updateData: Partial<Omit<PremiumRequest, "_id" | "createdAt">>;
}

// Helper function to get token
const getToken = (getState: any): string | undefined => {
  const { user } = getState();
  return user.userInfo?.token;
};

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/premium-requests`;

const initialState: PremiumRequestState = {
  requests: [],
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

// Async Thunks
export const createPremiumRequest = createAsyncThunk<
  PremiumRequest,
  CreateRequestData,
  { rejectValue: string }
>("premiumRequests/create", async (requestData, { rejectWithValue }) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(API_URL, requestData, config);
    return data.request;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Submission failed"
    );
  }
});

export const fetchAllPremiumRequests = createAsyncThunk<
  PremiumRequest[],
  void,
  { rejectValue: string }
>("premiumRequests/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axios.get(API_URL, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch requests"
    );
  }
});

export const updatePremiumRequest = createAsyncThunk<
  PremiumRequest,
  UpdateRequestData,
  { rejectValue: string }
>(
  "premiumRequests/update",
  async ({ requestId, updateData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.put(
        `${API_URL}/${requestId}`,
        updateData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update request"
      );
    }
  }
);

export const deletePremiumRequest = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "premiumRequests/delete",
  async (requestId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`${API_URL}/${requestId}`, config);
      return requestId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete request"
      );
    }
  }
);

// Slice
const premiumRequestSlice = createSlice({
  name: "premiumRequests",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const actionPending = (state: PremiumRequestState) => {
      state.actionStatus = "loading";
      state.error = null;
    };

    const actionRejected = (
      state: PremiumRequestState,
      action: PayloadAction<string>
    ) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    builder
      // Create Request
      .addCase(createPremiumRequest.pending, actionPending)
      .addCase(createPremiumRequest.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(createPremiumRequest.rejected, actionRejected)

      // Fetch All Requests (Admin)
      .addCase(fetchAllPremiumRequests.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAllPremiumRequests.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.requests = action.payload;
      })
      .addCase(fetchAllPremiumRequests.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload || "Failed to fetch requests";
      })

      // Update Request
      .addCase(updatePremiumRequest.pending, actionPending)
      .addCase(updatePremiumRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.requests = state.requests.map((req) =>
          req._id === action.payload._id ? action.payload : req
        );
      })
      .addCase(updatePremiumRequest.rejected, actionRejected)

      // Delete Request
      .addCase(deletePremiumRequest.pending, actionPending)
      .addCase(deletePremiumRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.requests = state.requests.filter(
          (req) => req._id !== action.payload
        );
      })
      .addCase(deletePremiumRequest.rejected, actionRejected);
  },
});

export const { resetActionStatus } = premiumRequestSlice.actions;
export default premiumRequestSlice.reducer;

// Export types for use in components
export type { PremiumRequest, PremiumRequestState };
