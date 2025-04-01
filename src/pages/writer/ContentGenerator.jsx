/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchBrands,
  fetchHistory,
  generateContent,
  wakeUpServer,
  resetGeneration,
  clearError,
} from "../../redux/contentSlice";
import ContentSettings from "./ContentSettings";
import BrandManagement from "./BrandManagement";
import CreationProgress from "./CreationProgress";
import BatchContentSettings from "./BatchContentSettings";
import BatchResults from "./BatchResults";
import HistoryPanel from "./HistoryPanel";

const WAKE_UP_MESSAGES = [
  "Summoning the AI muse...",
  "Warming up the creativity engine...",
  "Charging the inspiration circuits...",
  "Awakening the content genius...",
  "Preparing your creative spark...",
];

function ContentGenerator() {
  const dispatch = useDispatch();
  const {
    error,
    isGenerating,
    isServerReady,
    topic,
    stopAfter,
    includeImage,
    activeBrand,
  } = useSelector((state) => state.content);
  const [wakeUpMessage, setWakeUpMessage] = useState(WAKE_UP_MESSAGES[0]);
  const [batchMode, setBatchMode] = useState(false);

  useEffect(() => {
    let intervalId, messageIntervalId;
    const checkServer = () => {
      dispatch(wakeUpServer()).then((result) => {
        if (result.payload) {
          dispatch(fetchBrands());
          dispatch(fetchHistory());
          clearInterval(intervalId);
          clearInterval(messageIntervalId);
        }
      });
    };
    checkServer();
    intervalId = setInterval(checkServer, 3000);
    messageIntervalId = setInterval(() => {
      setWakeUpMessage(
        WAKE_UP_MESSAGES[Math.floor(Math.random() * WAKE_UP_MESSAGES.length)]
      );
    }, 5000);
    return () => {
      clearInterval(intervalId);
      clearInterval(messageIntervalId);
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error, { onClose: () => dispatch(clearError()) });
  }, [error, dispatch]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!isServerReady) {
      toast.error("Server is still waking up, please wait...");
      return;
    }
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    dispatch(resetGeneration());
    const payload = {
      topics: [topic.trim()], // Single topic as array for consistency
      stop_after: stopAfter.trim() || undefined,
      include_image: includeImage,
      ...(activeBrand && {
        brand_info: {
          name: activeBrand.name,
          tone: activeBrand.tone,
          logo_base64: activeBrand.logo?.split(",")[1],
          urls: activeBrand.urls,
        },
      }),
    };
    dispatch(generateContent(payload)).then(() => dispatch(fetchHistory()));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="sticky top-0 z-10 bg-white shadow-md rounded-b-lg p-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            AI Content Generator
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setBatchMode(!batchMode)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                batchMode
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {batchMode ? "Switch to Single Mode" : "Switch to Batch Mode"}
            </button>
            <button
              onClick={() => dispatch(resetGeneration())}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-8">
          {batchMode ? (
            <BatchContentSettings />
          ) : (
            <form onSubmit={handleGenerate} className="space-y-6">
              <ContentSettings />
              <BrandManagement />
              <button
                type="submit"
                className={`relative w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transition-all duration-300 flex items-center justify-center overflow-hidden ${
                  isGenerating || !isServerReady
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:bg-indigo-800"
                }`}
                disabled={isGenerating || !isServerReady}
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                        fill="none"
                      />
                    </svg>
                    Generating...
                  </>
                ) : !isServerReady ? (
                  <>
                    <div className="absolute inset-0 bg-blue-500 animate-pulse-bar" />
                    <span className="relative z-10 flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {wakeUpMessage}
                    </span>
                  </>
                ) : (
                  "Start Content Creation"
                )}
              </button>
            </form>
          )}
          <CreationProgress />
          <BatchResults /> {/* Unified rendering */}
        </div>
        <div className="lg:col-span-1">
          <HistoryPanel />
        </div>
      </div>
      <style jsx>{`
        .animate-pulse-bar {
          animation: pulseBar 2s infinite ease-in-out;
          opacity: 0.3;
        }
        @keyframes pulseBar {
          0% {
            transform: scaleX(0);
            transform-origin: left;
          }
          50% {
            transform: scaleX(1);
          }
          100% {
            transform: scaleX(0);
            transform-origin: right;
          }
        }
      `}</style>
    </div>
  );
}

export default ContentGenerator;
