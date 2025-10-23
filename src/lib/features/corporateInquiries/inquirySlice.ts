import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store"; // Apne store ke path ke anusaar

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/corporate-inquiries`;

const getToken = (state: RootState) => state.user.userInfo?.token;

// --- TypeScript Interfaces ---
interface Inquiry {
  _id: string;
  companyName: string;
  contactPerson: string;
  workEmail: string;
  phoneNumber: string;
  projectType: string;
  projectDetails: string;
  projectBriefUrl?: string;
  status: "New" | "Contacted" | "In Progress" | "Closed";
  createdAt: string;
}

interface InquiryState {
  inquiries: Inquiry[];
  inquiry: Inquiry | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: InquiryState = {
  inquiries: [],
  inquiry: null,
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

// --- Async Thunks ---

// 1. Submit a new inquiry (Public)
export const submitInquiry = createAsyncThunk<
  Inquiry,
  FormData,
  { rejectValue: string }
>("inquiries/submit", async (inquiryData, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.post(API_URL, inquiryData, config);
    return data.inquiry;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to submit inquiry"
    );
  }
});

// 2. Fetch all inquiries (Admin)
export const fetchAllInquiries = createAsyncThunk<
  Inquiry[],
  void,
  { state: RootState; rejectValue: string }
>("inquiries/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch inquiries"
    );
  }
});

// 3. Update an inquiry (Admin)
export const updateInquiry = createAsyncThunk<
  Inquiry,
  { inquiryId: string; inquiryData: Partial<Inquiry> },
  { state: RootState; rejectValue: string }
>(
  "inquiries/update",
  async ({ inquiryId, inquiryData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${API_URL}/${inquiryId}`,
        inquiryData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update inquiry"
      );
    }
  }
);

// 4. Delete an inquiry (Admin)
export const deleteInquiry = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("inquiries/delete", async (inquiryId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${inquiryId}`, config);
    return inquiryId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete inquiry"
    );
  }
});

const inquirySlice = createSlice({
  name: "corporateInquiries",
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

    // Submit Inquiry
    builder
      .addCase(submitInquiry.pending, actionPending)
      .addCase(
        submitInquiry.fulfilled,
        (state, action: PayloadAction<Inquiry>) => {
          state.actionStatus = "succeeded";
          // Optionally add to list if admin is viewing, but usually not needed for public form.
        }
      )
      .addCase(submitInquiry.rejected, actionRejected);

    // Fetch All Inquiries
    builder
      .addCase(fetchAllInquiries.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(
        fetchAllInquiries.fulfilled,
        (state, action: PayloadAction<Inquiry[]>) => {
          state.listStatus = "succeeded";
          state.inquiries = action.payload;
        }
      )
      .addCase(fetchAllInquiries.rejected, (state, action: AnyAction) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    // Update Inquiry
    builder
      .addCase(updateInquiry.pending, actionPending)
      .addCase(
        updateInquiry.fulfilled,
        (state, action: PayloadAction<Inquiry>) => {
          state.actionStatus = "succeeded";
          state.inquiries = state.inquiries.map((inq) =>
            inq._id === action.payload._id ? action.payload : inq
          );
        }
      )
      .addCase(updateInquiry.rejected, actionRejected);

    // Delete Inquiry
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
