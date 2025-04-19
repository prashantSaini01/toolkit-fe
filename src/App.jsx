import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import RoutesConfig from "../src/Routes"; // Adjust the import path as necessary

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wrapper for all routes */}
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow container mx-auto p-4 mt-20">
                <Suspense fallback={<div>Loading...</div>}>
                  <RoutesConfig /> {/* <-- Inject your route definitions here */}
                </Suspense>
              </main>
              <Footer />
              <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
