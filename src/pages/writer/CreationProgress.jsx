import { useState } from "react";
import { useSelector } from "react-redux";

function CreationProgress() {
  const { messages, status } = useSelector((state) => state.content);
  const [expanded, setExpanded] = useState(null);

  if (status === "loading" && messages.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Creation Progress
        </h2>
        <div className="space-y-4">
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return messages.length > 0 ? (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        Creation Progress
        <span className="inline-block h-2 w-2 bg-blue-500 rounded-full animate-pulse ml-2" />
      </h2>
      <div className="flex items-center mb-4">
        {messages.map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                index === messages.length - 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            {index < messages.length - 1 && (
              <div className="h-1 w-12 bg-gray-300"></div>
            )}
          </div>
        ))}
      </div>
      <div className="space-y-4 max-h-72 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            onClick={() => setExpanded(expanded === index ? null : index)}
          >
            <p className="text-sm font-medium text-gray-800">
              Step: <span className="text-blue-600">{msg.node_transition}</span>
            </p>
            {expanded === index && (
              <>
                <p className="text-sm text-gray-600 mt-1 break-words">
                  {msg.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Thread: {msg.thread_id} | Revision: {msg.revision} | Count:{" "}
                  {msg.count}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

export default CreationProgress;
