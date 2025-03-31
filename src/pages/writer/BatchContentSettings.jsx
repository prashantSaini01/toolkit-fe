import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateContent, resetGeneration } from "../../redux/contentSlice";
import { toast } from "react-toastify";
import ContentSettings from "./ContentSettings";
import BrandManagement from "./BrandManagement";

function BatchContentSettings() {
  const dispatch = useDispatch();
  const {
    error,
    isGenerating,
    isServerReady,
    stopAfter,
    includeImage,
    activeBrand,
  } = useSelector((state) => state.content);
  const [topics, setTopics] = useState([""]);
  const [batchName, setBatchName] = useState("");

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const addTopicField = () => {
    setTopics([...topics, ""]);
  };

  const removeTopicField = (index) => {
    if (topics.length <= 1) return;
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!isServerReady) {
      toast.error("Server is still waking up, please wait...");
      return;
    }

    const validTopics = topics.filter((topic) => topic.trim());
    if (validTopics.length === 0) {
      toast.error("Please enter at least one valid topic");
      return;
    }

    dispatch(resetGeneration());

    const payload = {
      topics: validTopics,
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
      ...(batchName.trim() && { batch_name: batchName.trim() }),
    };

    try {
      await dispatch(generateContent(payload)).unwrap();
      toast.success(`Generated ${validTopics.length} posts successfully!`);
    } catch (err) {
      toast.error(`Batch generation failed: ${err}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Batch Content Settings
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batch Name (Optional)
          </label>
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="e.g., Week 1 Content"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating || !isServerReady}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topics
          </label>
          {topics.map((topic, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => handleTopicChange(index, e.target.value)}
                placeholder={`Topic ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isGenerating || !isServerReady}
              />
              {topics.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTopicField(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  disabled={isGenerating || !isServerReady}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTopicField}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            disabled={isGenerating || !isServerReady}
          >
            Add Topic
          </button>
        </div>

        <ContentSettings />
        <BrandManagement />

        <button
          type="submit"
          onClick={handleGenerate}
          className={`relative w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transition-all duration-300 flex items-center justify-center overflow-hidden ${
            isGenerating || !isServerReady
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:bg-indigo-800"
          }`}
          disabled={isGenerating || !isServerReady}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
              Generating {topics.filter((t) => t.trim()).length} Posts...
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
                Server Waking Up...
              </span>
            </>
          ) : (
            `Start Batch Creation (${
              topics.filter((t) => t.trim()).length
            } Posts)`
          )}
        </button>
      </div>
    </div>
  );
}

export default BatchContentSettings;
