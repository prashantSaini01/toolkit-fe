import React from "react";
import { Routes, Route } from "react-router-dom";
import Abrassio from './pages/abrassio/Scrapion';
import InstagramScraper from "./pages/abrassio/InstagramScraper";
import TwitterScraper from "./pages/abrassio/TwitterScraper";
import LinkedinScraper from "./pages/abrassio/LinkedinScraper";
import SignUp from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import YoutubeScraper from "./pages/abrassio/Youtube";
import TwitchScraper from "./pages/abrassio/Twitch";
import TikTokScraper from "./pages/abrassio/TiktokScrapper";
import Homepage from "./pages/Homepage";
import ContentGenerator from "./pages/writer/Inkwave";
import Dashboard from "./pages/abrassio/Dashboard";
import Lawbot from "./pages/docuChat/DocTalks";
import WhyUs from "./pages/writer/WhyContentGenerator";
import Users from "./pages/abrassio/Users";

const RoutesConfig = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      {/* Protected route wrapper */}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Homepage />} />
        <Route path="/scrapion" element={<Abrassio />} />
        <Route path="/instagram" element={<InstagramScraper />} />
        <Route path="/twitter" element={<TwitterScraper />} />
        <Route path="/linkedin" element={<LinkedinScraper />} />
        <Route path="/youtube" element={<YoutubeScraper />} />
        <Route path="/twitch" element={<TwitchScraper />} />
        <Route path="/tiktok" element={<TikTokScraper />} />
        <Route path="/inkwave" element={<ContentGenerator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctalks" element={<Lawbot />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  );
};

export default RoutesConfig;
