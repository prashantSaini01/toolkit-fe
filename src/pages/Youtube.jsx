import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import API_URL from './config'; // Adjust the path if necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faUser, faCalendar, faAlignLeft, faLink } from '@fortawesome/free-solid-svg-icons';

const YoutubeScraper = () => {
  const navigate = useNavigate();
  const [hashtag, setHashtag] = useState('');
  const [maxResults, setMaxResults] = useState(5);
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCache, setUseCache] = useState(true);
  const token = localStorage.getItem('token');

  // Define formatOutput function inside the component
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
                  <a
                    href={video.URL}
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
      </div>
    );
  };

  const handleScrape = async () => {
    setLoading(true);
    setOutput([]);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/scrape_youtube`,
        {
          hashtag,
          max_results: useCache ? null : maxResults, // Send null if useCache is true
          use_cache: useCache,
        },
        {
          headers: { 'x-access-token': token },
        }
      );

      if (response.data.response) {
        setOutput(response.data.response);
      } else {
        setOutput([]);
        setError('No valid data found.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.alert("Session expired. Please log in again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("An error occurred while scraping YouTube.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!output.length) return;

    const headers = ['Title', 'Description', 'URL', 'Channel Title', 'Published At', 'Thumbnail'];

    const csvRows = [
      headers.join(','),
      ...output.map(video =>
        [
          `"${video.Title}"`,
          `"${video.Description}"`,
          `"${video.URL}"`,
          `"${video['Channel Title']}"`,
          `"${new Date(video['Published At']).toLocaleDateString()}"`,
          `"${video.Thumbnail}"`
        ].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'youtube_scrap_posts.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-grey flex flex-col items-center justify-center py-8 px-4">
      <h2 className="text-4xl text-center text-red-800 font-bold mb-6">YouTube Scraper</h2>

      <div className="w-full max-w-lg space-y-4">
        <input
          type="text"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          placeholder="Enter hashtag"
          className="w-full p-4 text-lg border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 "
        />
        <input
          type="number"
          value={maxResults}
          onChange={(e) => setMaxResults(e.target.value)}
          placeholder="Number of videos to scrape"
          className={`w-full p-4 text-lg border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 ${
            useCache ? 'bg-gray-200 cursor-not-allowed' : ''
          }`}
          disabled={useCache} // Disable the input if useCache is true
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
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {error && <p className="text-red-600 text-lg">{error}</p>}
      {output.length > 0 && (
        <>
          {formatOutput(output)}
          <div className="w-full flex justify-start mt-4">
            <button
              onClick={downloadCSV}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-grey-900 transition-transform duration-300"
            >
              Download CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default YoutubeScraper;