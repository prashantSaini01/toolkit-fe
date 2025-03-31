/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import BatchResults from "./BatchResults";

function GeneratedContent() {
  const { finalContent, activeBrand, batchResults } = useSelector(
    (state) => state.content
  );
  const [copied, setCopied] = useState(false);

  const parseFinalContent = (content) => {
    if (!content)
      return { mainContent: "", caption: "", hashtags: "", visual: "" };

    const lines = content.split("\n").filter((line) => line.trim());
    let mainContent = [],
      caption = "",
      hashtags = "",
      visual = "";

    lines.forEach((line) => {
      if (line.startsWith("Caption:")) {
        caption = line.replace("Caption:", "").trim();
      } else if (line.startsWith("Hashtags:")) {
        hashtags = line.replace("Hashtags:", "").trim();
      } else if (line.startsWith("Visual:")) {
        visual = line.replace("Visual:", "").trim();
      } else {
        mainContent.push(line);
      }
    });

    return {
      mainContent: mainContent.join("\n"),
      caption,
      hashtags,
      visual,
    };
  };

  const handleCopyContent = (content) => {
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      toast.success("Content copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleCopyAndRedirect = (platform, content = finalContent.text) => {
    if (!content) return;

    let contentToCopy = content;
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

    handleCopyContent(contentToCopy);

    const urls = {
      twitter: "https://twitter.com/intent/tweet",
      linkedin: "https://www.linkedin.com/feed/?shareActive=true",
      instagram: "https://www.instagram.com/",
    };
    window.open(urls[platform], "_blank");
  };

  const renderContentCard = (contentData, isBatch = false) => {
    const { text, image, image_error } = contentData;
    const { mainContent, caption, hashtags, visual } = parseFinalContent(text);

    return (
      <div className="mt-8">
        {!isBatch && (
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Generated Content
          </h2>
        )}

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
          {activeBrand && (
            <div className="flex items-center">
              {activeBrand.logo && (
                <img
                  src={activeBrand.logo}
                  alt="Brand Logo"
                  className="h-8 w-8 mr-2"
                />
              )}
              <span className="text-gray-600">
                Posted by {activeBrand.name}
              </span>
            </div>
          )}

          <div className="text-gray-700 whitespace-pre-wrap">{mainContent}</div>

          {image && (
            <img
              src={image}
              alt="Generated Visual"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          )}

          {image_error && (
            <div className="text-red-600 text-sm">
              Image Error: {image_error}
            </div>
          )}

          {visual && !image && !image_error && (
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

          {!isBatch && (
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleCopyAndRedirect("twitter")}
                className="group flex items-center px-4 py-2 bg-[#1DA1F2] text-white rounded-full shadow-md hover:bg-[#1A91DA] hover:scale-105 transition-all disabled:opacity-50"
                disabled={!text}
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  className="mr-2 group-hover:animate-bounce"
                />
                Share to Twitter
              </button>
              <button
                onClick={() => handleCopyAndRedirect("linkedin")}
                className="group flex items-center px-4 py-2 bg-[#0A66C2] text-white rounded-full shadow-md hover:bg-[#0A548B] hover:scale-105 transition-all disabled:opacity-50"
                disabled={!text}
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="mr-2 group-hover:animate-bounce"
                />
                Share to LinkedIn
              </button>
              <button
                onClick={() => handleCopyAndRedirect("instagram")}
                className="group flex items-center px-4 py-2 bg-gradient-to-r from-[#405DE6] via-[#C13584] to-[#F77737] text-white rounded-full shadow-md hover:brightness-110 hover:scale-105 transition-all disabled:opacity-50"
                disabled={!text}
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="mr-2 group-hover:animate-bounce"
                />
                Share to Instagram
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {batchResults && batchResults.length > 0 ? (
        <BatchResults />
      ) : finalContent.text ? (
        renderContentCard(finalContent)
      ) : null}

      {copied && (
        <div className="fixed top-4 right-4 p-3 bg-green-500 text-white rounded-lg shadow-lg animate-fade-in-out flex items-center z-50">
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

      <style jsx>{`
        .animate-bounce {
          animation: bounce 0.5s;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out;
        }
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0;
          }
          10%,
          90% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default GeneratedContent;
