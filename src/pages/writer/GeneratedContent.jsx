import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";

function GeneratedContent({ finalContent, activeBrand }) {
  const [copied, setCopied] = useState(false);

  const parseFinalContent = (content) => {
    const lines = content.split("\n").filter((line) => line.trim());
    let mainContent = [];
    let caption = "",
      hashtags = "",
      visual = "";
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

  const { mainContent, caption, hashtags, visual } = finalContent.text
    ? parseFinalContent(finalContent.text)
    : { mainContent: "", caption: "", hashtags: "", visual: "" };

  const handleCopyAndRedirect = (platform) => {
    if (!finalContent.text) return;
    let contentToCopy = finalContent.text;
    switch (platform) {
      case "twitter":
        contentToCopy = contentToCopy.slice(0, 280);
        break;
      case "linkedin":
        contentToCopy = contentToCopy.slice(0, 3000);
        break;
      case "instagram":
        contentToCopy = contentToCopy.slice(0, 2200);
        break;
      default:
        break;
    }
    navigator.clipboard.writeText(contentToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      const urls = {
        twitter: "https://twitter.com/intent/tweet",
        linkedin: "https://www.linkedin.com/feed/?shareActive=true",
        instagram: "https://www.instagram.com/",
      };
      window.open(urls[platform], "_blank");
    });
  };

  return finalContent.text ? (
    <div className="mt-8 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Your Generated Content
      </h2>
      <div className="p-6 bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-lg shadow-md space-y-4">
        {activeBrand && (
          <div className="flex items-center">
            {activeBrand.logo && (
              <img
                src={activeBrand.logo}
                alt="Brand Logo"
                className="h-8 w-8 mr-2"
              />
            )}
            <span className="text-gray-600">Posted by {activeBrand.name}</span>
          </div>
        )}
        <div className="text-gray-700 whitespace-pre-wrap">{mainContent}</div>
        {finalContent.image && (
          <img
            src={finalContent.image}
            alt="Generated Visual"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        )}
        {finalContent.image_error && (
          <div className="text-red-600 text-sm">
            Image Error: {finalContent.image_error}
          </div>
        )}
        {visual && !finalContent.image && !finalContent.image_error && (
          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
        )}
        {caption && (
          <div>
            <span className="font-semibold text-gray-800">Caption:</span>{" "}
            <span className="text-gray-600 italic">{caption}</span>
          </div>
        )}
        {hashtags && (
          <div>
            <span className="font-semibold text-gray-800">Hashtags:</span>{" "}
            <span className="text-blue-600">{hashtags}</span>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => handleCopyAndRedirect("twitter")}
          className="group relative flex items-center px-4 py-2 bg-[#1DA1F2] text-white rounded-full shadow-md hover:bg-[#1A91DA] hover:scale-105 transition-all disabled:opacity-50"
          disabled={!finalContent.text}
        >
          <FontAwesomeIcon icon={faTwitter} className="mr-2" /> Share to Twitter
          <span className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
            Copy & Share
          </span>
        </button>
        <button
          onClick={() => handleCopyAndRedirect("linkedin")}
          className="group relative flex items-center px-4 py-2 bg-[#0A66C2] text-white rounded-full shadow-md hover:bg-[#0A548B] hover:scale-105 transition-all disabled:opacity-50"
          disabled={!finalContent.text}
        >
          <FontAwesomeIcon icon={faLinkedin} className="mr-2" /> Share to
          LinkedIn
          <span className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
            Copy & Share
          </span>
        </button>
        <button
          onClick={() => handleCopyAndRedirect("instagram")}
          className="group relative flex items-center px-4 py-2 bg-gradient-to-r from-[#405DE6] via-[#C13584] to-[#F77737] text-white rounded-full shadow-md hover:brightness-110 hover:scale-105 transition-all disabled:opacity-50"
          disabled={!finalContent.text}
        >
          <FontAwesomeIcon icon={faInstagram} className="mr-2" /> Share to
          Instagram
          <span className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
            Copy & Share
          </span>
        </button>
      </div>
      {copied && (
        <div className="absolute top-4 right-4 p-3 bg-green-500 text-white rounded-lg shadow-lg animate-fade-in-out flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Content copied!
        </div>
      )}
      {/* eslint-disable react/no-unknown-property */}
      <style jsx>{`
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
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
      `}</style>
    </div>
  ) : null;
}

export default GeneratedContent;
