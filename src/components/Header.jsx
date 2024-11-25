
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle the mobile menu

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    navigate('/login'); // Redirect to login page after logout
  };

  // Disable scrolling when the menu is open
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Disable scrolling when the menu is open
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <header className="bg-primary text-white p-3 shadow-custom fixed top-0 left-0 w-full z-50">
    <header className="bg-primary text-white p-3 shadow-custom fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          Scraping Assistant
        </h1>
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          Scraping Assistant
        </h1>

        {/* Mobile Menu Toggle */}
        <div className="block lg:hidden">
          <button
            className="text-white text-3xl focus:outline-none"
            onClick={handleMenuToggle}
            className="text-white text-3xl focus:outline-none"
            onClick={handleMenuToggle}
          >
            {menuOpen ? '✖' : '☰'} {/* Toggle between hamburger and close icon */}
            {menuOpen ? '✖' : '☰'} {/* Toggle between hamburger and close icon */}
          </button>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-6">
          <li>
            <Link to="/home" className="hover:text-secondary transition-colors duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/instagram" className="hover:text-secondary transition-colors duration-300">
              Instagram
            </Link>
          </li>
          <li>
            <Link to="/twitter" className="hover:text-secondary transition-colors duration-300">
              Twitter
            </Link>
          </li>
          <li>
            <Link to="/linkedin" className="hover:text-secondary transition-colors duration-300">
              LinkedIn
            </Link>
          </li>
          <li>
            <Link to="/youtube" className="hover:text-secondary transition-colors duration-300">
              YouTube
            </Link>
          </li>
          <li>
            <Link to="/twitch" className="hover:text-secondary transition-colors duration-300">
              Twitch
            </Link>
          </li>
          <li>
            <Link to="/tiktok" className="hover:text-secondary transition-colors duration-300">
              TikTok
            </Link>
          </li>
        <ul className="hidden lg:flex space-x-6">
          <li>
            <Link to="/home" className="hover:text-secondary transition-colors duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/instagram" className="hover:text-secondary transition-colors duration-300">
              Instagram
            </Link>
          </li>
          <li>
            <Link to="/twitter" className="hover:text-secondary transition-colors duration-300">
              Twitter
            </Link>
          </li>
          <li>
            <Link to="/linkedin" className="hover:text-secondary transition-colors duration-300">
              LinkedIn
            </Link>
          </li>
          <li>
            <Link to="/youtube" className="hover:text-secondary transition-colors duration-300">
              YouTube
            </Link>
          </li>
          <li>
            <Link to="/twitch" className="hover:text-secondary transition-colors duration-300">
              Twitch
            </Link>
          </li>
          <li>
            <Link to="/tiktok" className="hover:text-secondary transition-colors duration-300">
              TikTok
            </Link>
          </li>
        </ul>

        {/* Authentication Buttons */}
        <div className="hidden lg:flex space-x-4">
        <div className="hidden lg:flex space-x-4">
          {!token ? (
            <>
              <Link
                to="/signup"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition duration-300"
              >
                SignUp for Free
              </Link>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition duration-300"
              >
                SignUp for Free
              </Link>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300"
              >
                Login
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition duration-300"
            >
              Logout
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleMenuToggle} // Close menu on clicking overlay
        >
          <div
            className="bg-primary text-white fixed top-0 right-0 w-4/5 max-w-xs h-full p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent menu from closing when clicking inside
          >
            <ul className="space-y-6 text-lg">
              <li>
                <Link
                  to="/home"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/instagram"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  to="/twitter"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  to="/linkedin"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  to="/youtube"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  YouTube
                </Link>
              </li>
              <li>
                <Link
                  to="/twitch"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  Twitch
                </Link>
              </li>
              <li>
                <Link
                  to="/tiktok"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  TikTok
                </Link>
              </li>
            </ul>

            {/* Authentication Buttons */}
            <div className="mt-6">
              {!token ? (
                <>
                  <Link
                    to="/signup"
                    className="block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition duration-300 mb-4"
                    onClick={handleMenuToggle}
                  >
                    SignUp for Free
                  </Link>
                  <Link
                    to="/login"
                    className="block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300"
                    onClick={handleMenuToggle}
                  >
                    Login
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    handleMenuToggle();
                  }}
                  className="block bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition duration-300"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleMenuToggle} // Close menu on clicking overlay
        >
          <div
            className="bg-primary text-white fixed top-0 right-0 w-4/5 max-w-xs h-full p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent menu from closing when clicking inside
          >
            <ul className="space-y-6 text-lg">
              <li>
                <Link
                  to="/home"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/instagram"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  to="/twitter"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  to="/linkedin"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  to="/youtube"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  YouTube
                </Link>
              </li>
              <li>
                <Link
                  to="/twitch"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  Twitch
                </Link>
              </li>
              <li>
                <Link
                  to="/tiktok"
                  className="block hover:text-secondary transition-colors duration-300"
                  onClick={handleMenuToggle}
                >
                  TikTok
                </Link>
              </li>
            </ul>

            {/* Authentication Buttons */}
            <div className="mt-6">
              {!token ? (
                <>
                  <Link
                    to="/signup"
                    className="block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition duration-300 mb-4"
                    onClick={handleMenuToggle}
                  >
                    SignUp for Free
                  </Link>
                  <Link
                    to="/login"
                    className="block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300"
                    onClick={handleMenuToggle}
                  >
                    Login
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    handleMenuToggle();
                  }}
                  className="block bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition duration-300"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;