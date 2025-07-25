// import { useNavigate } from "react-router-dom";
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { scrapeYoutube, getSummary, subscribeNewsletter, clearOutput } from "../../redux/slices/abrassio/youtubeScraperSlice";
// import { toast } from "react-toastify";

// // Format the output into a table
// const formatOutput = (data) => {
//   if (!Array.isArray(data) || data.length === 0) {
//     return <p className="text-gray-500 italic">No videos found for the given query.</p>;
//   }

//   return (
//     <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
//       <table className="table-auto w-full text-left border-collapse bg-white">
//         <thead>
//           <tr className="bg-gradient-to-r from-red-100 to-red-200 text-gray-700">
//             <th className="px-4 py-3 border-b border-red-300">Thumbnail</th>
//             <th className="px-4 py-3 border-b border-red-300">Title</th>
//             <th className="px-4 py-3 border-b border-red-300">Channel</th>
//             <th className="px-4 py-3 border-b border-red-300">Published</th>
//             <th className="px-4 py-3 border-b border-red-300">Description</th>
//             <th className="px-4 py-3 border-b border-red-300">URL</th>
//             <th className="px-4 py-3 border-b border-red-300">Sentiment</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((video, index) => (
//             <tr
//               key={index}
//               className="hover:bg-red-50 transition-colors duration-200"
//             >
//               <td className="px-4 py-2 border-b border-gray-200">
//                 <img
//                   src={video.Thumbnail || "https://via.placeholder.com/150"}
//                   alt="Thumbnail"
//                   className="w-20 h-auto rounded-md shadow-sm"
//                 />
//               </td>
//               <td className="px-4 py-2 border-b border-gray-200 truncate max-w-xs">
//                 {video.Title || "N/A"}
//               </td>
//               <td className="px-4 py-2 border-b border-gray-200">
//                 {video["Channel Title"] || "N/A"}
//               </td>
//               <td className="px-4 py-2 border-b border-gray-200">
//                 {new Date(video["Published At"]).toLocaleDateString()}
//               </td>
//               <td className="px-4 py-2 border-b border-gray-200 truncate max-w-md">
//                 {video.Description || "No description"}
//               </td>
//               <td className="px-4 py-2 border-b border-gray-200">
//                 <a
//                   href={video.URL}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-red-600 hover:underline"
//                 >
//                   Watch
//                 </a>
//               </td>
//               <td className="px-4 py-2 border-b border-gray-200">
//                 {video["Sentiment Analysis"]}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const YoutubeScraper = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { output, summary, loading, summaryLoading, error } = useSelector((state) => state.youtubeScraper);

//   const [hashtag, setHashtag] = useState("");
//   const [maxResults, setMaxResults] = useState("5");
//   const [useCache, setUseCache] = useState(true);

//   const handleScrape = () => {
//     dispatch(scrapeYoutube({ hashtag, maxResults, useCache })).then((result) => {
//       if (result.error && result.payload === "Session expired. Please log in again.") {
//         window.alert("Session expired. Please log in again.");
//         setTimeout(() => navigate("/login"), 2000);
//       }
//     });
//   };

//   const handleGetSummary = () => {
//     dispatch(getSummary(output));
//   };

//   const handleSubscribe = () => {
//     if (!hashtag) {
//       toast.error("Please enter a hashtag before subscribing.");
//       return;
//     }
//     dispatch(subscribeNewsletter({ platform: "youtube", tag: hashtag }));
//   };

//   const downloadCSV = () => {
//     if (!output.length) return;

//     const headers = [
//       "Title",
//       "Description",
//       "URL",
//       "Channel Title",
//       "Published At",
//       "Thumbnail",
//       "Sentiment Analysis",
//     ];
//     const csvRows = [
//       headers.join(","),
//       ...output.map((video) =>
//         [
//           `"${video.Title || ""}"`,
//           `"${video.Description || ""}"`,
//           `"${video.URL || ""}"`,
//           `"${video["Channel Title"] || ""}"`,
//           `"${new Date(video["Published At"]).toLocaleDateString()}"`,
//           `"${video.Thumbnail || ""}"`,
//           `"${video["Sentiment Analysis"] || ""}"`,
//         ].join(",")
//       ),
//     ];

//     const csvContent = csvRows.join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", "youtube_scraped_posts.csv");
//     link.style.display = "none";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const goToDashboard = () => {
//     navigate("/dashboard");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex flex-col items-center py-12 px-6 relative">
//       <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mb-8 animate-pulse">
//         YouTube Scraper
//       </h2>

