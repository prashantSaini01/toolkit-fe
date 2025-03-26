import { useState } from "react";

function HistoryPanel({ history, setTopic, setActiveBrand, brands }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleRegenerate = (entry) => {
    setTopic(entry.topic);
    setActiveBrand(brands.find((b) => b.name === entry.brand) || null);
  };

  return (
    <div className="w-80 bg-white rounded-xl shadow-2xl p-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-lg font-semibold text-gray-800 mb-2"
      >
        Past Generations {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-sm text-gray-600">No history yet.</p>
          ) : (
            history.map((entry, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <p className="text-sm text-gray-700">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  Topic: {entry.topic}
                </p>
                <p className="text-sm text-gray-600">Brand: {entry.brand}</p>
                <p className="text-sm text-gray-600 truncate">
                  {entry.content.text.slice(0, 50)}...
                </p>
                <button
                  type="button"
                  onClick={() => handleRegenerate(entry)}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Regenerate
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default HistoryPanel;
