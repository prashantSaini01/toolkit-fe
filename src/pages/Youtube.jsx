// import { useNavigate } from 'react-router-dom';
// import React, { useState } from 'react';
// import axios from 'axios';
// import API_URL from './config'; // Adjust the path if necessary


// const YoutubeScraper = () => {
//   const navigate = useNavigate();
//   const [hashtag, setHashtag] = useState('');
//   const [maxResults, setMaxResults] = useState(5);
//   const [output, setOutput] = useState([]);
//   const [summary, setSummary] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [summaryLoading, setSummaryLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [useCache, setUseCache] = useState(true);
//   const token = localStorage.getItem('token');

//   // Format the output into a table
//   const formatOutput = (data) => {
//     if (!Array.isArray(data) || data.length === 0) {
//       return <p>No videos found for the given query.</p>;
//     }

//     return (
//       <div className="mt-6 overflow-x-auto">
//         <table className="table-auto w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-200 text-gray-700">
//               <th className="px-4 py-3 border-b border-gray-300">Thumbnail</th>
//               <th className="px-4 py-3 border-b border-gray-300">Title</th>
//               <th className="px-4 py-3 border-b border-gray-300">Channel Title</th>
//               <th className="px-4 py-3 border-b border-gray-300">Published At</th>
//               <th className="px-4 py-3 border-b border-gray-300">Description</th>
//               <th className="px-4 py-3 border-b border-gray-300">Video URL</th>
//               <th className="px-4 py-3 border-b border-gray-300">Sentiment</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((video, index) => (
//               <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
//                 <td className="px-4 py-2 border-b border-gray-200">
//                   <img
//                     src={video.Thumbnail || 'https://via.placeholder.com/150'}
//                     alt="Thumbnail"
//                     className="w-20 h-auto rounded-md"
//                   />
//                 </td>
//                 <td className="px-4 py-2 border-b border-gray-200">{video.Title || 'N/A'}</td>
//                 <td className="px-4 py-2 border-b border-gray-200">{video['Channel Title'] || 'N/A'}</td>
//                 <td className="px-4 py-2 border-b border-gray-200">{new Date(video['Published At']).toLocaleDateString()}</td>
//                 <td className="px-4 py-2 border-b border-gray-200">{video.Description || 'No description'}</td>
//                 <td className="px-4 py-2 border-b border-gray-200">
//                   <a href={video.URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                     Watch
//                   </a>
//                 </td>
//                 <td className="px-4 py-2 border-b border-gray-200">{video['Sentiment Analysis']}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   // Fetch YouTube videos
//   const handleScrape = async () => {
//     setLoading(true);
//     setOutput([]);
//     setSummary(''); // Reset summary when fetching new videos
//     setError(null);

//     try {
//       const response = await axios.post(
//         `${API_URL}/scrape_youtube`, // Fixed typo in endpoint name
//         {
//           hashtag,
//           max_results: useCache ? null : maxResults,
//           use_cache: useCache,
//         },
//         {
//           headers: { 'x-access-token': token },
//         }
//       );



//       if (response.data.response) {
//                 setOutput(response.data.response);
        