//       <div className="w-full max-w-lg bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-red-100 space-y-6">
//         <input
//           type="text"
//           value={hashtag}
//           onChange={(e) => {
//             setHashtag(e.target.value);
//             if (!e.target.value.trim()) dispatch(clearOutput());
//           }}
//           placeholder="Enter hashtag (e.g., #tech)"
//           className="w-full p-4 text-lg border-2 border-red-200 rounded-xl bg-gradient-to-r from-white to-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm hover:shadow-md transition-all duration-300"
//         />
//         <div className="space-y-2">
//           <select
//             value={maxResults}
//             onChange={(e) => setMaxResults(e.target.value)}
//             className={`w-full p-4 text-lg border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm hover:shadow-md transition-all duration-300 ${
//               useCache
//                 ? "bg-gray-200 cursor-not-allowed text-gray-500"
//                 : "bg-gradient-to-r from-white to-red-50 text-gray-800"
//             }`}
//             disabled={useCache}
//           >
//             <option value="5">5</option>
//             <option value="10">10</option>
//             <option value="15">15</option>
//             <option value="20">20</option>
//             <option value="25">25</option>
//           </select>
//           <p className="text-sm text-gray-600 italic">
//             Note: The actual number of results may vary due to API response.
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             checked={useCache}
//             onChange={(e) => setUseCache(e.target.checked)}
//             className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-400"
//           />
//           <span className="text-gray-700 font-medium">Use cached data</span>
//         </div>
//         <button
//           onClick={handleScrape}
//           className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           disabled={loading}
//         >
//           {loading ? (
//             <span className="flex items-center justify-center gap-2">
//               <svg
//                 className="animate-spin h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 />
//               </svg>
//               Scraping...
//             </span>
//           ) : (
//             "Fetch Videos"
//           )}
//         </button>
//         {output.length > 0 && (
//           <button
//             onClick={handleSubscribe}
//             className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
//           >
//             Subscribe for Newsletter
//           </button>
//         )}
//       </div>

//       {loading && !output.length && (
//         <div className="flex justify-center items-center mt-12">
//           <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}

//       {error && (
//         <p className="text-red-600 text-lg mt-6 bg-red-100 p-4 rounded-lg shadow-md">
//           {error}
//         </p>
//       )}
//       {output.length > 0 && (
//         <div className="w-full max-w-6xl mt-10">
//           {formatOutput(output)}
//           <div className="flex justify-start space-x-6 mt-6">
//             <button
//               onClick={downloadCSV}
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
//             >
//               Download CSV
//             </button>
//             <button
//               onClick={handleGetSummary}
//               className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
//               disabled={summaryLoading}
//             >
//               {summaryLoading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Fetching...
//                 </span>
//               ) : (
//                 "Get Summary"
//               )}
//             </button>
//           </div>
//           {summaryLoading && (
//             <div className="flex justify-center items-center mt-6">
//               <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           )}
//           {summary && (
//             <div className="mt-8 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-3xl mx-auto border-l-4 border-indigo-500">
//               <h3 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//                 Summary Insights
//               </h3>
//               <div
//                 className="text-gray-700 prose prose-indigo"
//                 dangerouslySetInnerHTML={{ __html: summary }}
//               />
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default YoutubeScraper;
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { scrapeYoutube, getSummary, subscribeNewsletter, clearOutput } from "../../redux/slices/abrassio/youtubeScraperSlice";
import { toast } from "react-toastify";

