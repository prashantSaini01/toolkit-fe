function CreationProgress({ messages }) {
  return messages.length > 0 ? (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        Creation Progress{" "}
        <span className="inline-block h-2 w-2 bg-blue-500 rounded-full animate-pulse ml-2" />
      </h2>
      <div className="space-y-4 max-h-72 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <p className="text-sm font-medium text-gray-800">
              Step: <span className="text-blue-600">{msg.node_transition}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1 break-words">
              {msg.message}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Thread: {msg.thread_id} | Revision: {msg.revision} | Count:{" "}
              {msg.count}
            </p>
          </div>
        ))}
      </div>
      {/* eslint-disable react/no-unknown-property */}
      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  ) : null;
}

export default CreationProgress;
