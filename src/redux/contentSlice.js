import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const WRITER_URL = import.meta.env.VITE_WRITER_URL;

const token = localStorage.getItem("token");

// Utility function to retry wakeUpServer
const retryWakeUpServer = async (
  dispatch,
  rejectWithValue,
  attempts = 3,
  delay = 1000
) => {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await axios.get(`${WRITER_URL}`, { timeout: 5000 });
      if (response.status === 200) {
        return true;
      }
    } catch (err) {
      console.warn(`Server wakeup attempt ${i + 1} failed:`, err.message);
      if (i === attempts - 1) {
        return rejectWithValue("Server wakeup failed after retries.");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Async Thunks with server readiness check
export const fetchBrands = createAsyncThunk(
  "content/fetchBrands",
  async (_, { getState, dispatch, rejectWithValue }) => {
    if (!getState().content.isServerReady) {
      const isReady = await retryWakeUpServer(dispatch, rejectWithValue);
      if (!isReady) {
        return rejectWithValue("Server not ready.");
      }
      dispatch(serverReady()); // Update state if server becomes ready during this request
    }
    try {
      const response = await axios.get(`${WRITER_URL}/get_brands`, {
        headers: { "x-access-token": token },
      });
      return response.data.brands.map((b) => ({
        id: b.name + Date.now().toString(),
        name: b.name,
        tone: b.tone,
        logo: b.logo_base64 ? `data:image/jpeg;base64,${b.logo_base64}` : null,
        urls: b.urls,
      }));
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchHistory = createAsyncThunk(
  "content/fetchHistory",
  async (_, { getState, dispatch, rejectWithValue }) => {
    if (!getState().content.isServerReady) {
      const isReady = await retryWakeUpServer(dispatch, rejectWithValue);
      if (!isReady) {
        return rejectWithValue("Server not ready.");
      }
      dispatch(serverReady());
    }
    try {
      const response = await axios.get(`${WRITER_URL}/get_history`, {
        headers: { "x-access-token": token },
      });
      return response.data.history;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const generateContent = createAsyncThunk(
  "content/generateContent",
  async (payload, { getState, dispatch, rejectWithValue }) => {
    if (!getState().content.isServerReady) {
      const isReady = await retryWakeUpServer(dispatch, rejectWithValue);
      if (!isReady) {
        return rejectWithValue("Server not ready.");
      }
      dispatch(serverReady());
    }
    try {
      const endpoint =
        Array.isArray(payload.topics) && payload.topics.length > 1
          ? `${WRITER_URL}/generate_content`
          : `${WRITER_URL}/generate_content`;

      const response = await axios.post(endpoint, payload, {
        headers: { "x-access-token": token },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
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
    messages: [],
    finalContent: { text: "", image: null, image_error: null },
    batchResults: [], // New field for batch processing results
    error: null,
    isGenerating: false,
    isServerReady: false,
    topic: "",
    topics: [], // New field for multiple topics
    stopAfter: "",
    includeImage: true,
    brands: [],
    activeBrand: null,
    products: [],
    history: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    batchStatus: "idle", // New field for batch processing status
  },
  reducers: {
    setTopic: (state, action) => {
      state.topic = action.payload;
    },
    setTopics: (state, action) => {
      // New reducer for multiple topics
      state.topics = action.payload;
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
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addBrand: (state, action) => {
      state.brands.push(action.payload);
      state.activeBrand = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetGeneration: (state) => {
      state.messages = [];
      state.finalContent = { text: "", image: null, image_error: null };
      state.batchResults = [];
      state.isGenerating = false;
    },
    serverReady: (state) => {
      state.isServerReady = true;
    },
    clearBatchResults: (state) => {
      // New reducer to clear batch results
      state.batchResults = [];
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
      .addCase(generateContent.pending, (state, action) => {
        const isBatch =
          Array.isArray(action.meta.arg.topics) &&
          action.meta.arg.topics.length > 1;

        if (isBatch) {
          state.batchStatus = "loading";
        } else {
          state.status = "loading";
        }

        state.isGenerating = true;
        state.messages = [];
        state.finalContent = { text: "", image: null, image_error: null };
        state.batchResults = [];
        state.error = null;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.isGenerating = false;

        const isBatch =
          Array.isArray(action.meta.arg.topics) &&
          action.meta.arg.topics.length > 1;

        if (isBatch) {
          state.batchStatus = "succeeded";
          state.batchResults = action.payload.results || [];
          // Store the last generated content for compatibility
          if (action.payload.results?.length > 0) {
            const lastResult =
              action.payload.results[action.payload.results.length - 1];
            state.finalContent = {
              text: lastResult.final_content?.text || "",
              image: lastResult.final_content?.image || null,
              image_error: lastResult.final_content?.image_error || null,
            };
          }
        } else {
          state.status = "succeeded";
          state.messages = action.payload.results || [];
          state.finalContent = action.payload.final_content || {
            text: "",
            image: null,
            image_error: null,
          };
        }
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.isGenerating = false;

        const isBatch =
          Array.isArray(action.meta.arg.topics) &&
          action.meta.arg.topics.length > 1;

        if (isBatch) {
          state.batchStatus = "failed";
        } else {
          state.status = "failed";
        }

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
  setTopics,
  setStopAfter,
  setIncludeImage,
  setActiveBrand,
  setProducts,
  addBrand,
  clearError,
  resetGeneration,
  serverReady,
  clearBatchResults,
} = contentSlice.actions;

export default contentSlice.reducer;
