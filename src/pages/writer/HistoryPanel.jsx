import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTopic, setActiveBrand } from "../../redux/slices/content/contentSlice";

function HistoryPanel() {
  const dispatch = useDispatch();
  const { history, brands } = useSelector((state) => state.content);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Ensure history is an array before filtering
  const filteredHistory = (history || []).filter((entry) =>
    (entry.topic || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleRegenerate = (entry) => {
    dispatch(setTopic(entry.topic));
    dispatch(
      setActiveBrand(brands.find((b) => b.name === entry.brand) || null)
    );
  };
  useEffect(() => {
    console.log("Brands in BrandManagement:", history);
  }, [history]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="sticky top-0 bg-white z-10 w-full text-left text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between"
      >
        Past Generations
        <span className="transition-transform duration-300">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen && (
        <div className="space-y-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredHistory.length === 0 ? (
              <p className="text-sm text-gray-600">
                {search ? "No matches found." : "No history yet."}
              </p>
            ) : (
              filteredHistory.map((entry, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm text-gray-700">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    Topic: {entry.topic || "Untitled"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Brand: {entry.brand || "None"}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {entry.content.text.slice(0, 50)}...
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRegenerate(entry)}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Regenerate
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPanel;
