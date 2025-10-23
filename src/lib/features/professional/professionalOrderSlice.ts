import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/professional-orders`;

// Helper to get token
const getToken = (getState: () => any): string | null => {
  const state = getState() as RootState;
  return state.user.userInfo?.token || null;
};

// Interface for a single order
interface ProfessionalOrder {
  _id: string;
  orderId: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  orderItems: {
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  isPaid: boolean;
}

// Interface for the slice state
interface ProfessionalOrderState {
  orders: ProfessionalOrder[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfessionalOrderState = {
  orders: [],
  status: "idle",
  error: null,
};

// Async thunk to fetch orders for the logged-in professional
export const fetchMyProfessionalOrders = createAsyncThunk<
  ProfessionalOrder[],
  void,
  { rejectValue: string; getState: () => any }
>("professionalOrders/fetchMy", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    if (!token) {
      return rejectWithValue("Not authorized, no token");
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/my-orders`, config);
    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch orders";
    return rejectWithValue(message);
  }
});

const professionalOrderSlice = createSlice({
  name: "professionalOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfessionalOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchMyProfessionalOrders.fulfilled,
        (state, action: PayloadAction<ProfessionalOrder[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
        }
      )
      .addCase(
        fetchMyProfessionalOrders.rejected,
        (state, action: AnyAction) => {
          state.status = "failed";
          state.error = action.payload as string;
        }
      );
  },
});

export default professionalOrderSlice.reducer;
