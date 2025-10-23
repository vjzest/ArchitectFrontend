import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/inquiries`;
const getToken = (state: RootState) => state.user.userInfo?.token;

interface Inquiry {
  _id: string;
  [key: string]: any;
}

interface InquiryState {
  inquiries: Inquiry[];
  listStatus: "idle" | "loading" | "succeeded" | "failed"; // For fetching list
  actionStatus: "idle" | "loading" | "succeeded" | "failed"; // For create, update, delete
  error: any;
}

const initialState: InquiryState = {
  inquiries: [],
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

// --- Public Action ---
export const createInquiry = createAsyncThunk<Inquiry, any>(
  "inquiries/create",
  async (inquiryData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(API_URL, inquiryData, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send inquiry"
      );
    }
  }
);

// --- Admin Actions ---
export const fetchInquiries = createAsyncThunk<
  Inquiry[],
  void,
  { state: RootState }
>("inquiries/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch inquiries"
    );
  }
});

export const updateInquiryStatus = createAsyncThunk<
  Inquiry,
  { id: string; status: string },
  { state: RootState }
>(
  "inquiries/updateStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
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
        `${API_URL}/${id}/status`,
        { status },
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const deleteInquiry = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("inquiries/delete", async (id, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${id}`, config);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete inquiry"
    );
  }
});

const inquirySlice = createSlice({
  name: "inquiries",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const actionPending = (state: InquiryState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (state: InquiryState, action: AnyAction) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    // Create Inquiry
    builder
      .addCase(createInquiry.pending, actionPending)
      .addCase(createInquiry.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(createInquiry.rejected, actionRejected);

    // Fetch Inquiries (for Admin)
    builder
      .addCase(fetchInquiries.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(
        fetchInquiries.fulfilled,
        (state, action: PayloadAction<Inquiry[]>) => {
          state.listStatus = "succeeded";
          state.inquiries = action.payload;
        }
      )
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    // Update Status (for Admin)
    builder
      .addCase(updateInquiryStatus.pending, actionPending)
      .addCase(
        updateInquiryStatus.fulfilled,
        (state, action: PayloadAction<Inquiry>) => {
          state.actionStatus = "succeeded";
          const index = state.inquiries.findIndex(
            (inq) => inq._id === action.payload._id
          );
          if (index !== -1) {
            state.inquiries[index] = action.payload;
          }
        }
      )
      .addCase(updateInquiryStatus.rejected, actionRejected);

    // Delete Inquiry (for Admin)
    builder
      .addCase(deleteInquiry.pending, actionPending)
      .addCase(
        deleteInquiry.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.inquiries = state.inquiries.filter(
            (inq) => inq._id !== action.payload
          );
        }
      )
      .addCase(deleteInquiry.rejected, actionRejected);
  },
});

export const { resetActionStatus } = inquirySlice.actions;
export default inquirySlice.reducer;
