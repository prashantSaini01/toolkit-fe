import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { scrapeLinkedIn, clearPosts } from "../../redux/slices/abrassio/linkedInScraperSlice"
import { format } from "date-fns";

const LinkedInScraper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.linkedInScraper);

  const [query, setQuery] = useState("");
  const [useCache, setUseCache] = useState(true);

  const handleScrape = () => {
    dispatch(scrapeLinkedIn({ hashtag: query.trim(), useCache })).then((result) => {
      if (result.error && result.payload === "Session expired. Redirecting to login...") {
        setTimeout(() => navigate("/login"), 2000);
      }
    });
  };

  const downloadCSV = () => {
    if (!posts.length) {
      dispatch({ type: "linkedInScraper/scrapeLinkedIn/rejected", payload: "No data available to download." });
      return;
    }

    const csvHeader = "Author Name,Author Username,Post Content,Hashtags,Post Date,Post URL\n";
    const csvRows = posts.map((post) => {
      const authorName = post.author_name || "N/A";
      const authorUsername = post.author_username || "N/A";
      const content = post.post_content || "N/A";
      const hashtags = (post.hashtags || []).join(", ");
      const postDate = post.posted_date ? format(new Date(post.posted_date), "PPpp") : "N/A";
      const postUrl = post.post_url || "N/A";

      return `"${authorName}","${authorUsername}","${content}","${hashtags}","${postDate}","${postUrl}"`;
    });

    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "linkedin_scraped_posts.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
      <h1 className="text-4xl text-center text-blue-800 font-bold mb-6">
        LinkedIn Scraper
      </h1>

      <div className="w-full max-w-lg space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) dispatch(clearPosts());
          }}
          placeholder="Enter a hashtag (e.g., Inzint)"
          className="w-full p-4 text-lg border-2 border-blue-800 rounded-lg focus:outline-none focus:ring-2"
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useCache}
            onChange={(e) => setUseCache(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-800"
          />
          <span className="text-gray-700">Use cached data</span>
        </div>
        <button
          onClick={handleScrape}
          className={`w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-800 to-purple-800 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || !query.trim()}
        >
          {loading ? "Scraping..." : "Fetch Posts"}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-600 text-center font-medium">{error}</div>
      )}

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="w-full max-w-4xl mt-10 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-center text-blue-800">
            Scraped LinkedIn Data
          </h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-2 border">Author Name</th>
                  <th className="px-4 py-2 border">Username</th>
                  <th className="px-4 py-2 border">Post Content</th>
                  <th className="px-4 py-2 border">Hashtags</th>
                  <th className="px-4 py-2 border">Post Date</th>
                  <th className="px-4 py-2 border">Post URL</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, idx) => (
                  <tr key={idx} className="hover:bg-blue-50">
                    <td className="px-4 py-2 border">{post.author_name || "N/A"}</td>
                    <td className="px-4 py-2 border">{post.author_username || "N/A"}</td>
                    <td className="px-4 py-2 border">{post.post_content || "N/A"}</td>
                    <td className="px-4 py-2 border">{(post.hashtags || []).join(", ")}</td>
                    <td className="px-4 py-2 border">
                      {post.posted_date ? format(new Date(post.posted_date), "PPpp") : "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      <a
                        href={post.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Post
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={downloadCSV}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-grey-900 transition-transform duration-300"
          >
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkedInScraper;