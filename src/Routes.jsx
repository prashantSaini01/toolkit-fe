import React from "react";
import { Routes, Route } from "react-router-dom";
import Abrassio from './pages/abrassio/Abrassio'
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
import ContentGenerator from "./pages/writer/ContentGenerator";
import Dashboard from "./pages/abrassio/Dashboard";
import Lawbot from "./pages/docuChat/lawbot";
import WhyUs from "./pages/writer/WhyContentGenerator";
import ViraAI from "./pages/viraAI/ViraAI";
import AIvertise from "./pages/aivertise/Aivertise";
import Users from "./pages/abrassio/Users";

const RoutesConfig = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/abrassio" element={<Abrassio />} />
        <Route path="/instagram" element={<InstagramScraper />} />
        <Route path="/twitter" element={<TwitterScraper />} />
        <Route path="/linkedin" element={<LinkedinScraper />} />
        <Route path="/youtube" element={<YoutubeScraper />} />
        <Route path="/twitch" element={<TwitchScraper />} />
        <Route path="/tiktok" element={<TikTokScraper />} />
        <Route path="/socialspark" element={<WhyUs />} />
        <Route path="/try-it" element={<ContentGenerator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/legalbot" element={<Lawbot />} />
        <Route path="/vira-ai" element={<ViraAI />} />
        <Route path="/aivertise" element={<AIvertise />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  );
};

export default RoutesConfig;
