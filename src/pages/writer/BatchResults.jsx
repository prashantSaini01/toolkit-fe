import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";

function BatchResults() {
  const { data } = useSelector((state) => state.content);

  if (!data || data.length === 0) return null;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Content copied to clipboard!");
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
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {data.length === 1
          ? "Generated Content"
          : `Batch Results (${data.length} posts)`}
      </h2>
      <div className="space-y-6">
        {data.map((item, index) => {
          const { mainContent, caption, hashtags, visual } = parseContent(
            item.final_content?.text // Use final_content instead of content
          );
          // Only mark as error if text content indicates failure
          const hasError =
            item.final_content?.text?.startsWith("Error:") || false;

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
                      onClick={() => handleCopy(item.final_content?.text)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Copy content"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <button
                      onClick={() =>
                        handleShare("twitter", item.final_content?.text)
                      }
                      className="text-[#1DA1F2] hover:text-[#1A91DA]"
                      title="Share to Twitter"
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </button>
                    <button
                      onClick={() =>
                        handleShare("linkedin", item.final_content?.text)
                      }
                      className="text-[#0A66C2] hover:text-[#0A548B]"
                      title="Share to LinkedIn"
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </button>
                    <button
                      onClick={() =>
                        handleShare("instagram", item.final_content?.text)
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
                    {item.final_content?.text?.replace("Error: ", "")}
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-gray-700 whitespace-pre-wrap mb-4">
                    {mainContent}
                  </div>
                  {item.final_content?.image && (
                    <img
                      src={`data:image/jpeg;base64,${item.final_content.image}`}
                      alt={`Visual for ${item.topic}`}
                      className="max-w-full h-auto rounded-lg shadow-md mb-4"
                    />
                  )}
                  {item.final_content?.image_error && (
                    <div className="text-yellow-600 text-sm mb-4 p-2 bg-yellow-50 rounded">
                      Image Generation: {item.final_content.image_error}
                    </div>
                  )}
                  {visual &&
                    !item.final_content?.image &&
                    !item.final_content?.image_error && (
                      <div className="text-gray-600 text-sm mb-4">
                        <span className="font-medium">Visual suggestion:</span>{" "}
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
  );
}

export default BatchResults;
