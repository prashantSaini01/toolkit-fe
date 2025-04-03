import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { scrapeTwitch, clearVideos } from "../../redux/slices/abrassio/twitchScraperSlice";

const TwitchVideos = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.twitchScraper);

  const [keyword, setKeyword] = useState("");
  const [numVideos, setNumVideos] = useState(5);
  const [useCache, setUseCache] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(scrapeTwitch({ keyword, numVideos, useCache })).then((result) => {
      if (result.error && result.payload === "Session expired. Please log in again.") {
        alert(result.payload);
        setTimeout(() => navigate("/login"), 2000);
      }
    });
  };

  const downloadCSV = () => {
    if (videos.length === 0) {
      alert("No data to download.");
      return;
    }

    const headers = ["Thumbnail", "Title", "Channel", "Published At", "Video URL"];
    const rows = videos.map((video) => [
      video.thumbnail.replace("%{width}", "120").replace("%{height}", "90"),
      video.title || "N/A",
      video.channel_name || "N/A",
      new Date(video.published_at).toLocaleDateString(),
      video.channel_link,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "twitch_scraped_posts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
      <h2 className="text-4xl text-center font-bold text-pink-500 mb-6">
        Twitch Scraper
      </h2>

      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (!e.target.value.trim()) dispatch(clearVideos());
          }}
          placeholder="Enter keyword"
          className="w-full p-3 mb-4 border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2"
          required
        />
        <input
          type="number"
          value={numVideos}
          onChange={(e) => setNumVideos(e.target.value)}
          placeholder="Number of videos to scrape"
          className="w-full p-3 mb-6 border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2"
          min="1"
          max="50"
          required
        />
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            checked={useCache}
            onChange={(e) => setUseCache(e.target.checked)}
            className="form-checkbox h-5 w-5 text-pink-500"
          />
          <span className="text-gray-700">Use cached data</span>
        </div>
        <button
          type="submit"
          className={`w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
          }`}
          disabled={loading}
        >
          {loading ? "Scraping..." : "Fetch Posts"}
        </button>
      </form>

      {error && (
        <div className="mt-6 w-full max-w-lg p-4 bg-red-100 text-red-700 border-2 border-red-400 rounded-lg">
          <h3 className="font-semibold text-xl mb-2">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {videos.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-3 border-b text-left">Thumbnail</th>
                <th className="px-4 py-3 border-b text-left">Title</th>
                <th className="px-4 py-3 border-b text-left">Channel</th>
                <th className="px-4 py-3 border-b text-left">Published At</th>
                <th className="px-4 py-3 border-b text-left">Video URL</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="px-4 py-2 border-b">
                    <img
                      src={video.thumbnail.replace("%{width}", "120").replace("%{height}", "90")}
                      alt="Thumbnail"
                      className="w-20 h-auto rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">{video.title || "N/A"}</td>
                  <td className="px-4 py-2 border-b">{video.channel_name || "N/A"}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(video.published_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <a
                      href={video.channel_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Watch
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

export default TwitchVideos;