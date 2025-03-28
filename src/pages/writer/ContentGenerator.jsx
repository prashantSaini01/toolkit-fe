/* eslint-disable react/no-unknown-property */
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ContentSettings from "./ContentSettings";
import BrandManagement from "./BrandManagement";
import ProductUpload from "./ProductUpload";
import CreationProgress from "./CreationProgress";
import GeneratedContent from "./GeneratedContent";
import HistoryPanel from "./HistoryPanel";

const API_URL = import.meta.env.VITE_WRITER_URL;

// Define wakeUpMessages outside the component to prevent re-creation
const WAKE_UP_MESSAGES = [
  "Summoning the AI muse...",
  "Warming up the creativity engine...",
  "Charging the inspiration circuits...",
  "Awakening the content genius...",
  "Preparing your creative spark...",
];

function ContentGenerator() {
  const [messages, setMessages] = useState([]);
  const [finalContent, setFinalContent] = useState({
    text: "",
    image: null,
    image_error: null,
  });
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isServerReady, setIsServerReady] = useState(false);
  const [wakeUpMessage, setWakeUpMessage] = useState(WAKE_UP_MESSAGES[0]);
  const [topic, setTopic] = useState("");
  const [stopAfter, setStopAfter] = useState("");
  const [includeImage, setIncludeImage] = useState(true);
  const [brands, setBrands] = useState([]);
  const [activeBrand, setActiveBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  const fetchBrands = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/get_brands`, {
        headers: { "x-access-token": token },
      });
      const formattedBrands = response.data.brands.map((b) => ({
        id: b.name + Date.now().toString(),
        name: b.name,
        tone: b.tone,
        logo: b.logo_base64 ? `data:image/jpeg;base64,${b.logo_base64}` : null,
        urls: b.urls,
      }));
      setBrands(formattedBrands);
    } catch (err) {
      setError(
        "Failed to fetch brands: " +
          (err.response?.data?.message || err.message)
      );
    }
  }, [token]);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/get_history`, {
        headers: { "x-access-token": token },
      });
      setHistory(response.data.history);
    } catch (err) {
      setError(
        "Failed to fetch history: " +
          (err.response?.data?.message || err.message)
      );
    }
  }, [token]);

  useEffect(() => {
    let intervalId;
    let messageIntervalId;

    const wakeUpInstance = async () => {
      try {
        const response = await axios.get(`${API_URL}`, { timeout: 5000 });
        if (response.status === 200) {
          setIsServerReady(true);
          await Promise.all([fetchBrands(), fetchHistory()]);
          clearInterval(intervalId);
          clearInterval(messageIntervalId);
        }
      } catch (err) {
        console.warn("Server not ready yet:", err.message);
      }
    };

    wakeUpInstance();
    intervalId = setInterval(wakeUpInstance, 3000);

    // Rotate wake-up messages every 5 seconds
    messageIntervalId = setInterval(() => {
      setWakeUpMessage(
        WAKE_UP_MESSAGES[Math.floor(Math.random() * WAKE_UP_MESSAGES.length)]
      );
    }, 5000);

    return () => {
      clearInterval(intervalId);
      clearInterval(messageIntervalId);
    };
  }, [fetchBrands, fetchHistory]); // Stable dependencies only

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!isServerReady) {
      setError("Server is still waking up, please wait...");
      return;
    }
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setMessages([]);
    setFinalContent({ text: "", image: null, image_error: null });
    setError(null);
    setIsGenerating(true);

    try {
      const payload = {
        topic: topic.trim(),
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
        ...(products.length > 0 && {
          product_data: { source: "excel", data: products },
        }),
      };
      const response = await axios.post(
        `${API_URL}/generate_content`,
        payload,
        {
          headers: { "x-access-token": token },
        }
      );

      setMessages(response.data.results || []);
      setFinalContent(
        response.data.final_content || {
          text: "",
          image: null,
          image_error: null,
        }
      );
      await fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex p-6">
      <div className="flex-1 max-w-3xl bg-white rounded-xl shadow-2xl p-8 mr-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          AI Content Generator
        </h1>
        <form onSubmit={handleGenerate} className="space-y-6">
          <ContentSettings
            topic={topic}
            setTopic={setTopic}
            stopAfter={stopAfter}
            setStopAfter={setStopAfter}
            includeImage={includeImage}
            setIncludeImage={setIncludeImage}
            isGenerating={isGenerating}
            isServerReady={isServerReady}
          />
          <BrandManagement
            brands={brands}
            setBrands={setBrands}
            activeBrand={activeBrand}
            setActiveBrand={setActiveBrand}
            isGenerating={isGenerating}
            isServerReady={isServerReady}
          />
          <ProductUpload
            products={products}
            setProducts={setProducts}
            activeBrand={activeBrand}
            isGenerating={isGenerating}
            isServerReady={isServerReady}
          />
          <button
            type="submit"
            className={`relative w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transform transition-all duration-300 flex items-center justify-center overflow-hidden ${
              isGenerating || !isServerReady
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
            }`}
            disabled={isGenerating || !isServerReady}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-r-2 border-white mr-2"></div>
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
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-fade-in">
            <p className="font-medium">{error}</p>
          </div>
        )}
        <CreationProgress messages={messages} />
        <GeneratedContent
          finalContent={finalContent}
          activeBrand={activeBrand}
        />
      </div>
      <HistoryPanel
        history={history}
        setTopic={setTopic}
        setActiveBrand={setActiveBrand}
        brands={brands}
      />
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
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
