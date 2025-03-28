import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const WRITER_URL = import.meta.env.VITE_WRITER_URL;

const token = localStorage.getItem("token");

// Async Thunks
export const fetchBrands = createAsyncThunk(
  "content/fetchBrands",
  async (_, { rejectWithValue }) => {
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
  async (_, { rejectWithValue }) => {
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
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${WRITER_URL}/generate_content`,
        payload,
        {
          headers: { "x-access-token": token },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const wakeUpServer = createAsyncThunk(
  "content/wakeUpServer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${WRITER_URL}`, { timeout: 5000 });
      return response.status === 200;
    } catch (err) {
      console.warn("Server not ready yet:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState: {
    messages: [],
    finalContent: { text: "", image: null, image_error: null },
    error: null,
    isGenerating: false,
    isServerReady: false,
    topic: "",
    stopAfter: "",
    includeImage: true,
    brands: [],
    activeBrand: null,
    products: [],
    history: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
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
      state.isGenerating = false;
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
        state.status = "loading";
        state.messages = [];
        state.finalContent = { text: "", image: null, image_error: null };
        state.error = null;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.status = "succeeded";
        state.messages = action.payload.results || [];
        state.finalContent = action.payload.final_content || {
          text: "",
          image: null,
          image_error: null,
        };
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.isGenerating = false;
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(wakeUpServer.fulfilled, (state, action) => {
        state.isServerReady = action.payload;
      });
  },
});

export const {
  setTopic,
  setStopAfter,
  setIncludeImage,
  setActiveBrand,
  setProducts,
  addBrand,
  clearError,
  resetGeneration,
} = contentSlice.actions;

export default contentSlice.reducer;
