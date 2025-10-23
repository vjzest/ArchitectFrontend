import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/standard-requests`;

const getToken = (getState: () => RootState): string | null => {
  const { user } = getState();
  return user.userInfo?.token || null;
};

interface StandardRequest {
  _id: string;
  [key: string]: any;
}

interface StandardRequestState {
  requests: StandardRequest[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: StandardRequestState = {
  requests: [],
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

// --- ✨ NEW THUNK FOR PUBLIC FORM SUBMISSION ✨ ---
export const createStandardRequest = createAsyncThunk<
  StandardRequest,
  any, // The data from the form
  { rejectValue: string }
>("standardRequests/create", async (requestData, { rejectWithValue }) => {
  try {
    // This is a public request, so no token is needed.
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(API_URL, requestData, config);
    return data.request as StandardRequest; // Return the created request object
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Your request could not be submitted."
    );
  }
});

// --- Admin Thunks ---
export const fetchAllStandardRequests = createAsyncThunk<
  StandardRequest[],
  void,
  { state: RootState }
>("standardRequests/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data as StandardRequest[];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch requests"
    );
  }
});

export const updateStandardRequest = createAsyncThunk<
  StandardRequest,
  { requestId: string; updateData: any },
  { state: RootState }
>(
  "standardRequests/update",
  async ({ requestId, updateData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${API_URL}/${requestId}`,
        updateData,
        config
      );
      return data as StandardRequest;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update request"
      );
    }
  }
);

export const deleteStandardRequest = createAsyncThunk<
  string,
  string,
  { state: RootState }
>(
  "standardRequests/delete",
  async (requestId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${requestId}`, config);
      return requestId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete request"
      );
    }
  }
);

// The Slice
const standardRequestSlice = createSlice({
  name: "standardRequests",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const actionPending = (state: StandardRequestState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (state: StandardRequestState, action: AnyAction) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    builder
      // ✨ Reducers for the new create action ✨
      .addCase(createStandardRequest.pending, actionPending)
      .addCase(createStandardRequest.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(createStandardRequest.rejected, actionRejected)

      // Admin Reducers
      .addCase(fetchAllStandardRequests.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(
        fetchAllStandardRequests.fulfilled,
        (state, action: PayloadAction<StandardRequest[]>) => {
          state.listStatus = "succeeded";
          state.requests = action.payload;
        }
      )
      .addCase(fetchAllStandardRequests.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateStandardRequest.pending, actionPending)
      .addCase(
        updateStandardRequest.fulfilled,
        (state, action: PayloadAction<StandardRequest>) => {
          state.actionStatus = "succeeded";
          state.requests = state.requests.map((req) =>
            req._id === action.payload._id ? action.payload : req
          );
        }
      )
      .addCase(updateStandardRequest.rejected, actionRejected)
      .addCase(deleteStandardRequest.pending, actionPending)
      .addCase(
        deleteStandardRequest.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.requests = state.requests.filter(
            (req) => req._id !== action.payload
          );
        }
      )
      .addCase(deleteStandardRequest.rejected, actionRejected);
  },
});

export const { resetActionStatus } = standardRequestSlice.actions;
export default standardRequestSlice.reducer;
