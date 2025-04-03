/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../../redux/slices/auth/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(formData)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        // Delay navigation to allow toast to be visible
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-center">Signup</h1>
        <br />
        <p className="text-center text-gray-600 mb-4">Create an account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="mb-4 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
            disabled={isLoading}
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="mb-4 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
            disabled={isLoading}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="mb-4 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="mb-4 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
            disabled={isLoading}
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;