import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function BatchResults() {
  const { batchResults } = useSelector((state) => state.content);

  if (!batchResults || batchResults.length === 0) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Content copied to clipboard!");
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Batch Results
      </h2>
      <div className="space-y-6">
        {batchResults.map((result, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-lg shadow-md border ${
              result.error ? "border-red-200 bg-red-50" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                {result.topic}
                {result.error && (
                  <span className="ml-2 text-red-600 text-sm font-normal">
                    (Failed)
                  </span>
                )}
              </h3>
              {!result.error && (
                <button
                  onClick={() => handleCopy(result.final_content.text)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Copy content"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              )}
            </div>

            {result.error ? (
              <div className="text-red-600">
                <p>Error generating content:</p>
                <p className="mt-1 p-2 bg-red-100 rounded">{result.error}</p>
              </div>
            ) : (
              <>
                <div className="text-gray-700 whitespace-pre-wrap mb-4">
                  {result.final_content.text}
                </div>
                {result.final_content.image && (
                  <img
                    src={result.final_content.image}
                    alt="Generated Visual"
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                )}
                {result.final_content.image_error && (
                  <div className="text-red-600 text-sm mt-2">
                    Image Error: {result.final_content.image_error}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BatchResults;
