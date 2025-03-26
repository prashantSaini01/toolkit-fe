// export default ContentGenerator;
/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ContentSettings from "./ContentSettings";
import BrandManagement from "./BrandManagement";
import ProductUpload from "./ProductUpload";
import CreationProgress from "./CreationProgress";
import GeneratedContent from "./GeneratedContent";
import HistoryPanel from "./HistoryPanel";

// const BASE_URL = import.meta.env.VITE_WRITER_URL;

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
  const [topic, setTopic] = useState("");
  const [stopAfter, setStopAfter] = useState("");
  const [includeImage, setIncludeImage] = useState(true);
  const [brands, setBrands] = useState([]); // Multiple brands
  const [activeBrand, setActiveBrand] = useState(null); // null means "No Brand"
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");

  // Memoize fetch functions to prevent redefinition
  const fetchBrands = useCallback(async () => {
    try {
      const response = await axios.get(`/get_brands`, {
        headers: { "x-access-token": token },
      });
      const formattedBrands = response.data.brands.map((b) => ({
        id: b.name + Date.now().toString(), // Unique ID for FE
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
      const response = await axios.get(`/get_history`, {
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

    const wakeUpInstance = async () => {
      try {
        const response = await axios.get(``, { timeout: 5000 });
        if (response.status === 200) {
          setIsServerReady(true);
          await Promise.all([fetchBrands(), fetchHistory()]); // Fetch data once server is ready
          clearInterval(intervalId);
        }
      } catch (err) {
        console.warn("Server not ready yet:", err.message);
      }
    };

    wakeUpInstance();
    intervalId = setInterval(wakeUpInstance, 3000);

    return () => clearInterval(intervalId);
  }, [fetchBrands, fetchHistory]); // Dependencies are stable memoized functions
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!isServerReady) {
      setError("Server is waking up, please wait...");
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
            logo_base64: activeBrand.logo?.split(",")[1], // Strip data URI prefix
            urls: activeBrand.urls,
          },
        }),
        ...(products.length > 0 && {
          product_data: { source: "excel", data: products },
        }),
      };
      const response = await axios.post(`/generate_content`, payload, {
        headers: { "x-access-token": token },
      });

      if (response.data.results) {
        setMessages(response.data.results);
        const newContent = response.data.final_content || {
          text: "",
          image: null,
          image_error: null,
        };
        setFinalContent(newContent);

        // Update history
        await fetchHistory();
      } else {
        setError("No valid data returned.");
      }
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
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transform transition-all duration-300 ${
              isGenerating || !isServerReady
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
            }`}
            disabled={isGenerating || !isServerReady}
          >
            {isServerReady && isGenerating
              ? "Generating..."
              : "Start Content Creation"}
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
      `}</style>
    </div>
  );
}

export default ContentGenerator;
