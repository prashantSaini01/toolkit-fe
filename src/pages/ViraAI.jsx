import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "./config";

const ViraAI = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalls = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/calls`, {
          headers: {
            "x-access-token": token,
          },
        });

        setCalls(response.data);
        if (response.data.length > 0) {
          setSelectedCall(response.data[0]);
        }
      } catch (err) {
        console.error("Error fetching calls:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to fetch call entries.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [token]);

  useEffect(() => {
    if (!selectedCall) return;

    const fetchTranscript = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_URL}/call-transcript/${selectedCall._id}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        setTranscript(response.data.transcript);
      } catch (err) {
        console.error("Error fetching transcript:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to fetch transcript.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [selectedCall, token]);

  const handleCallSelection = (callId) => {
    const selected = calls.find((call) => call._id === callId);
    setSelectedCall(selected);
  };

  const goToHome = () => navigate("/");

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col py-12 px-6 relative">
      <button
        onClick={goToHome}
        className="absolute top-6 right-6 px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 transform group-hover:rotate-12 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="w-full max-w-5xl mx-auto space-y-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-700 animate-pulse">
            Vira AI Call Logs
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            View and manage your call logs and transcripts
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <label className="block text-lg font-semibold text-indigo-800 mb-2">
                All Entries
              </label>
              <select
                value={selectedCall?._id || ""}
                onChange={(e) => handleCallSelection(e.target.value)}
                className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {calls.map((call) => (
                  <option key={call._id} value={call._id}>
                    {`${formatDateTime(call.callStartTime)} - ${formatDateTime(
                      call.callEndTime
                    )}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-lg font-semibold text-indigo-800 mb-2">
                Email
              </label>
              <div className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-indigo-200 rounded-xl text-gray-700 shadow-sm">
                {selectedCall?.email || "N/A"}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-lg font-semibold text-indigo-800 mb-2">
                Total Duration of Call
              </label>
              <div className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-indigo-200 rounded-xl text-gray-700 shadow-sm">
                {selectedCall?.callDuration || "N/A"}
              </div>
            </div>
          </div>
        </div>

       

        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Conversation
          </h3>
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
            </div>
          )}
          {error && !loading && (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && transcript.length === 0 && (
            <p className="text-gray-500 italic text-center">
              No transcript available for this call.
            </p>
          )}
          {!loading && !error && transcript.length > 0 && (
            <div className="space-y-4">
              {transcript.map((entry, index) => (
                <div key={index} className="p-4 bg-indigo-50 rounded-lg">
                  <p>
                    <strong className="text-indigo-800">User:</strong>{" "}
                    {entry.user}
                  </p>
                  <p>
                    <strong className="text-indigo-800">Agent:</strong>{" "}
                    {entry.gpt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-100 overflow-x-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 6h18M3 14h18M3 18h18"
              />
            </svg>
            All Call Logs
          </h3>
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
            </div>
          )}
          {error && !loading && (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && calls.length === 0 && (
            <p className="text-gray-500 italic text-center">
              No call logs available.
            </p>
          )}
          {!loading && !error && calls.length > 0 && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="p-4 text-indigo-800 font-semibold border-b-2 border-indigo-200">
                    Call Start Time
                  </th>
                  <th className="p-4 text-indigo-800 font-semibold border-b-2 border-indigo-200">
                    Call End Time
                  </th>
                  <th className="p-4 text-indigo-800 font-semibold border-b-2 border-indigo-200">
                    Call Duration
                  </th>
                  <th className="p-4 text-indigo-800 font-semibold border-b-2 border-indigo-200">
                    Transcript
                  </th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call) => (
                  <tr
                    key={call._id}
                    className="hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <td className="p-4 border-b border-indigo-100">
                      {formatDateTime(call.callStartTime)}
                    </td>
                    <td className="p-4 border-b border-indigo-100">
                      {formatDateTime(call.callEndTime)}
                    </td>
                    <td className="p-4 border-b border-indigo-100">
                      {call.callDuration || "N/A"}
                    </td>
                    <td className="p-4 border-b border-indigo-100">
                      {call.transcript.length > 0 ? (
                        <ul className="space-y-1">
                          {call.transcript.slice(0, 1).map((entry, index) => (
                            <li key={index}>
                              <strong>User:</strong> {entry.user} <br />
                              <strong>Agent:</strong> {entry.gpt}
                            </li>
                          ))}
                          {call.transcript.length > 1 && (
                            <span className="text-indigo-600 italic">
                              ... (see full transcript below)
                            </span>
                          )}
                        </ul>
                      ) : (
                        "No transcript available"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ViraAI;
