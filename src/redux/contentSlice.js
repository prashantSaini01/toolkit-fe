import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const WRITER_URL = import.meta.env.VITE_WRITER_URL;

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
      const response = await axios.get(`${WRITER_URL}/get_brands`, {
        headers: { "x-access-token": token },
      });
      return response.data.data.map((b) => ({
        id: b.brand + Date.now().toString(),
        name: b.brand,
        tone: b.content.text.split("Tone: ")[1]?.split("\n")[0] || "Neutral",
        logo: b.content.image_base64
          ? `data:image/jpeg;base64,${b.content.image_base64}`
          : null,
        urls: b.content.text.split("URLs: ")[1]?.split(", ") || [],
      }));
    } catch (err) {
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
      const response = await axios.get(`${WRITER_URL}/get_history`, {
        headers: { "x-access-token": token },
      });
      return response.data.data;
    } catch (err) {
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
        `${WRITER_URL}/generate_content`,
        payload,
        { headers: { "x-access-token": token } }
      );
      return response.data;
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
    data: [], // Unified storage for all generated content
    error: null,
    isGenerating: false,
    isServerReady: false,
    topic: "",
    stopAfter: "",
    includeImage: true,
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
        state.data = action.payload.data;
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
