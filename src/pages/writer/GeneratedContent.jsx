/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

function GeneratedContent() {
  const { data, activeBrand } = useSelector((state) => state.content);
  const [copied, setCopied] = useState(false);

  if (!data || data.length === 0) return null;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Content copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleShare = (platform, text) => {
    if (!text) return;
    const maxLengths = { twitter: 280, linkedin: 3000, instagram: 2200 };
    const content =
      text.length > maxLengths[platform]
        ? text.substring(0, maxLengths[platform] - 30) + "... [truncated]"
        : text;
    handleCopy(content);
    const urls = {
      twitter: "https://twitter.com/intent/tweet",
      linkedin: "https://www.linkedin.com/feed/?shareActive=true",
      instagram: "https://www.instagram.com/",
    };
    window.open(urls[platform], "_blank");
  };

  const parseContent = (text) => {
    if (!text)
      return { mainContent: "", caption: "", hashtags: "", visual: "" };
    const lines = text.split("\n").filter((line) => line.trim());
    let mainContent = [],
      caption = "",
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

  return (
    <>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {data.length === 1
            ? "Generated Content"
            : `Batch Results (${data.length} posts)`}
        </h2>
        <div className="space-y-6">
          {data.map((item, index) => {
            const { mainContent, caption, hashtags, visual } = parseContent(
              item.content.text
            );
            // Only mark as error if text content indicates failure
            const hasError = item.content.text?.startsWith("Error:") || false;

            return (
              <div
                key={index}
                className={`bg-white p-6 rounded-lg shadow-md border ${
                  hasError ? "border-red-200 bg-red-50" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.topic || "Untitled"}
                    {hasError && (
                      <span className="ml-2 text-red-600 text-sm font-normal">
                        (Failed)
                      </span>
                    )}
                  </h3>
                  {!hasError && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleCopy(item.content.text)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Copy content"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                      <button
                        onClick={() =>
                          handleShare("twitter", item.content.text)
                        }
                        className="text-[#1DA1F2] hover:text-[#1A91DA]"
                        title="Share to Twitter"
                      >
                        <FontAwesomeIcon icon={faTwitter} />
                      </button>
                      <button
                        onClick={() =>
                          handleShare("linkedin", item.content.text)
                        }
                        className="text-[#0A66C2] hover:text-[#0A548B]"
                        title="Share to LinkedIn"
                      >
                        <FontAwesomeIcon icon={faLinkedin} />
                      </button>
                      <button
                        onClick={() =>
                          handleShare("instagram", item.content.text)
                        }
                        className="text-gradient-to-r from-[#405DE6] via-[#C13584] to-[#F77737] hover:brightness-110"
                        title="Share to Instagram"
                      >
                        <FontAwesomeIcon icon={faInstagram} />
                      </button>
                    </div>
                  )}
                </div>

                {hasError ? (
                  <div className="text-red-600 space-y-2">
                    <p className="font-medium">Error generating content:</p>
                    <div className="p-3 bg-red-100 rounded text-sm overflow-x-auto">
                      {item.content.text.replace("Error: ", "")}
                    </div>
                  </div>
                ) : (
                  <>
                    {activeBrand && (
                      <div className="flex items-center mb-4">
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
                    <div className="text-gray-700 whitespace-pre-wrap mb-4">
                      {mainContent}
                    </div>
                    {item.content.image_base64 && (
                      <img
                        src={`data:image/jpeg;base64,${item.content.image_base64}`}
                        alt={`Visual for ${item.topic}`}
                        className="max-w-full h-auto rounded-lg shadow-md mb-4"
                      />
                    )}
                    {item.content.image_error && (
                      <div className="text-yellow-600 text-sm mb-4 p-2 bg-yellow-50 rounded">
                        Image Generation: {item.content.image_error}
                      </div>
                    )}
                    {visual &&
                      !item.content.image_base64 &&
                      !item.content.image_error && (
                        <div className="text-gray-600 text-sm mb-4">
                          <span className="font-medium">
                            Visual suggestion:
                          </span>{" "}
                          {visual}
                        </div>
                      )}
                    {caption && (
                      <div className="mb-2">
                        <span className="font-medium text-gray-800">
                          Caption:
                        </span>{" "}
                        <span className="text-gray-600 italic">{caption}</span>
                      </div>
                    )}
                    {hashtags && (
                      <div>
                        <span className="font-medium text-gray-800">
                          Hashtags:
                        </span>{" "}
                        <span className="text-blue-600">{hashtags}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
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
