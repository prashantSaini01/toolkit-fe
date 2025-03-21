// import React from 'react';
 
// function SessionSelector({ sessions, currentSession, onSelect, isLoading }) {
//   return (
//     <div className="space-y-3">
//       <label htmlFor="session-select" className="block text-sm font-medium text-gray-700">
//         Select Session
//       </label>
//       <div className="relative">
//         <select
//           id="session-select"
//           value={currentSession || ''}
//           onChange={(e) => onSelect(e.target.value)}
//           disabled={!sessions.length || isLoading}
//           className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
//         >
//           <option value="">Select a session</option>
//           {sessions.map((session) => (
//             <option key={session} value={session}>
//               Session: {session.substring(0, 8)}...
//             </option>
//           ))}
//         </select>
//         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//           <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </div>
//       </div>
     
//       {sessions.length === 0 && !isLoading && (
//         <p className="text-sm text-gray-500 mt-2">
//           No sessions available. Create a new session to get started.
//         </p>
//       )}
     
//       {isLoading && (
//         <div className="flex items-center text-sm text-gray-500 mt-2">
//           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           Loading sessions...
//         </div>
//       )}
//     </div>
//   );
// }
 
// export default SessionSelector;
import React, { useState, useEffect, useRef } from 'react';

function SessionSelector({ sessions, currentSession, onSelect, isLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter sessions based on search term
  const filteredSessions = sessions.filter(session =>
    session.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (session) => {
    onSelect(session);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700">
        Select Session
      </label>
      
      <div className="relative">
        {/* Custom Dropdown Trigger */}
        <button
          onClick={() => !isLoading && sessions.length > 0 && setIsOpen(!isOpen)}
          disabled={!sessions.length || isLoading}
          className={`w-full px-3 py-2 text-left border rounded-lg shadow-sm bg-white text-sm
            ${isLoading || !sessions.length 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            }`}
        >
          <span className="block truncate">
            {currentSession 
              ? `Session: ${currentSession.substring(0, 8)}...` 
              : 'Select a session'}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg 
              className={`h-5 w-5 text-gray-400 ${isOpen ? 'transform rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sessions..."
                className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <ul className="py-1">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <li
                    key={session}
                    onClick={() => handleSelect(session)}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50
                      ${currentSession === session ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-700'}`}
                  >
                    Session: {session.substring(0, 8)}...
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-gray-500 italic">
                  No matching sessions
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {sessions.length === 0 && !isLoading && (
        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
          No sessions available. Create one to begin.
        </p>
      )}

      {isLoading && (
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
          <svg 
            className="animate-spin mr-2 h-4 w-4 text-indigo-500" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading sessions...
        </div>
      )}
    </div>
  );
}

export default React.memo(SessionSelector);