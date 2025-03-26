const nodeOptions = [
  { value: "", label: "Run Full Process (All Steps)" },
  { value: "planner", label: "Planner: Create Post Outline" },
  { value: "research_plan", label: "Research Plan: Gather Key Info" },
  { value: "generate", label: "Generate: Draft Your Post" },
  { value: "reflect", label: "Reflect: Review & Suggest Edits" },
  { value: "research_critique", label: "Research Critique: Add Final Details" },
];

function ContentSettings({
  topic,
  setTopic,
  stopAfter,
  setStopAfter,
  includeImage,
  setIncludeImage,
  isGenerating,
  isServerReady,
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Content Settings
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Spring Sale"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isGenerating || !isServerReady}
          />
        </div>
        <div>
          <label
            htmlFor="stopAfter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Workflow Control (Optional)
          </label>
          <select
            id="stopAfter"
            value={stopAfter}
            onChange={(e) => setStopAfter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isGenerating || !isServerReady}
          >
            {nodeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <input
            id="includeImage"
            type="checkbox"
            checked={includeImage}
            onChange={(e) => setIncludeImage(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            disabled={isGenerating || !isServerReady}
          />
          <label
            htmlFor="includeImage"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            Include Image
          </label>
        </div>
      </div>
    </div>
  );
}

export default ContentSettings;
