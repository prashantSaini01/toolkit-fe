import { useEffect } from "react";
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
import ProductUpload from "./ProductUpload";
import CreationProgress from "./CreationProgress";
import GeneratedContent from "./GeneratedContent";
import HistoryPanel from "./HistoryPanel";

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
    products,
  } = useSelector((state) => state.content);

  useEffect(() => {
    let intervalId;
    const checkServer = () => {
      dispatch(wakeUpServer()).then((result) => {
        if (result.payload) {
          dispatch(fetchBrands());
          dispatch(fetchHistory());
          clearInterval(intervalId);
        }
      });
    };
    checkServer();
    intervalId = setInterval(checkServer, 3000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { onClose: () => dispatch(clearError()) });
    }
  }, [error, dispatch]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!isServerReady) {
      toast.error("Server is waking up, please wait...");
      return;
    }
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    dispatch(resetGeneration());
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
    dispatch(generateContent(payload)).then(() => dispatch(fetchHistory()));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="sticky top-0 z-10 bg-white shadow-md rounded-b-lg p-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            AI Content Generator
          </h1>
          <button
            onClick={() => dispatch(resetGeneration())}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <ContentSettings />
            <BrandManagement />
            <ProductUpload />
            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transition-all duration-300 flex items-center justify-center ${
                isGenerating || !isServerReady
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
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
              ) : (
                "Start Content Creation"
              )}
            </button>
          </form>
          <CreationProgress />
          <GeneratedContent />
        </div>
        <div className="lg:col-span-1">
          <HistoryPanel />
        </div>
      </div>
    </div>
  );
}

export default ContentGenerator;
