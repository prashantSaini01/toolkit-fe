import React from "react";
import { Link } from "react-router-dom";
import { FaRobot, FaStar, FaBookOpen, FaPhone, FaVideo } from "react-icons/fa";

const Homepage = () => {
  const welcomeText = "Welcome to Toolkit Studio".split(" ");

  return (
    <div className="text-center p-20 bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Hero Section */}
      <div className="mb-16">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          {welcomeText.map((word, index) => (
            <span
              key={index}
              className={`inline-block mr-2 animate-wordFade ${
                word === "Toolkit" ? "text-red-600" : "text-gray-900"
              }`}
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>

      {/* Main Cards Section */}
      <div className="flex justify-center flex-wrap gap-12 mb-16">

        {/* Abrassio*/}
        <div className="flex flex-col items-center bg-gradient-to-br from-indigo-100 to-indigo-200 p-8 rounded-xl shadow-xl w-80 transition-transform duration-300 hover:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[150%] h-6 bg-indigo-400 transform -rotate-45 -translate-x-1/4 translate-y-[-50%] opacity-70 shadow-md flex items-center justify-center">
            <span className="text-white text-xs font-semibold whitespace-nowrap">................. Toolkit ........................................................................</span>
          </div>
          <FaRobot className="text-5xl text-blue-600 mb-6" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Scrapion</h3>
          <div className="text-gray-700 mb-6">
            <p className="text-base mb-2">
              A powerful scraping assistant for web data extraction.
            </p>
            <p className="text-base">
              Collects insights from various online platforms efficiently.
            </p>
          </div>
          <Link
            to="/scrapion"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-16 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Use
          </Link>


        </div>
        
        {/* Social Spark*/}
        <div className="flex flex-col items-center bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-xl shadow-xl w-80 transition-transform duration-300 hover:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[150%] h-6 bg-pink-400 transform -rotate-45 -translate-x-1/4 translate-y-[-50%] opacity-70 shadow-md flex items-center justify-center">
            <span className="text-white text-xs font-semibold whitespace-nowrap">................. Toolkit ........................................................................</span>
          </div>
          <FaStar className="text-5xl text-purple-600 mb-6" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Inkwave
          </h3>
          <div className="text-gray-700 mb-6">
            <p className="text-base mb-2">
              Generates engaging social media post content.
            </p>
            <p className="text-base">
              Boosts online presence with creative automation.
            </p>
          </div>
          <Link
            to="/inkwave"
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-16 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Use
          </Link>

        </div>
        
       
        {/* DocuChat */}
        <div className="flex flex-col items-center bg-gradient-to-br from-green-100 to-green-200 ():to-pink-200 p-8 rounded-xl shadow-xl w-80 transition-transform duration-300 hover:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[150%] h-6 bg-green-400 transform -rotate-45 -translate-x-1/4 translate-y-[-50%] opacity-70 shadow-md flex items-center justify-center">
            <span className="text-white text-xs font-semibold whitespace-nowrap">................. Toolkit ........................................................................</span>
          </div>
          <FaBookOpen className="text-5xl text-green-600 mb-6" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          DocTalks
          </h3>
          <div className="text-gray-700 mb-6">
            <p className="text-base mb-2">
              Assists with legal document analysis and insights.
            </p>
            <p className="text-base">
              Streamlines compliance and research tasks effortlessly.
            </p>
          </div>
          <Link
            to="/doctalks"
            className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-16 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Use
          </Link>
        </div>
      </div>

      {/* Achievement Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Achievement Card 1 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg text-center hover:bg-blue-200 transition duration-300">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">
            Innovate Faster
          </h3>
          <p className="text-gray-700">
            Leverage AI tools to accelerate your development process.
          </p>
        </div>

        {/* Achievement Card 2 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg text-center hover:bg-green-200 transition duration-300">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">
            Boost Efficiency
          </h3>
          <p className="text-gray-700">
            Automate tasks to save time and focus on what matters.
          </p>
        </div>

        {/* Achievement Card 3 */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-xl shadow-lg text-center hover:bg-yellow-200 transition duration-300">
          <h3 className="text-2xl font-semibold text-yellow-700 mb-4">
            Drive Engagement
          </h3>
          <p className="text-gray-700">
            Create impactful content to connect with your audience.
          </p>
        </div>

        {/* Achievement Card 4 */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-xl shadow-lg text-center hover:bg-indigo-200 transition duration-300">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
            Enhance Support
          </h3>
          <p className="text-gray-700">
            Deliver 24/7 customer service with AI receptionists.
          </p>
        </div>

        {/* Achievement Card 5 */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-xl shadow-lg text-center hover:bg-pink-200 transition duration-300">
          <h3 className="text-2xl font-semibold text-pink-700 mb-4">
            Amplify Reach
          </h3>
          <p className="text-gray-700">
            Produce captivating videos to expand your brand’s visibility.
          </p>
        </div>

        {/* Achievement Card 6 */}
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 rounded-xl shadow-lg text-center hover:bg-cyan-200 transition duration-300">
          <h3 className="text-2xl font-semibold text-cyan-700 mb-4">
            Scale Smarter
          </h3>
          <p className="text-gray-700">
            Utilize AI to optimize growth and streamline operations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
