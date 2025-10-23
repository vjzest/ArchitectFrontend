import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/lib/store";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/customize`;

const getToken = (getState: () => RootState): string | null => {
  const { user } = getState();
  return user.userInfo?.token || null;
};

// State interface
interface CustomizationState {
  requests: any[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | unknown;
}

const initialState: CustomizationState = {
  requests: [],
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

// --- Async Thunks ---

export const submitCustomizationRequest = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>("customization/submitRequest", async (formData, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    // Axios ab relative path par request bhejega
    const { data } = await axios.post(API_URL, formData, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Your request could not be submitted."
    );
  }
});

export const fetchAllRequests = createAsyncThunk<
  any[],
  void,
  { state: RootState; rejectValue: string }
>("customization/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch requests"
    );
  }
});

export const updateRequest = createAsyncThunk<
  any,
  { requestId: string; updateData: any },
  { state: RootState; rejectValue: string }
>(
  "customization/update",
  async ({ requestId, updateData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
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

export const deleteRequest = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("customization/delete", async (requestId, { getState, rejectWithValue }) => {
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
});

// The Slice
const customizationSlice = createSlice({
  name: "customization",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Reducers remain the same
    const actionPending = (state: CustomizationState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (state: CustomizationState, action: AnyAction) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    builder
      .addCase(submitCustomizationRequest.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(submitCustomizationRequest.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(
        submitCustomizationRequest.rejected,
        (state, action: AnyAction) => {
          state.actionStatus = "failed";
          state.error = action.payload;
        }
      );

    builder
      .addCase(fetchAllRequests.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchAllRequests.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.requests = action.payload;
      })
      .addCase(fetchAllRequests.rejected, (state, action: AnyAction) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(updateRequest.pending, actionPending)
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.requests = state.requests.map((req: any) =>
          req._id === action.payload._id ? action.payload : req
        );
      })
      .addCase(updateRequest.rejected, actionRejected);

    builder
      .addCase(deleteRequest.pending, actionPending)
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.requests = state.requests.filter(
          (req: any) => req._id !== action.payload
        );
      })
      .addCase(deleteRequest.rejected, actionRejected);
  },
});
export const { resetStatus } = customizationSlice.actions;
export default customizationSlice.reducer;
