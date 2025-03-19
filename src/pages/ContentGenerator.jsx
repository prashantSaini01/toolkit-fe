import { useState } from "react";
import axios from "axios";

function ContentGenerator() {
  const [messages, setMessages] = useState([]);
  const [finalContent, setFinalContent] = useState("");
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState("");
  const [stopAfter, setStopAfter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/generate_content";

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setMessages([]);
    setFinalContent("");
    setError(null);
    setIsGenerating(true);

    try {
      const response = await axios.post(
        API_URL,
        {
          topic: topic.trim(),
          stop_after: stopAfter.trim() || undefined,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data.results) {
        setMessages(response.data.results);
        setFinalContent(response.data.final_content || "");
      } else {
        setError("No valid data returned.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while generating content."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          AI Content Generator
        </h1>

        {/* Form Section */}
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Justice For Survivors"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isGenerating}
            />
          </div>
          <div>
            <label
              htmlFor="stopAfter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stop After (Optional)
            </label>
            <input
              id="stopAfter"
              type="text"
              value={stopAfter}
              onChange={(e) => setStopAfter(e.target.value)}
              placeholder="e.g., generate"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isGenerating}
            />
            <p className="mt-1 text-xs text-gray-500 italic">
              Enter a node name (e.g., “generate”) to stop early.
            </p>
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transform transition-all duration-300 ${
              isGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
            }`}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
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
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Content"
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-fade-in">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Progress Section */}
        {messages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">Progress</span>
              <span className="inline-block h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
            </h2>
            <div className="space-y-4 max-h-72 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <p className="text-sm font-medium text-gray-800">
                    Step: <span className="text-blue-600">{msg.node_transition}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1 break-words leading-relaxed">
                    {msg.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Thread: {msg.thread_id} | Revision: {msg.revision} | Count: {msg.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Content Section */}
        {finalContent && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Final Content</h2>
            <div className="p-6 bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-lg shadow-md">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                {finalContent}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default ContentGenerator;