// Format the output into a table
const formatOutput = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-gray-500 italic">No videos found for the given query.</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
      <table className="table-auto w-full text-left border-collapse bg-white">
        <thead>
          <tr className="bg-gradient-to-r from-red-100 to-red-200 text-gray-700">
            <th className="px-4 py-3 border-b border-red-300">Thumbnail</th>
            <th className="px-4 py-3 border-b border-red-300">Title</th>
            <th className="px-4 py-3 border-b border-red-300">Channel</th>
            <th className="px-4 py-3 border-b border-red-300">Published</th>
            <th className="px-4 py-3 border-b border-red-300">Description</th>
            <th className="px-4 py-3 border-b border-red-300">URL</th>
            <th className="px-4 py-3 border-b border-red-300">Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((video, index) => (
            <tr
              key={index}
              className="hover:bg-red-50 transition-colors duration-200"
            >
              <td className="px-4 py-2 border-b border-gray-200">
                <img
                  src={video.Thumbnail || "https://via.placeholder.com/150"}
                  alt="Thumbnail"
                  className="w-20 h-auto rounded-md shadow-sm"
                />
              </td>
              <td className="px-4 py-2 border-b border-gray-200 truncate max-w-xs">
                {video.Title || "N/A"}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                {video["Channel Title"] || "N/A"}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                {new Date(video["Published At"]).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 truncate max-w-md">
                {video.Description || "No description"}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                <a
                  href={video.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  Watch
                </a>
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                {video["Sentiment Analysis"]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const YoutubeScraper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { output, summary, loading, summaryLoading, error } = useSelector((state) => state.youtubeScraper);

  const [hashtag, setHashtag] = useState("");
  const [maxResults, setMaxResults] = useState("5");
  const [useCache, setUseCache] = useState(true);

  const handleScrape = () => {
    dispatch(scrapeYoutube({ hashtag, maxResults, useCache })).then((result) => {
      if (result.error && result.payload === "Session expired. Please log in again.") {
        window.alert("Session expired. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      }
    });
  };

  const handleGetSummary = () => {
    dispatch(getSummary(output));
  };

  const handleSubscribe = () => {
    if (!hashtag) {
      toast.error("Please enter a hashtag before subscribing.");
      return;
    }
    dispatch(subscribeNewsletter({ platform: "youtube", tag: hashtag }));
  };

  const downloadCSV = () => {
    if (!output.length) return;

    const headers = [
      "Title",
      "Description",
      "URL",
      "Channel Title",
      "Published At",
      "Thumbnail",
      "Sentiment Analysis",
    ];
    const csvRows = [
      headers.join(","),
      ...output.map((video) =>
        [
          `"${video.Title || ""}"`,
          `"${video.Description || ""}"`,
          `"${video.URL || ""}"`,
          `"${video["Channel Title"] || ""}"`,
          `"${new Date(video["Published At"]).toLocaleDateString()}"`,
          `"${video.Thumbnail || ""}"`,
          `"${video["Sentiment Analysis"] || ""}"`,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "youtube_scraped_posts.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex flex-col items-center py-12 px-6 relative">
      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mb-8 animate-pulse">
        YouTube Scraper
      </h2>

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-red-100 space-y-6">
        <input
          type="text"
          value={hashtag}
          onChange={(e) => {
            setHashtag(e.target.value);
            if (!e.target.value.trim()) dispatch(clearOutput());
          }}
          placeholder="Enter hashtag (e.g., #tech)"
          className="w-full p-4 text-lg border-2 border-red-200 rounded-xl bg-gradient-to-r from-white to-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm hover:shadow-md transition-all duration-300"
        />
        <div className="space-y-2">
          <select
            value={maxResults}
            onChange={(e) => setMaxResults(e.target.value)}
            className={`w-full p-4 text-lg border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm hover:shadow-md transition-all duration-300 ${
              useCache
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-white to-red-50 text-gray-800"
            }`}
            disabled={useCache}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
          </select>
          <p className="text-sm text-gray-600 italic">
            Note: The actual number of results may vary due to API response.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={useCache}
            onChange={(e) => setUseCache(e.target.checked)}
            className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-400"
          />
          <span className="text-gray-700 font-medium">Use cached data</span>
        </div>
        <button
          onClick={handleScrape}
          className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Scraping...
            </span>
          ) : (
            "Fetch Videos"
          )}
        </button>
        {output.length > 0 && (
          <button
            onClick={handleSubscribe}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Subscribe for Newsletter
          </button>
        )}
      </div>

      {loading && !output.length && (
        <div className="flex justify-center items-center mt-12">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-lg mt-6 bg-red-100 p-4 rounded-lg shadow-md">
          {error}
        </p>
      )}
      {output.length > 0 && (
        <div className="w-full max-w-6xl mt-10">
          {formatOutput(output)}
          <div className="flex justify-start space-x-6 mt-6">
            <button
              onClick={downloadCSV}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Download CSV
            </button>
            <button
              onClick={handleGetSummary}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={summaryLoading}
            >
              {summaryLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Fetching...
                </span>
              ) : (
                "Get Summary"
              )}
            </button>
          </div>
          {summaryLoading && (
            <div className="flex justify-center items-center mt-6">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {summary && (
            <div className="mt-8 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-3xl mx-auto border-l-4 border-indigo-500">
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Summary Insights
              </h3>
              <div
                className="text-gray-700 prose prose-indigo"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YoutubeScraper;