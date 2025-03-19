import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Abrassio from './pages/Abrassio';
import InstagramScraper from './pages/InstagramScraper';
import TwitterScraper from './pages/TwitterScraper';
import LinkedinScraper from './pages/LinkedinScraper';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import YoutubeScraper from './pages/Youtube';
import TwitchScraper from './pages/Twitch';
import TikTokScraper from './pages/TiktokScrapper';
import { ToastContainer } from 'react-toastify';
import Homepage from './pages/Homepage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* ToastContainer for global notifications */}
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

        {/* Header */}
        <Header />

        {/* Main content area */}
        <main className="flex-grow container mx-auto p-4 mt-20">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<  Homepage/>} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route path="/home" element={<PrivateRoute><Homepage /></PrivateRoute>} />
              <Route path="/abrassio" element={<PrivateRoute><Abrassio /></PrivateRoute>} />
              <Route path="/instagram" element={<PrivateRoute><InstagramScraper /></PrivateRoute>} />
              <Route path="/twitter" element={<PrivateRoute><TwitterScraper /></PrivateRoute>} />
              <Route path="/linkedin" element={<PrivateRoute><LinkedinScraper /></PrivateRoute>} />
              <Route path="/youtube" element={<PrivateRoute><YoutubeScraper /></PrivateRoute>} />
              <Route path="/twitch" element={<PrivateRoute><TwitchScraper/></PrivateRoute>} />
              <Route path="/tiktok" element={<PrivateRoute><TikTokScraper/></PrivateRoute>} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
