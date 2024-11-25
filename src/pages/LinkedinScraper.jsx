import React, { useState } from "react";
import axios from "axios";
import API_URL from "./config";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const LinkedInScraper = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleScrape = async () => {
    const hashtag = query.trim();

    if (!hashtag) {
      setError("Please enter a hashtag to search.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/scrape_linkedin`,
        { hashtag },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      setPosts(response.data.response || []);
      if (!response.data.response.length) {
        setError("No posts found for the given hashtag.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Redirecting to login...");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "An error occurred while scraping LinkedIn.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!posts.length) {
      setError("No data available to download.");
      return;
    }

    const csvHeader =
      "Author Name,Author Username,Post Content,Hashtags,Post Date,Post URL\n";
    const csvRows = posts.map((post) => {
      const authorName = post.author_name || "N/A";
      const authorUsername = post.author_username || "N/A";
      const content = post.post_content || "N/A";
      const hashtags = (post.hashtags || []).join(", ");
      const postDate = post.posted_date
        ? format(new Date(post.posted_date), "PPpp")
        : "N/A";
      const postUrl = post.post_url || "N/A";

      return `"${authorName}","${authorUsername}","${content}","${hashtags}","${postDate}","${postUrl}"`;
    });

    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "linkedin_posts.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
        <h1 className="text-4xl font-bold text-blue-800 text-center">
          LinkedIn Scraper
        </h1>
    

      <div className="w-full max-w-lg space-y-4 mt-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a hashtag (e.g., Inzint)"
          className="w-full p-4 text-lg border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={handleScrape}
          className={`w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ${
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

      {posts.length > 0 ? (
        <div className="w-full max-w-6xl mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-lg font-bold text-blue-800 mb-2">
                {post.author_name || "Anonymous"}
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Username:</strong> {post.author_username || "N/A"}
              </p>
              <p className="text-gray-700 mb-2">{post.post_content || "No content available."}</p>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Hashtags:</strong>{" "}
                {(post.hashtags || []).join(", ") || "None"}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Date:</strong>{" "}
                {post.posted_date
                  ? format(new Date(post.posted_date), "PPpp")
                  : "N/A"}
              </p>
              <a
                href={post.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Post
              </a>
            </div>
          ))}
        </div>
      ) : (
        !loading
      )}

      {posts.length > 0 && (
        <button
          onClick={downloadCSV}
          className="mt-8 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
          Download CSV
        </button>
      )}
    </div>
  );
};

export default LinkedInScraper;
