// import React, { useState, useCallback } from "react";
// import axios from "axios";
// import API_URL from "./config";
// import { useNavigate } from "react-router-dom";

// const TikTokScraper = () => {
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");
//   const [postCount, setPostCount] = useState(10);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem("token");

//   const debounce = (func, delay) => {
//     let timer;
//     return (...args) => {
//       clearTimeout(timer);
//       timer = setTimeout(() => func(...args), delay);
//     };
//   };

//   const handleScrape = async () => {
//     const hashtag = query.trim();
//     if (!hashtag) {
//       alert("Please enter a hashtag to search.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(
//         `${API_URL}/scrape_tiktok`,
//         { hashtag, post_count: postCount },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "x-access-token": token,
//           },
//         }
//       );
//       setPosts(response.data.response);
//     } catch (err) {
//       if (err.response && err.response.status === 401) {
//         setError("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         alert("Session expired. Redirecting to login...");
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setError("An error occurred while scraping TikTok.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQueryChange = debounce((value) => setQuery(value), 300);
//   const handlePostCountChange = debounce((value) => setPostCount(Number(value)), 300);

//   const downloadCSV = () => {
//     if (posts.length === 0) {
//       alert("No data to download.");
//       return;
//     }

//     const headers = Object.keys(posts[0]);
//     const rows = posts.map((post) =>
//       headers.map((header) => `"${post[header] || ""}"`).join(",")
//     );
//     const csvContent = [headers.join(","), ...rows].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "TikTok_scrap_posts.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
//       <h2 className="text-4xl text-center text-grey-900 font-bold mb-6">
//         TikTok Scraper
//       </h2>

//       <div className="w-full max-w-lg space-y-4">
//         <input
//           type="text"
//           onChange={(e) => handleQueryChange(e.target.value)}
//           placeholder="Enter hashtag (e.g., #ai)"
//           className="w-full p-4 text-lg border-2 border-grey-900 rounded-lg focus:outline-none focus:ring-2"
//         />
//         <input
//           type="number"
//           onChange={(e) => handlePostCountChange(e.target.value)}
//           placeholder="Number of posts (e.g., 10)"
//           className="w-full p-4 text-lg border-2 border-grey-900 rounded-lg focus:outline-none focus:ring-2"
//         />
//         <button
//           onClick={handleScrape}
//           className={`w-full mt-6 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ${
//             loading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={loading || !query.trim()}
//         >
//           {loading ? "Scraping..." : "Fetch Posts"}
//         </button>
//         {error && <p className="text-red-500 text-center mt-4">{error}</p>}
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center mt-10">
//           <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent border-solid rounded-full animate-spin"></div>
//         </div>
//       )}

//       {posts.length > 0 && (
//         <div className="w-full max-w-6xl mt-10 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-inner">
//           <h3 className="text-xl font-semibold mb-4 text-center text-purple-800">
//             Scraped TikTok Data
//           </h3>

//           <div className="overflow-x-auto">
//             <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
//               <thead>
//                 <tr className="bg-gray-100 text-purple-800 font-bold text-center">
//                   {Object.keys(posts[0]).map((header, index) => (
//                     <th key={index} className="border p-2 whitespace-nowrap">
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {posts.map((post, rowIndex) => (
//                   <tr
//                     key={rowIndex}
//                     className="text-center hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     {Object.keys(post).map((header, colIndex) => (
//                       <td key={colIndex} className="border p-2">
//                         {header.toLowerCase().includes("image") ? (
//                           <img
//                             src={post[header]}
//                             alt={header}
//                             className="w-16 h-16 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
//                           />
//                         ) : header.toLowerCase().includes("video") ? (
//                           <a
//                             href={post[header]}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:underline"
//                           >
//                             Watch Video
//                           </a>
//                         ) : (
//                           post[header]
//                         )}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <button
//             onClick={downloadCSV}
//             className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105  hover:bg-grey-900 transition-transform duration-300"
//           >
//             Download as CSV
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TikTokScraper;



import React, { useState, useCallback } from "react";
import axios from "axios";
import API_URL from "./config";
import { useNavigate } from "react-router-dom";

const TikTokScraper = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [postCount, setPostCount] = useState(10);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCache, setUseCache] = useState(true); // Use cache state
  const token = localStorage.getItem("token");

  const handleScrape = async () => {
    const hashtag = query.trim();
    if (!hashtag) {
      alert("Please enter a hashtag to search.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/scrape_tiktok`,
        { hashtag, post_count: postCount, use_cache: useCache }, // Pass use_cache parameter
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );
      setPosts(response.data.response);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        alert("Session expired. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("An error occurred while scraping TikTok.");
      }
    } finally {
      setLoading(false);
    }
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
    a.download = "TikTok_scrap_posts.csv";
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter hashtag (e.g., #ai)"
          className="w-full p-4 text-lg border-2 border-grey-900 rounded-lg focus:outline-none focus:ring-2"
        />
        <input
          type="number"
          onChange={(e) => setPostCount(e.target.value)}
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
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105  hover:bg-grey-900 transition-transform duration-300"
          >
            Download as CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default TikTokScraper;