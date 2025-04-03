import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/auth/authSlice"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        // Delay navigation to allow toast to display
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-lg">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Please enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
              required
              aria-label="Username"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
              required
              aria-label="Password"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
            aria-label="Login"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up for free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;