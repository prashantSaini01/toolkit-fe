import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center p-20 bg-light">
      <h2 className="text-5xl font-bold text-dark mb-12">Welcome to Scraping Assistant</h2>
      <p className="mb-12 text-xl text-gray-700">Choose a platform to start scraping:</p>
      <div className="flex justify-center flex-wrap gap-6">
        <Link to="/instagram" className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
          Instagram Scraper
        </Link>
        <Link to="/twitter" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
          Twitter Scraper
        </Link>
        <Link to="/linkedin" className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
          LinkedIn Scraper
        </Link>
        <Link to="/youtube" className="bg-gradient-to-r from-red-800 to-red-400 text-white py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
          Youtube Scraper
        </Link>
        <Link 
  to="/twitch" 
  className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
>
  Twitch Scraper
</Link>

<Link 
  to="/tiktok" 
  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
>
  TikTok Scraper
</Link>
      </div>
    </div>
  );
};

export default Home;
