import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { scrapeTwitter, clearPosts } from "../../redux/slices/abrassio/twitterScraperSlice"
import { format } from "date-fns";

const PostRow = ({ post }) => (
  <tr className="text-center hover:bg-gray-50 transition-colors duration-200">
    <td className="border p-2">{post["Author Name"]}</td>
    <td className="border p-2">@{post["Author Username"]}</td>
    <td className="border p-2">{post["Author Description"]}</td>
    <td className="border p-2">
      <a
        href={post["Profile URL"]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Profile Link
      </a>
    </td>
    <td className="border p-2">{post["Tweet Text"]}</td>
    <td className="border p-2">
      {format(new Date(post["Created At"]), "PPpp")}
    </td>
    <td className="border p-2">
      <a
        href={`https://twitter.com/${post["Author Username"]}/status/${post["Tweet ID"]}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View Tweet
      </a>
    </td>
  </tr>
);

const TwitterScraper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.twitterScraper);

  const [query, setQuery] = useState("");
  const [useCache, setUseCache] = useState(true);

  const handleScrape = (e) => {
    e.preventDefault();
    dispatch(scrapeTwitter({ keyword: query.trim(), useCache })).then((result) => {
      if (result.error && result.payload === "Session expired. Redirecting to login...") {
        setTimeout(() => navigate("/login"), 2000);
      }
    });
  };

  const downloadCSV = () => {
    if (!posts.length) {
      alert("No data to download.");
      return;
    }
    const csv = convertToCSV(posts);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "twitter_scraped_posts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (objArray) => {
    if (!objArray || !objArray.length) return "";
    const headers = Object.keys(objArray[0]);
    const rows = objArray.map((obj) =>
      headers.map((header) => JSON.stringify(obj[header] || "")).join(",")
    );
    return [headers.join(","), ...rows].join("\r\n");
  };

  return (
    <div className="min-h-screen bg-grey-50 flex flex-col items-center justify-center py-8 px-4">
      <h2 className="text-4xl text-center text-blue-500 font-bold mb-6">
        Twitter Scraper
      </h2>

      <form className="w-full max-w-lg space-y-4" onSubmit={handleScrape}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) dispatch(clearPosts());
          }}
          placeholder="Enter a keyword (e.g., UFC)"
          className="w-full p-4 text-lg border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2"
          aria-label="Keyword input"
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useCache}
            onChange={(e) => setUseCache(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-500"
          />
          <span className="text-gray-700">Use cached data</span>
        </div>
        <button
          type="submit"
          className={`w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || !query.trim()}
        >
          {loading ? "Scraping..." : "Fetch Posts"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="w-full max-w-4xl mt-10 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-center text-blue-950">
            Scraped Twitter Data
          </h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-blue-950 font-bold text-center">
                  <th className="border p-2">Author Name</th>
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Author Description</th>
                  <th className="border p-2">Profile URL</th>
                  <th className="border p-2">Tweet Text</th>
                  <th className="border p-2">Created At</th>
                  <th className="border p-2">Link</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <PostRow key={index} post={post} />
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

export default TwitterScraper;