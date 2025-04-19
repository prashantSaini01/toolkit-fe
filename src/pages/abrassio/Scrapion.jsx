import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTwitch,
  FaTiktok,
  FaUsers,
  FaChartBar
} from "react-icons/fa";

const Abrassio = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToUsers = () => {
    navigate("/users");
  };

  return (
    <div className="text-center p-20 bg-gradient-to-b from-blue-50 to-gray-100 relative">
    {/* Top Right Buttons */}
    <div className="absolute top-4 right-4 flex space-x-4">
      <button
        onClick={goToDashboard}
        className="bg-blue-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
      >
        <FaChartBar className="text-lg" />
        <span>Dashboard</span>
      </button>
      <button
        onClick={goToUsers}
        className="bg-green-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-green-700 transition duration-300 flex items-center gap-2"
      >
        <FaUsers className="text-lg" />
        <span>Users</span>
      </button>
    </div>

      {/* Hero Section */}
      <div className="mb-16">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Scraping Assistant
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Web scraping is a powerful tool for collecting data from various
          online platforms. Select a platform to start extracting valuable
          insights.
        </p>
        <p className="text-2xl font-semibold text-blue-600 mb-6">
          Choose a platform to start scraping
        </p>
      </div>

      {/* Platform Scrapers */}
      <div className="flex justify-center flex-wrap gap-8">
         {/* YouTube Scraper */}
         <div className="relative flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-60 hover:scale-105 transition-transform duration-300 hover:bg-blue-50 overflow-hidden">
          <FaYoutube className="text-4xl text-red-600 mb-4 relative z-10" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2 relative z-10">
            YouTube Scraper
          </h3>
          <p className="text-gray-600 mb-4 relative z-10">
            Gather video details, comments, and channel statistics from YouTube.
          </p>
          <Link
            to="/youtube"
            className="bg-gradient-to-r from-red-800 to-red-400 text-white py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 relative z-10"
          >
            Start Scraping
          </Link>
        </div>
         {/* Twitch Scraper */}
         <div className="relative flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-60 hover:scale-105 transition-transform duration-300 hover:bg-blue-50 overflow-hidden">
          <FaTwitch className="text-4xl text-purple-600 mb-4 relative z-10" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2 relative z-10">
            Twitch Scraper
          </h3>
          <p className="text-gray-600 mb-4 relative z-10">
            Retrieve streams, chat messages, and viewer data from Twitch.
          </p>
          <Link
            to="/twitch"
            className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 relative z-10"
          >
            Start Scraping
          </Link>
        </div>
{/* Twitter Scraper */}
<div className="relative flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-60 hover:scale-105 transition-transform duration-300 hover:bg-blue-50 overflow-hidden">
  <div className="absolute top-0 left-0 w-[150%] h-3 bg-black transform -rotate-45 -translate-x-1/4 translate-y-[-50%] opacity-70 shadow-md flex items-center justify-center">
    <span className="text-white text-[10px] whitespace-nowrap">
      Coming Soon ..........................................................
    </span>
  </div>
  <FaTwitter className="text-4xl text-blue-500 mb-4 relative z-10" />
  <h3 className="text-xl font-semibold text-gray-800 mb-2 relative z-10">
    Twitter Scraper
  </h3>
  <p className="text-gray-600 mb-4 relative z-10">
    Collect tweets, hashtags, and user information from Twitter.
  </p>
  <Link
    to="/twitter"
    className={`bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 relative z-10 ${
      true ? 'pointer-events-none opacity-50' : 'hover:scale-105'
    }`}
  >
    Start Scraping
  </Link>
</div>

{/* Instagram Scraper */}
<div className="relative flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-60 hover:scale-105 transition-transform duration-300 hover:bg-blue-50 overflow-hidden">
  <div className="absolute top-0 left-0 w-[150%] h-3 bg-black transform -rotate-45 -translate-x-1/4 translate-y-[-50%] opacity-70 shadow-md flex items-center justify-center">
    <span className="text-white text-[10px] whitespace-nowrap">
      Coming Soon ..........................................................
    </span>
  </div>
  <FaInstagram className="text-4xl text-pink-500 mb-4 relative z-10" />
  <h3 className="text-xl font-semibold text-gray-800 mb-2 relative z-10">
    Instagram Scraper
  </h3>
  <p className="text-gray-600 mb-4 relative z-10">
    Extract user profiles, posts, comments, and likes from Instagram.
  </p>
  <Link
    to="/instagram"
    className={`bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 relative z-10 ${
      true ? 'pointer-events-none opacity-50' : 'hover:scale-105'
    }`}
  >
    Start Scraping
  </Link>
</div>

{/* TikTok Scraper */}
<div className="relative flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-60 hover:scale-105 transition-transform duration-300 hover:bg-blue-50 overflow-hidden">
  <div className="absolute top-0 left-0 w-[150%] h-3 bg-black transform -rotate-45 -translate-x-1/4 translate-y-[-50%] opacity-70 shadow-md flex items-center justify-center">
    <span className="text-white text-[10px] whitespace-nowrap">
      Coming Soon ..........................................................
    </span>
  </div>
  <FaTiktok className="text-4xl text-black mb-4 relative z-10" />
  <h3 className="text-xl font-semibold text-gray-800 mb-2 relative z-10">
    TikTok Scraper
  </h3>
  <p className="text-gray-600 mb-4 relative z-10">
    Extract TikTok user profiles, videos, likes, and comments.
  </p>
  <Link
    to="/tiktok"
    className={`bg-gradient-to-r from-gray-900 to-gray-600 text-white py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 relative z-10 ${
      true ? 'pointer-events-none opacity-50' : 'hover:scale-105'
    }`}
  >
    Start Scraping
  </Link>
</div>

{/* LinkedIn Scraper */}
<div className="relative flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-60 hover:scale-105 transition-transform duration-300 hover:bg-blue-50 overflow-hidden">
  <div className="absolute top-0 left-0 w-[150%] h-3 bg-black transform -rotate-45 -translate-x-1/4 translate-y-[-50%] opacity-70 shadow-md flex items-center justify-center">
    <span className="text-white text-[10px] whitespace-nowrap">
      Coming Soon ..........................................................
    </span>
  </div>
  <FaLinkedin className="text-4xl text-blue-700 mb-4 relative z-10" />
  <h3 className="text-xl font-semibold text-gray-800 mb-2 relative z-10">
    LinkedIn Scraper
  </h3>
  <p className="text-gray-600 mb-4 relative z-10">
    Scrape profiles, connections, and job listings from LinkedIn.
  </p>
  <Link
    to="/linkedin"
    className={`bg-gradient-to-r from-blue-800 to-purple-800 text-white py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 relative z-10 ${
      true ? 'pointer-events-none opacity-50' : 'hover:scale-105'
    }`}
  >
    Start Scraping
  </Link>
</div>

       
      </div>

      {/* Feature Cards Section */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-blue-50 p-8 rounded-lg shadow-lg text-center hover:bg-blue-100 transition duration-300">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Gain Competitive Insights
          </h3>
          <p className="text-gray-700">
            Web scraping enables you to collect competitor data, analyze their
            strategies, and adjust your approach for market leadership.
          </p>
        </div>

        <div className="bg-green-50 p-8 rounded-lg shadow-lg text-center hover:bg-green-100 transition duration-300">
          <h3 className="text-2xl font-semibold text-green-600 mb-4">
            Automate Data Collection
          </h3>
          <p className="text-gray-700">
            Eliminate manual data entry by automating the extraction of
            information from websites, improving efficiency and accuracy.
          </p>
        </div>

        <div className="bg-yellow-50 p-8 rounded-lg shadow-lg text-center hover:bg-yellow-100 transition duration-300">
          <h3 className="text-2xl font-semibold text-yellow-600 mb-4">
            Unlock Market Trends
          </h3>
          <p className="text-gray-700">
            Discover market trends and audience behaviors by scraping data from
            multiple sources, helping you make informed decisions.
          </p>
        </div>

        <div className="bg-purple-50 p-8 rounded-lg shadow-lg text-center hover:bg-purple-100 transition duration-300">
          <h3 className="text-2xl font-semibold text-purple-600 mb-4">
            Collect Social Media Insights
          </h3>
          <p className="text-gray-700">
            Leverage web scraping to gather social media data, track mentions,
            sentiment, and influencer activity for better engagement strategies.
          </p>
        </div>

        <div className="bg-red-50 p-8 rounded-lg shadow-lg text-center hover:bg-red-100 transition duration-300">
          <h3 className="text-2xl font-semibold text-red-600 mb-4">
            Real-Time Data Monitoring
          </h3>
          <p className="text-gray-700">
            Scrape real-time data such as product prices, stock availability,
            and news updates to keep your business agile and responsive.
          </p>
        </div>

        <div className="bg-orange-50 p-8 rounded-lg shadow-lg text-center hover:bg-orange-100 transition duration-300">
          <h3 className="text-2xl font-semibold text-orange-600 mb-4">
            Enhance Decision-Making
          </h3>
          <p className="text-gray-700">
            Gather and analyze data across different platforms to inform your
            decision-making process and drive business success.
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Abrassio;