//                 console.log(response.data.response);
//               } else {
//                 setOutput([]);
//                 setError('No valid data found.');
//               }
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         setError("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         window.alert("Session expired. Please log in again.");
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setError("An error occurred while scraping YouTube.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch summary from the /get-summary endpoint
//   const handleGetSummary = async () => {
//     setSummaryLoading(true);
//     setSummary('');
//     setError(null);

//     try {
//       const response = await axios.post(
//         `${API_URL}/get-summary`,
//         {
//           output
//         },
//         {
//           headers: { 'x-access-token': token },
//         }
//       );

//       if (response.data.summary) {
//         setSummary(response.data.summary);
//       } else {
//         setError('No summary generated.');
//       }
//     } catch (error) {
//       setError("An error occurred while fetching the summary.");
//     } finally {
//       setSummaryLoading(false);
//     }
//   };

//   // Download CSV
//   const downloadCSV = () => {
//     if (!output.length) return;

//     const headers = ['Title', 'Description', 'URL', 'Channel Title', 'Published At', 'Thumbnail', 'Sentiment Analysis'];
//     const csvRows = [
//       headers.join(','),
//       ...output.map(video =>
//         [
//           `"${video.Title || ''}"`,
//           `"${video.Description || ''}"`,
//           `"${video.URL || ''}"`,
//           `"${video['Channel Title'] || ''}"`,
//           `"${new Date(video['Published At']).toLocaleDateString()}"`,
//           `"${video.Thumbnail || ''}"`,
//           `"${video['Sentiment Analysis'] || ''}"`
//         ].join(',')
//       ),
//     ];

//     const csvContent = csvRows.join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'youtube_scraped_posts.csv');
//     link.style.display = 'none';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 px-4">
//       <h2 className="text-4xl text-center text-red-800 font-bold mb-6">YouTube Scraper</h2>

//       <div className="w-full max-w-lg space-y-4">
//         <input
//           type="text"
//           value={hashtag}
//           onChange={(e) => setHashtag(e.target.value)}
//           placeholder="Enter hashtag"
//           className="w-full p-4 text-lg border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2"
//         />
//         <input
//           type="number"
//           value={maxResults}
//           onChange={(e) => setMaxResults(e.target.value)}
//           placeholder="Number of videos to scrape"
//           className={`w-full p-4 text-lg border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 ${
//             useCache ? 'bg-gray-200 cursor-not-allowed' : ''
//           }`}
//           disabled={useCache}
//           required
//         />
//         <div className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             checked={useCache}
//             onChange={(e) => setUseCache(e.target.checked)}
//             className="form-checkbox h-5 w-5 text-red-800"
//           />
//           <span className="text-gray-700">Use cached data</span>
//         </div>
//         <button
//           onClick={handleScrape}
//           className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-800 to-red-400 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
//           disabled={loading}
//         >
//           {loading ? 'Scraping...' : 'Fetch Posts'}
//         </button>
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center mt-10">
//           <div className="w-16 h-16 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin"></div>
//         </div>
//       )}

//       {error && <p className="text-red-600 text-lg mt-4">{error}</p>}
//       {output.length > 0 && (
//         <div className="w-full max-w-5xl">
//           {formatOutput(output)}
//           <div className="flex justify-start space-x-4 mt-4">
//             <button
//               onClick={downloadCSV}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-blue-700 transition-transform duration-300"
//             >
//               Download CSV
//             </button>
//             <button
//               onClick={handleGetSummary}
//               className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
//               disabled={summaryLoading}
//             >
//               {summaryLoading ? 'Fetching Summary...' : 'Get Summary'}
//             </button>
//           </div>
//           {summaryLoading && (
//             <div className="flex justify-center items-center mt-4">
//               <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
//             </div>
//           )}
//           {summary && (
//             <div className="mt-6 bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto border-l-4 border-indigo-500">
//               <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Summary Insights</h3>
//               <div
//                 className="text-gray-700"
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
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import {toast } from 'react-toastify';
import API_URL from './config'; // Adjust the path if necessary

const YoutubeScraper = () => {
  const navigate = useNavigate();
  const [hashtag, setHashtag] = useState('');
  const [maxResults, setMaxResults] = useState(5);
  const [output, setOutput] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCache, setUseCache] = useState(true);
  const token = localStorage.getItem('token');

  // Format the output into a table
  const formatOutput = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return <p>No videos found for the given query.</p>;
    }

    return (
      <div className="mt-6 overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-3 border-b border-gray-300">Thumbnail</th>
              <th className="px-4 py-3 border-b border-gray-300">Title</th>
              <th className="px-4 py-3 border-b border-gray-300">Channel Title</th>
              <th className="px-4 py-3 border-b border-gray-300">Published At</th>
              <th className="px-4 py-3 border-b border-gray-300">Description</th>
              <th className="px-4 py-3 border-b border-gray-300">Video URL</th>
              <th className="px-4 py-3 border-b border-gray-300">Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {data.map((video, index) => (
              <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="px-4 py-2 border-b border-gray-200">
                  <img
                    src={video.Thumbnail || 'https://via.placeholder.com/150'}
                    alt="Thumbnail"
                    className="w-20 h-auto rounded-md"
                  />
                </td>
                <td className="px-4 py-2 border-b border-gray-200">{video.Title || 'N/A'}</td>
                <td className="px-4 py-2 border-b border-gray-200">{video['Channel Title'] || 'N/A'}</td>
                <td className="px-4 py-2 border-b border-gray-200">{new Date(video['Published At']).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b border-gray-200">{video.Description || 'No description'}</td>
                <td className="px-4 py-2 border-b border-gray-200">
                  <a href={video.URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Watch
                  </a>
                </td>
                <td className="px-4 py-2 border-b border-gray-200">{video['Sentiment Analysis']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Fetch YouTube videos
  const handleScrape = async () => {
    setLoading(true);
    setOutput([]);
    setSummary('');
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/scrape_youtube`,
        {
          hashtag,
          max_results: useCache ? null : maxResults,
          use_cache: useCache,
        },
        {
          headers: { 'x-access-token': token },
        }
      );

      if (response.data.response || response.data) {
        if (response.data.response) {
          setOutput(response.data.response);
        } else {
          setOutput(response.data);
        }
      }  else {
        setOutput([]);
        setError('No valid data found.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.alert("Session expired. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("An error occurred while scraping YouTube.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary from the /get-summary endpoint
  const handleGetSummary = async () => {
    setSummaryLoading(true);
    setSummary('');
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/get-summary`,
        { output },
        { headers: { 'x-access-token': token } }
      );

      if (response.data.summary) {
        setSummary(response.data.summary);
      } else {
        setError('No summary generated.');
      }
    } catch (error) {
      setError("An error occurred while fetching the summary.");
    } finally {
      setSummaryLoading(false);
    }
  };


   // Navigate to dashboard
   const goToDashboard = () => {
    navigate('/dashboard'); // Assuming '/dashboard' is your dashboard route
  };


  // Subscribe to newsletter
  const handleSubscribe = async () => {
    if (!hashtag) {
      setError("Please enter a hashtag before subscribing.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_URL}/subscribe_newsletter`,
        {
          platform: "youtube",
          tag: hashtag,
        },
        {
          headers: { 'x-access-token': token },
        }
      );
  
      if (response.data.message) {
        toast.success(`"${hashtag}" subscribed for daily newsletter!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log("Subscription details:", response.data.subscription);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("You are already subscribed to this tag.",
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
      setError("");
      console.error(error);
    }
  };

 
  // Download CSV
  const downloadCSV = () => {
    if (!output.length) return;

    const headers = ['Title', 'Description', 'URL', 'Channel Title', 'Published At', 'Thumbnail', 'Sentiment Analysis'];
    const csvRows = [
      headers.join(','),
      ...output.map(video =>
        [
          `"${video.Title || ''}"`,
          `"${video.Description || ''}"`,
          `"${video.URL || ''}"`,
          `"${video['Channel Title'] || ''}"`,
          `"${new Date(video['Published At']).toLocaleDateString()}"`,
          `"${video.Thumbnail || ''}"`,
          `"${video['Sentiment Analysis'] || ''}"`
        ].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'youtube_scraped_posts.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 relative">
       <button
        onClick={goToDashboard}
        className="absolute top-4 right-4 px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-gray-700 transition-transform duration-300"
      >
        Go to Dashboard
      </button>

     
      <h2 className="text-4xl text-center text-red-800 font-bold mb-6">YouTube Scraper</h2>

      <div className="w-full max-w-lg space-y-4">
        <input
          type="text"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          placeholder="Enter hashtag"
          className="w-full p-4 text-lg border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2"
        />
        <input
          type="number"
          value={maxResults}
          onChange={(e) => setMaxResults(e.target.value)}
          placeholder="Number of videos to scrape"
          className={`w-full p-4 text-lg border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 ${
            useCache ? 'bg-gray-200 cursor-not-allowed' : ''
          }`}
          disabled={useCache}
          required
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useCache}
            onChange={(e) => setUseCache(e.target.checked)}
            className="form-checkbox h-5 w-5 text-red-800"
          />
          <span className="text-gray-700">Use cached data</span>
        </div>
        <button
          onClick={handleScrape}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-800 to-red-400 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
          disabled={loading}
        >
          {loading ? 'Scraping...' : 'Fetch Posts'}
        </button>
        {/* Subscribe Button - Appears only after fetching results */}
        {output.length > 0 && (
          <button
            onClick={handleSubscribe}
            className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-green-700 transition-transform duration-300"
          >
            Subscribe this tag for Newsletter
          </button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {error && <p className="text-red-600 text-lg mt-4">{error}</p>}
      {output.length > 0 && (
        <div className="w-full max-w-5xl">
          {formatOutput(output)}
          <div className="flex justify-start space-x-4 mt-4">
            <button
              onClick={downloadCSV}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-blue-700 transition-transform duration-300"
            >
              Download CSV
            </button>
            <button
              onClick={handleGetSummary}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
              disabled={summaryLoading}
            >
              {summaryLoading ? 'Fetching Summary...' : 'Get Summary'}
            </button>
          </div>
          {summaryLoading && (
            <div className="flex justify-center items-center mt-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
          )}
          {summary && (
            <div className="mt-6 bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto border-l-4 border-indigo-500">
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Summary Insights</h3>
              <div
                className="text-gray-700"
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
