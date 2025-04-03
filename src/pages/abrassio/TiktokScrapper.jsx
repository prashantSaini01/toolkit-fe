import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { scrapeTikTok, clearPosts } from "../../redux/slices/abrassio/tikTokScraperSlice"

const TikTokScraper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.tikTokScraper);

  const [query, setQuery] = useState("");
  const [postCount, setPostCount] = useState(10);
  const [useCache, setUseCache] = useState(true);

  const handleScrape = () => {
    dispatch(scrapeTikTok({ hashtag: query.trim(), postCount, useCache })).then((result) => {
      if (result.error && result.payload === "Session expired. Please log in again.") {
        alert("Session expired. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    });
  };

  const downloadCSV = () => {
    if (posts.length === 0) {
      alert("No data to download.");
      return;
    }

    const headers = Object.keys(posts[0]);
    const rows = posts.map((post) =>
      headers.map((header) => `"${post[header] || ""}"`).join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "TikTok_scraped_posts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
      <h2 className="text-4xl text-center text-grey-900 font-bold mb-6">
        TikTok Scraper
      </h2>

      <div className="w-full max-w-lg space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) dispatch(clearPosts());
          }}
          placeholder="Enter hashtag (e.g., #ai)"
          className="w-full p-4 text-lg border-2 border-grey-900 rounded-lg focus:outline-none focus:ring-2"
        />
        <input
          type="number"
          value={postCount}
          onChange={(e) => setPostCount(Number(e.target.value))}
          placeholder="Number of posts (e.g., 10)"
          className="w-full p-4 text-lg border-2 border-grey-900 rounded-lg focus:outline-none focus:ring-2"
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useCache}
            onChange={(e) => setUseCache(e.target.checked)}
            className="form-checkbox h-5 w-5 text-grey-900"
          />
          <span className="text-gray-700">Use cached data</span>
        </div>
        <button
          onClick={handleScrape}
          className={`w-full mt-6 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || !query.trim()}
        >
          {loading ? "Scraping..." : "Fetch Posts"}
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="w-full max-w-6xl mt-10 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-center text-purple-800">
            Scraped TikTok Data
          </h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-purple-800 font-bold text-center">
                  {Object.keys(posts[0]).map((header, index) => (
                    <th key={index} className="border p-2 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="text-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    {Object.keys(post).map((header, colIndex) => (
                      <td key={colIndex} className="border p-2">
                        {header.toLowerCase().includes("image") ? (
                          <img
                            src={post[header]}
                            alt={header}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          />
                        ) : header.toLowerCase().includes("video") ? (
                          <a
                            href={post[header]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Watch Video
                          </a>
                        ) : (
                          post[header]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={downloadCSV}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-grey-900 transition-transform duration-300"
          >
            Download as CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default TikTokScraper;