import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../../components/config";
const WRITER_URL = `${API_URL}`;
 
const token = localStorage.getItem("token");
 
const retryWakeUpServer = async (
  dispatch,
  rejectWithValue,
  attempts = 3,
  delay = 1000
) => {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await axios.get(`${WRITER_URL}`, { timeout: 5000 });
      if (response.status === 200) return true;
    } catch (err) {
      console.warn(`Server wakeup attempt ${i + 1} failed:`, err.message);
      if (i === attempts - 1)
        return rejectWithValue("Server wakeup failed after retries.");
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
};
 
export const fetchBrands = createAsyncThunk(
  "content/fetchBrands",
  async (_, { getState, dispatch, rejectWithValue }) => {
    if (!getState().content.isServerReady) {
      const isReady = await retryWakeUpServer(dispatch, rejectWithValue);
      if (!isReady) return rejectWithValue("Server not ready.");
      dispatch(serverReady());
    }
    try {
      const response = await axios.get(
        `${WRITER_URL}/social_spark/get_brands`,
        {
          headers: { "x-access-token": token },
        }
      );
      console.log("Brands Response:", response);
      console.log(
        "Brands Response 2:",
        response.data?.brands || response.data?.data || []
      );
 
      // Map the response.brands array to the expected brand format
      return (response.data?.brands || response.data?.data || []).map((b) => ({
        id: (b.brand || "unknown") + Date.now().toString(),
        name: b.brand || "Unknown Brand",
        tone: b.content.text || "Neutral",
        logo: b.content.image_base64
          ? `data:image/jpeg;base64,${b.content.image_base64}`
          : null,
        urls: b.urls || [],
      }));
    } catch (err) {
      console.error("Error fetching brands:", err);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
 
export const fetchHistory = createAsyncThunk(
  "content/fetchHistory",
  async (_, { getState, dispatch, rejectWithValue }) => {
    if (!getState().content.isServerReady) {
      const isReady = await retryWakeUpServer(dispatch, rejectWithValue);
      if (!isReady) return rejectWithValue("Server not ready.");
      dispatch(serverReady());
    }
    try {
      const response = await axios.get(
        `${WRITER_URL}/social_spark/get_history`,
        {
          headers: { "x-access-token": token },
        }
      );
      console.log("History Response:", response.data.data);
      console.log(
        "History Response 2:",
        response.data?.history || response.data?.data || []
      );
      return response.data?.history || response.data?.data || [];
    } catch (err) {
      console.error("Error fetching history:", err);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
 
export const generateContent = createAsyncThunk(
  "content/generateContent",
  async (payload, { getState, dispatch, rejectWithValue }) => {
    if (!getState().content.isServerReady) {
      const isReady = await retryWakeUpServer(dispatch, rejectWithValue);
      if (!isReady) return rejectWithValue("Server not ready.");
      dispatch(serverReady());
    }
    try {
      const response = await axios.post(
        `${WRITER_URL}/social_spark/generate_content`,
        payload,
        { headers: { "x-access-token": token } }
      );
      console.log("Generated Data", response);
      return response.data?.results || response.data?.data || []; // Return the results array instead of the entire response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
 
export const wakeUpServer = createAsyncThunk(
  "content/wakeUpServer",
  async (_, { dispatch, rejectWithValue }) => {
    const isReady = await retryWakeUpServer(dispatch, rejectWithValue);
    if (isReady) {
      dispatch(serverReady());
      return true;
    }
    return false;
  }
);
 
const contentSlice = createSlice({
  name: "content",
  initialState: {
    data: [],
    error: null,
    isGenerating: false,
    isServerReady: false,
    topic: "",
    stopAfter: "generate",
    includeImage: false,
    brands: [],
    activeBrand: null,
    history: [],
    status: "idle",
  },
  reducers: {
    setTopic: (state, action) => {
      state.topic = action.payload;
    },
    setStopAfter: (state, action) => {
      state.stopAfter = action.payload;
    },
    setIncludeImage: (state, action) => {
      state.includeImage = action.payload;
    },
    setActiveBrand: (state, action) => {
      state.activeBrand = action.payload;
    },
    addBrand: (state, action) => {
      state.brands.push(action.payload);
      state.activeBrand = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetGeneration: (state) => {
      state.data = [];
      state.isGenerating = false;
      state.error = null;
    },
    serverReady: (state) => {
      state.isServerReady = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(generateContent.pending, (state) => {
        state.isGenerating = true;
        state.data = [];
        state.error = null;
        state.status = "loading";
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.isGenerating = false;
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(wakeUpServer.fulfilled, (state, action) => {
        state.isServerReady = action.payload;
      })
      .addCase(wakeUpServer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
 
export const {
  setTopic,
  setStopAfter,
  setIncludeImage,
  setActiveBrand,
  addBrand,
  clearError,
  resetGeneration,
  serverReady,
} = contentSlice.actions;
export default contentSlice.reducer;