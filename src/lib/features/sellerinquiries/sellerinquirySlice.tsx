import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/sellerinquiries`;

const getToken = (getState) => {
  const { user } = getState();
  return user.userInfo?.token;
};

const initialState = {
  inquiries: [],
  selectedInquiry: null,
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

export const createInquiry = createAsyncThunk(
  "sellerInquiries/create",
  async (inquiryData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API_URL, inquiryData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Inquiry failed");
    }
  }
);

export const fetchMyInquiries = createAsyncThunk(
  "sellerInquiries/fetchMy",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/my`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch inquiries"
      );
    }
  }
);

export const fetchAllInquiries = createAsyncThunk(
  "sellerInquiries/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/all`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all inquiries"
      );
    }
  }
);

export const fetchInquiryById = createAsyncThunk(
  "sellerInquiries/fetchById",
  async (inquiryId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/${inquiryId}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch inquiry details"
      );
    }
  }
);

export const updateInquiryStatus = createAsyncThunk(
  "sellerInquiries/updateStatus",
  async ({ inquiryId, status }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${API_URL}/${inquiryId}/status`,
        { status },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

const inquirySlice = createSlice({
  name: "sellerInquiries",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInquiry.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(createInquiry.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      .addCase(fetchMyInquiries.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchMyInquiries.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.inquiries = action.payload;
      })
      .addCase(fetchMyInquiries.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })

      .addCase(fetchAllInquiries.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchAllInquiries.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.inquiries = action.payload;
      })
      .addCase(fetchAllInquiries.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })

      .addCase(fetchInquiryById.pending, (state) => {
        state.actionStatus = "loading";
        state.selectedInquiry = null;
      })
      .addCase(fetchInquiryById.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.selectedInquiry = action.payload;
      })
      .addCase(fetchInquiryById.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      .addCase(updateInquiryStatus.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.inquiries.findIndex(
          (inq) => inq._id === action.payload._id
        );
        if (index !== -1) {
          state.inquiries[index] = action.payload;
        }
        if (
          state.selectedInquiry &&
          state.selectedInquiry._id === action.payload._id
        ) {
          state.selectedInquiry = action.payload;
        }
      })
      .addCase(updateInquiryStatus.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetActionStatus } = inquirySlice.actions;
export default inquirySlice.reducer;
