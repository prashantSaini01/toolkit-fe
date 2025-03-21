// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import ReactMarkdown from 'react-markdown';
 
// function ChatInterface({ sessionId, chatHistory, onNewMessage }) {
//   const [question, setQuestion] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);
 
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
 
//   useEffect(() => {
//     scrollToBottom();
//   }, [chatHistory]);
 
//   const handleAsk = async () => {
//     if (!question.trim() || isLoading) return;
//     try {
//       setIsLoading(true);
//       const response = await axios.post(`/sessions/${sessionId}/ask`, { question });
//       setQuestion('');
//       onNewMessage();
//     } catch (error) {
//       alert(error.response?.data.error || 'Error processing question');
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleAsk();
//     }
//   };
 
//   return (
//     <div className="chat-interface" style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100%',
//       width: '100%',
//       padding: '16px',
//       boxSizing: 'border-box'
//     }}>
//       <div className="chat-messages" style={{
//         flex: '1 1 auto',
//         overflowY: 'auto',
//         marginBottom: '16px',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '12px'
//       }}>
//         {chatHistory.map((msg, index) => (
//           <div
//             key={index}
//             className={`message ${msg.sender}-message`}
//             style={{
//               padding: '12px',
//               borderRadius: '8px',
//               maxWidth: '90%',
//               alignSelf: msg.sender === 'assistant' ? 'flex-start' : 'flex-end',
//               backgroundColor: msg.sender === 'assistant' ? '#f0f0f0' : '#e6f2ff'
//             }}
//           >
//             <div className="message-header" style={{
//               fontWeight: 'bold',
//               marginBottom: '6px'
//             }}>
//               {msg.sender === 'assistant' ? '🤖 AI Assistant' : '👤 You'}
//             </div>
//             <div className="message-content" style={{
//               wordBreak: 'break-word'
//             }}>
//               {msg.sender === 'assistant' ? (
//                 <ReactMarkdown>{msg.content}</ReactMarkdown>
//               ) : (
//                 msg.content
//               )}
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="message assistant-message loading" style={{
//             padding: '12px',
//             borderRadius: '8px',
//             maxWidth: '90%',
//             alignSelf: 'flex-start',
//             backgroundColor: '#f0f0f0'
//           }}>
//             <div className="message-header" style={{
//               fontWeight: 'bold',
//               marginBottom: '6px'
//             }}>
//               🤖 AI Assistant
//             </div>
//             <div className="typing-indicator" style={{
//               display: 'flex',
//               gap: '4px'
//             }}>
//               <span style={dotStyle}></span>
//               <span style={{...dotStyle, animationDelay: '0.2s'}}></span>
//               <span style={{...dotStyle, animationDelay: '0.4s'}}></span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="chat-input" style={{
//         display: 'flex',
//         gap: '12px',
//         position: 'sticky',
//         bottom: 0,
//         backgroundColor: 'white',
//         padding: '8px 0'
//       }}>
//         <textarea
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Ask me anything about your documents... 📚"
//           disabled={isLoading}
//           style={{
//             flex: 1,
//             padding: '12px',
//             borderRadius: '8px',
//             border: '1px solid #ddd',
//             resize: 'none',
//             minHeight: '50px',
//             maxHeight: '120px',
//             fontFamily: 'inherit'
//           }}
//         />
//         <button
//           onClick={handleAsk}
//           disabled={!question.trim() || isLoading}
//           className={isLoading ? 'loading' : ''}
//           style={{
//             padding: '0 16px',
//             borderRadius: '8px',
//             border: 'none',
//             backgroundColor: '#6366f1',
//             color: 'white',
//             fontWeight: 'bold',
//             cursor: question.trim() && !isLoading ? 'pointer' : 'not-allowed',
//             opacity: !question.trim() || isLoading ? 0.7 : 1,
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px'
//           }}
//         >
//           {isLoading ? '🤔' : '✨'} {isLoading ? 'Processing...' : 'Send'}
//         </button>
//       </div>
//     </div>
//   );
// }
 
// // Style for typing indicator dots
// const dotStyle = {
//   width: '8px',
//   height: '8px',
//   backgroundColor: '#888',
//   borderRadius: '50%',
//   display: 'inline-block',
//   animation: 'typing-animation 1s infinite ease-in-out'
// };
 
// // Add this to your CSS file:
// /*
// @keyframes typing-animation {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-5px); }
// }
// */
 
// export default ChatInterface;


import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function ChatInterface({ sessionId, chatHistory, onNewMessage }) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea and scroll to bottom
  useEffect(() => {
    scrollToBottom();
    adjustTextareaHeight();
  }, [chatHistory, question]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || isLoading) return;
    setIsLoading(true);
    try {
      await axios.post(`/sessions/${sessionId}/ask`, { question });
      setQuestion('');
      onNewMessage();
    } catch (error) {
      console.error('Error:', error);
      // Consider using a toast notification instead of alert
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="chat-interface flex flex-col h-full w-full p-4">
      <div className="chat-messages flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`message flex ${msg.sender === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                msg.sender === 'assistant' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-indigo-100 text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">
                  {msg.sender === 'assistant' ? '🤖 Assistant' : '👤 You'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-sm">
                {msg.sender === 'assistant' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <span className="flex gap-2">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input flex gap-3 sticky bottom-0 bg-white p-2 rounded-lg shadow-sm">
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
        />
        <button
          onClick={handleAsk}
          disabled={!question.trim() || isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            question.trim() && !isLoading
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending
            </span>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatInterface;