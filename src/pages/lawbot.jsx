// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SessionSelector from '../components/SessionSelector';
// import DocumentUploader from '../components/DocumentUpload';
// import ChatInterface from '../components/ChatInterface';
// // import API_URL from "./config";

// axios.defaults.baseURL = API_URL;

// function Lawbot() {
//   const [sessions, setSessions] = useState([]);
//   const [currentSession, setCurrentSession] = useState(null);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [uploadedPdfs, setUploadedPdfs] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   const fetchSessions = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get('/sessions');
//       setSessions(response.data);
//     } catch (error) {
//       console.error('Failed to fetch sessions:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const createNewSession = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.post('/sessions');
//       const newSessionId = response.data.session_id;
//       setCurrentSession(newSessionId);
//       setSessions([...sessions, newSessionId]);
//       setChatHistory([]);
//       setUploadedPdfs([]);
//     } catch (error) {
//       console.error('Failed to create new session:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const selectSession = async (sessionId) => {
//     setIsLoading(true);
//     setCurrentSession(sessionId);
//     try {
//       const messagesResponse = await axios.get(`/sessions/${sessionId}/messages`);
//       setChatHistory(messagesResponse.data);
//       const pdfsResponse = await axios.get(`/sessions/${sessionId}/pdfs`);
//       setUploadedPdfs(pdfsResponse.data);
//     } catch (error) {
//       console.error('Failed to load session:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteSession = async () => {
//     if (currentSession) {
//       setIsLoading(true);
//       try {
//         await axios.delete(`/sessions/${currentSession}`);
//         setCurrentSession(null);
//         setChatHistory([]);
//         setUploadedPdfs([]);
//         fetchSessions();
//       } catch (error) {
//         console.error('Failed to delete session:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const fetchChatHistory = async () => {
//     if (currentSession) {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(`/sessions/${currentSession}/messages`);
//         setChatHistory(response.data);
//       } catch (error) {
//         console.error('Failed to fetch chat history:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const fetchUploadedPdfs = async () => {
//     if (currentSession) {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(`/sessions/${currentSession}/pdfs`);
//         setUploadedPdfs(response.data);
//       } catch (error) {
//         console.error('Failed to fetch PDFs:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex items-center">
//             <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <div className="ml-4">
//               <h1 className="text-2xl font-bold text-gray-900">Advanced PDF Chat Assistant</h1>
//               <p className="text-sm text-gray-500">Upload legal documents and chat with an AI assistant about their content.</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="w-full md:w-1/3 lg:w-1/4">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Session Management</h2>

//               <div className="flex flex-wrap gap-3 mb-6">
//                 <button
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//                   onClick={createNewSession}
//                   disabled={isLoading}
//                 >
//                   <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                   New Session
//                 </button>

//                 {currentSession && (
//                   <button
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
//                     onClick={deleteSession}
//                     disabled={isLoading}
//                   >
//                     <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                     </svg>
//                     Delete
//                   </button>
//                 )}
//               </div>

//               <SessionSelector
//                 sessions={sessions}
//                 currentSession={currentSession}
//                 onSelect={selectSession}
//                 isLoading={isLoading}
//               />

//               {currentSession && (
//                 <>
//                   <div className="mt-6">
//                     <DocumentUploader
//                       sessionId={currentSession}
//                       onUploadSuccess={fetchUploadedPdfs}
//                     />
//                   </div>

//                   <div className="mt-6">
//                     <h3 className="text-md font-medium text-gray-900 mb-3">Uploaded Documents</h3>
//                     <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
//                       {uploadedPdfs.length > 0 ? (
//                         uploadedPdfs.map((pdf, index) => (
//                           <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
//                             <svg className="h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                             </svg>
//                             <span className="text-sm text-gray-700 truncate">{pdf}</span>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-sm text-gray-500 italic">No documents uploaded yet.</p>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="w-full md:w-2/3 lg:w-3/4">
//             <div className="bg-white rounded-lg shadow-md p-6 h-full">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Chat with Your Documents</h2>

