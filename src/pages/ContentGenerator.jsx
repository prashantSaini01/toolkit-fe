import { useState } from "react";
import axios from "axios";
import API_URL from "./config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

function ContentGenerator() {
  const [messages, setMessages] = useState([]);
  const [finalContent, setFinalContent] = useState("");
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState("");
  const [stopAfter, setStopAfter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("token");

  const nodeOptions = [
    { value: "", label: "Run Full Process (All Steps)" },
    { value: "planner", label: "Planner: Create Post Outline" },
    { value: "research_plan", label: "Research Plan: Gather Key Info" },
    { value: "generate", label: "Generate: Draft Your Post" },
    { value: "reflect", label: "Reflect: Review & Suggest Edits" },
    {
      value: "research_critique",
      label: "Research Critique: Add Final Details",
    },
  ];

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
    setCopied(false);

    try {
      const response = await axios.post(
        `${API_URL}/generate_content`,
        { topic: topic.trim(), stop_after: stopAfter.trim() || undefined },
        { headers: { "x-access-token": token } }
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

  const handleCopyAndRedirect = (platform) => {
    if (!finalContent) return;

    let contentToCopy = finalContent;
    switch (platform) {
      case "twitter":
        contentToCopy = finalContent.slice(0, 280); // Twitter: 280 chars
        break;
      case "linkedin":
        contentToCopy = finalContent.slice(0, 3000); // LinkedIn: ~3000 chars
        break;
      case "instagram":
        contentToCopy = finalContent.slice(0, 2200); // Instagram: ~2200 chars
        break;
      default:
        break;
    }

    navigator.clipboard
      .writeText(contentToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);

        switch (platform) {
          case "twitter":
            window.open("https://twitter.com/intent/tweet", "_blank");
            break;
          case "linkedin":
            window.open(
              "https://www.linkedin.com/feed/?shareActive=true",
              "_blank"
            );
            break;
          case "instagram":
            window.open("https://www.instagram.com/", "_blank");
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        console.error("Clipboard error:", err);
        setError("Failed to copy content to clipboard.");
      });
  };

  const parseFinalContent = (content) => {
    const lines = content.split("\n").filter((line) => line.trim());
    let mainContent = [];
    let caption = "";
    let hashtags = "";
    let visual = "";

    lines.forEach((line) => {
      if (line.startsWith("Caption:"))
        caption = line.replace("Caption:", "").trim();
      else if (line.startsWith("Hashtags:"))
        hashtags = line.replace("Hashtags:", "").trim();
      else if (line.startsWith("Visual:"))
        visual = line.replace("Visual:", "").trim();
      else mainContent.push(line);
    });

    return { mainContent: mainContent.join("\n"), caption, hashtags, visual };
  };

  const { mainContent, caption, hashtags, visual } = finalContent
    ? parseFinalContent(finalContent)
    : { mainContent: "", caption: "", hashtags: "", visual: "" };

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
              placeholder="e.g., Tesla's Latest Innovations"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isGenerating}
              aria-label="Enter topic for content generation"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label
              htmlFor="stopAfter"
              className="block text-sm font-semibold text-gray-800 mb-2 flex items-center"
            >
              <span className="mr-2">Control Your Workflow</span>
              <span className="text-xs text-blue-500 font-normal">
                (Optional)
              </span>
            </label>
            <select
              id="stopAfter"
              value={stopAfter}
              onChange={(e) => setStopAfter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isGenerating}
              aria-label="Select workflow stopping point"
            >
              {nodeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Choose where to pause the process. &quot;Run Full Process (All
              Steps)&quot; completes all steps from planning to final polish.
              Stop early to review intermediate results—like a draft post or
              research findings.
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
            aria-label={
              isGenerating ? "Generating content" : "Start content creation"
            }
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
              "Start Content Creation"
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-fade-in">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Creation Progress Section */}
        {messages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">Creation Progress</span>
              <span className="inline-block h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
            </h2>
            <div className="space-y-4 max-h-72 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <p className="text-sm font-medium text-gray-800">
                    Step:{" "}
                    <span className="text-blue-600">{msg.node_transition}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1 break-words leading-relaxed">
                    {msg.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Thread: {msg.thread_id} | Revision: {msg.revision} | Count:{" "}
                    {msg.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Generated Content Section */}
        {finalContent && (
          <div className="mt-8 relative">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Generated Content
            </h2>
            <div className="p-6 bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-lg shadow-md space-y-4">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                {mainContent}
              </div>
              {visual && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Visual: {visual}
                  </span>
                </div>
              )}
              {caption && (
                <div className="mt-2">
                  <span className="font-semibold text-gray-800">Caption:</span>{" "}
                  <span className="text-gray-600 italic">{caption}</span>
                </div>
              )}
              {hashtags && (
                <div className="mt-2">
                  <span className="font-semibold text-gray-800">Hashtags:</span>{" "}
                  <span className="text-blue-600">{hashtags}</span>
                </div>
              )}
            </div>

            {/* Improved Social Media Buttons */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleCopyAndRedirect("twitter")}
                className="group relative flex items-center px-4 py-2 bg-[#1DA1F2] text-white font-semibold rounded-full shadow-md hover:bg-[#1A91DA] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!finalContent}
                aria-label="Copy content and share to Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="mr-2" />
                Share to Twitter
                <span className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                  Copy & Share to Twitter
                </span>
              </button>
              <button
                onClick={() => handleCopyAndRedirect("linkedin")}
                className="group relative flex items-center px-4 py-2 bg-[#0A66C2] text-white font-semibold rounded-full shadow-md hover:bg-[#0A548B] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!finalContent}
                aria-label="Copy content and share to LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} className="mr-2" />
                Share to LinkedIn
                <span className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                  Copy & Share to LinkedIn
                </span>
              </button>
              <button
                onClick={() => handleCopyAndRedirect("instagram")}
                className="group relative flex items-center px-4 py-2 bg-gradient-to-r from-[#405DE6] via-[#C13584] to-[#F77737] text-white font-semibold rounded-full shadow-md hover:brightness-110 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!finalContent}
                aria-label="Copy content and share to Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="mr-2" />
                Share to Instagram
                <span className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                  Copy & Share to Instagram
                </span>
              </button>
            </div>

            {/* Copied Popup */}
            {copied && (
              <div className="absolute top-4 right-4 p-3 bg-green-500 text-white rounded-lg shadow-lg animate-fade-in-out flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Content copied successfully!
              </div>
            )}
          </div>
        )}
      </div>

      {/* eslint-disable react/no-unknown-property */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

export default ContentGenerator;
