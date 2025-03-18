// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import API_URL from "./config";
// import { format } from "date-fns";
// import {
//   FaUser,
//   FaHeart,
//   FaCommentDots,
//   FaCalendarAlt,
//   FaLink,
//   FaRegComment,
// } from "react-icons/fa";

// const InstagramScraper = () => {
//   const navigate = useNavigate();

//   const [query, setQuery] = useState("");
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const token = localStorage.getItem("token");

//   const handleScrape = async () => {
//     const hashtag = query.trim();
//     if (!hashtag) {
//       alert("Please enter a hashtag to search.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     try {
//       const response = await axios.post(
//         `${API_URL}/scrape_instagram`,
//         { hashtag },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "x-access-token": token,
//           },
//         }
//       );
//       setPosts(response.data.response);
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         setError("Session expired. Please log in again.");
//         localStorage.removeItem("token");

//         window.alert("Session expired. Please log in again.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 2000);
//       } else {
//         setError("An error occurred while scraping Instagram.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadCSV = () => {
//     if (!posts.length) {
//       alert("No data available to download.");
//       return;
//     }

//     const csvHeader =
//       "Username,Caption,Like Count,Comment Count,Post Date,Post Link\n";
//     const csvRows = posts.map((post) => {
//       const username = post["Username"] || "";
//       const caption = post["Caption Text"] || "";
//       const likes = post["Like Count"] || 0;
//       const comments = post["Comment Count"] || 0;
//       const postDate = format(new Date(post["Post Date"]), "PPpp");
//       const postLink = post["Img"] || "";

//       return `"${username}","${caption}","${likes}","${comments}","${postDate}","${postLink}"`;
//     });

//     const csvContent = csvHeader + csvRows.join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "instagram_scrap_posts.csv";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
//       <h2 className="text-4xl text-center text-pink-500 font-bold mb-6">
//         Instagram Scraper
//       </h2>

//       {error && (
//         <div className="w-full max-w-lg mb-4 p-4 bg-red-100 text-red-600 border border-red-400 rounded-lg">
//           {error}
//         </div>
//       )}

//       <div className="w-full max-w-lg space-y-4">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Enter a hashtag (e.g., travel)"
//           className="w-full p-4 text-lg border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2"
//         />
//         <button
//           onClick={handleScrape}
//           className={`w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ${
//             loading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={loading || !query.trim()}
//         >
//           {loading ? "Scraping..." : "Fetch Posts"}
//         </button>
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center mt-10">
//           <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent border-solid rounded-full animate-spin"></div>
//         </div>
//       )}

//       {posts.length > 0 && (
//         <div className="w-full max-w-4xl mt-10 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-inner">
//           <h3 className="text-xl font-semibold mb-4 text-center text-purple-800">
//             Scraped Instagram Data
//           </h3>
//           <div className="overflow-x-auto">
//             <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
//               <thead>
//                 <tr className="bg-gray-100 text-purple-800 font-bold text-center">
//                   <th className="border p-2">Username</th>
//                   <th className="border p-2">Caption</th>
//                   <th className="border p-2">Likes</th>
//                   <th className="border p-2">Comments</th>
//                   <th className="border p-2">Post Date</th>
//                   <th className="border p-2">Post Link</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {posts.map((post, index) => (
//                   <tr
//                     key={index}
//                     className="text-center hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     <td className="border p-2">{post["Username"]}</td>
//                     <td className="border p-2">{post["Caption Text"]}</td>
//                     <td className="border p-2">{post["Like Count"]}</td>
//                     <td className="border p-2">{post["Comment Count"]}</td>
//                     <td className="border p-2">
//                       {format(new Date(post["Post Date"]), "PPpp")}
//                     </td>
//                     <td className="border p-2">
//                       <a
//                         href={post["Img"]}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-purple-600 hover:underline"
//                       >
//                         View Post
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <button
//             onClick={downloadCSV}
//            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105  hover:bg-grey-900 transition-transform duration-300"
//           >
//             Download as CSV
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InstagramScraper;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "./config";
import { format } from "date-fns";
import {
  FaUser,
  FaHeart,
  FaCommentDots,
  FaCalendarAlt,
  FaLink,
  FaRegComment,
} from "react-icons/fa";

const InstagramScraper = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useCache, setUseCache] = useState(true); // Use cache state
  const token = localStorage.getItem("token");

  const handleScrape = async () => {
    const hashtag = query.trim();
    if (!hashtag) {
      alert("Please enter a hashtag to search.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${API_URL}/scrape_instagram`,
        { hashtag, use_cache: useCache }, // Pass use_cache parameter
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );
      setPosts(response.data.response);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");

        window.alert("Session expired. Please log in again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("An error occurred while scraping Instagram.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!posts.length) {
      alert("No data available to download.");
      return;
    }

    const csvHeader =
      "Username,Caption,Like Count,Comment Count,Post Date,Post Link\n";
    const csvRows = posts.map((post) => {
      const username = post["Username"] || "";
      const caption = post["Caption Text"] || "";
      const likes = post["Like Count"] || 0;
      const comments = post["Comment Count"] || 0;
      const postDate = format(new Date(post["Post Date"]), "PPpp");
      const postLink = post["Img"] || "";

      return `"${username}","${caption}","${likes}","${comments}","${postDate}","${postLink}"`;
    });

    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "instagram_scrap_posts.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
      <h2 className="text-4xl text-center text-pink-500 font-bold mb-6">
        Instagram Scraper
      </h2>

      {error && (
        <div className="w-full max-w-lg mb-4 p-4 bg-red-100 text-red-600 border border-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="w-full max-w-lg space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a hashtag (e.g., travel)"
          className="w-full p-4 text-lg border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2"
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useCache}
            onChange={(e) => setUseCache(e.target.checked)}
            className="form-checkbox h-5 w-5 text-pink-500"
          />
          <span className="text-gray-700">Use cached data</span>
        </div>
        <button
          onClick={handleScrape}
          className={`w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || !query.trim()}
        >
          {loading ? "Scraping..." : "Fetch Posts"}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="w-full max-w-4xl mt-10 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-center text-purple-800">
            Scraped Instagram Data
          </h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-purple-800 font-bold text-center">
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Caption</th>
                  <th className="border p-2">Likes</th>
                  <th className="border p-2">Comments</th>
                  <th className="border p-2">Post Date</th>
                  <th className="border p-2">Post Link</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr
                    key={index}
                    className="text-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="border p-2">{post["Username"]}</td>
                    <td className="border p-2">{post["Caption Text"]}</td>
                    <td className="border p-2">{post["Like Count"]}</td>
                    <td className="border p-2">{post["Comment Count"]}</td>
                    <td className="border p-2">
                      {format(new Date(post["Post Date"]), "PPpp")}
                    </td>
                    <td className="border p-2">
                      <a
                        href={post["Img"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
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
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105  hover:bg-grey-900 transition-transform duration-300"
          >
            Download as CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default InstagramScraper;