//               {currentSession ? (
//                 <ChatInterface
//                   sessionId={currentSession}
//                   chatHistory={chatHistory}
//                   onNewMessage={fetchChatHistory}
//                   isLoading={isLoading}
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg p-12">
//                   <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                   </svg>
//                   <p className="mt-2 text-sm text-gray-500">Please select or create a session to start chatting.</p>
//                   <button
//                     className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     onClick={createNewSession}
//                   >
//                     Create New Session
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Lawbot;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SessionSelector from "../components/SessionSelector";
import DocumentUploader from "../components/DocumentUpload";
import ChatInterface from "../components/ChatInterface";
// import API_URL from './config';

axios.defaults.baseURL = API_URL;

function Lawbot() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized fetch functions
  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/sessions");
      setSessions(response.data);
    } catch (error) {
      setError("Failed to fetch sessions. Please try again.");
      console.error("Failed to fetch sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSessionData = useCallback(async (sessionId) => {
    setIsLoading(true);
    setError(null);
    try {
      const [messagesResponse, pdfsResponse] = await Promise.all([
        axios.get(`/sessions/${sessionId}/messages`),
        axios.get(`/sessions/${sessionId}/pdfs`),
      ]);
      setChatHistory(messagesResponse.data);
      setUploadedPdfs(pdfsResponse.data);
    } catch (error) {
      setError("Failed to load session data.");
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createNewSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("/sessions");
      const newSessionId = response.data.session_id;
      setCurrentSession(newSessionId);
      setSessions((prev) => [...prev, newSessionId]);
      setChatHistory([]);
      setUploadedPdfs([]);
    } catch (error) {
      setError("Failed to create new session.");
      console.error("Failed to create new session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSession = (sessionId) => {
    setCurrentSession(sessionId);
    if (sessionId) fetchSessionData(sessionId);
  };

  const deleteSession = async () => {
    if (!currentSession) return;
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`/sessions/${currentSession}`);
      setCurrentSession(null);
      setChatHistory([]);
      setUploadedPdfs([]);
      await fetchSessions();
    } catch (error) {
      setError("Failed to delete session.");
      console.error("Failed to delete session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = () => fetchSessionData(currentSession);

  const handleUploadSuccess = () => fetchSessionData(currentSession);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-indigo-600"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900">
                PDF Chat Assistant
              </h1>
              <p className="text-sm text-gray-600">
                Analyze legal documents with AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-indigo-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Sessions
              </h2>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={createNewSession}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New
                  </button>
                  {currentSession && (
                    <button
                      onClick={deleteSession}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <SessionSelector
                  sessions={sessions}
                  currentSession={currentSession}
                  onSelect={selectSession}
                  isLoading={isLoading}
                />

                {currentSession && (
                  <>
                    <DocumentUploader
                      sessionId={currentSession}
                      onUploadSuccess={handleUploadSuccess}
                    />
                    <div className="mt-6">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">
                        Documents
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {uploadedPdfs.length > 0 ? (
                          uploadedPdfs.map((pdf, index) => (
                            <div
                              key={index}
                              className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <svg
                                className="h-5 w-5 text-gray-500 mr-2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                fill="none"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm text-gray-700 truncate">
                                {pdf}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No documents uploaded.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>

          {/* Chat Area */}
          <section className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chat</h2>
              {currentSession ? (
                <ChatInterface
                  sessionId={currentSession}
                  chatHistory={chatHistory}
                  onNewMessage={handleNewMessage}
                  isLoading={isLoading}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 text-center">
                  <svg
                    className="h-12 w-12 text-gray-400 mb-4"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p className="text-gray-600 mb-4">
                    Start by creating or selecting a session
                  </p>
                  <button
                    onClick={createNewSession}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    Create Session
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default React.memo(Lawbot);
