import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/packages`;
const getToken = (state: RootState) => state.user.userInfo?.token;


interface Package {
  _id: string;
  title: string;
  price: string;
  unit: string;
  areaType?: string;
  isPopular: boolean;
  packageType: "standard" | "premium";
  features: string[];
  includes?: string[];
  note?: string;
  [key: string]: any; 
}

interface PackageState {
  packages: Package[];
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed"; 
  error: any;
}

const initialState: PackageState = {
  packages: [],
  status: "idle",
  actionStatus: "idle",
  error: null,
};

export const createPackage = createAsyncThunk<
  Package,
  Omit<Package, "_id">,
  { state: RootState }
>(
  "packages/createAdmin",
  async (packageData, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(API_URL, packageData, config);
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create package"
      );
    }
  }
);

export const fetchAllPackages = createAsyncThunk<
  Package[],
  void,
  { state: RootState }
>("packages/fetchAllAdmin", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch packages"
    );
  }
});

export const updatePackage = createAsyncThunk<
  Package,
  Package,
  { state: RootState }
>(
  "packages/updateAdmin",
  async (packageData, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/${packageData._id}`,
        packageData,
        config
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update package"
      );
    }
  }
);

export const deletePackage = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("packages/deleteAdmin", async (packageId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${packageId}`, config);
    return packageId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete package"
    );
  }
});


const packageSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const listPending = (state: PackageState) => {
      state.status = "loading";
      state.error = null;
    };
    const listRejected = (state: PackageState, action: AnyAction) => {
      state.status = "failed";
      state.error = action.payload;
    };
    const actionPending = (state: PackageState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (state: PackageState, action: AnyAction) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    builder
      .addCase(fetchAllPackages.pending, listPending)
      .addCase(
        fetchAllPackages.fulfilled,
        (state, action: PayloadAction<Package[]>) => {
          state.status = "succeeded";
          state.packages = action.payload;
        }
      )
      .addCase(fetchAllPackages.rejected, listRejected);

    builder
      .addCase(createPackage.pending, actionPending)
      .addCase(
        createPackage.fulfilled,
        (state, action: PayloadAction<Package>) => {
          state.actionStatus = "succeeded";
          state.packages.push(action.payload); 
        }
      )
      .addCase(createPackage.rejected, actionRejected);

    builder
      .addCase(updatePackage.pending, actionPending)
      .addCase(
        updatePackage.fulfilled,
        (state, action: PayloadAction<Package>) => {
          state.actionStatus = "succeeded";
          state.packages = state.packages.map((pkg) =>
            pkg._id === action.payload._id ? action.payload : pkg
          );
        }
      )
      .addCase(updatePackage.rejected, actionRejected);

    builder
      .addCase(deletePackage.pending, actionPending)
      .addCase(
        deletePackage.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.packages = state.packages.filter(
            (pkg) => pkg._id !== action.payload
          );
        }
      )
      .addCase(deletePackage.rejected, actionRejected);
  },
});

export const { resetActionStatus } = packageSlice.actions;
export default packageSlice.reducer;
