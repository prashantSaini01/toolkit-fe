import { useSelector, useDispatch } from "react-redux";
import {
  setTopic,
  setStopAfter,
  setIncludeImage,
} from "../../../redux/slices/content/contentSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faPen, faCog } from "@fortawesome/free-solid-svg-icons";

const nodeOptions = [
  { value: "", label: "Run Full Process (All Steps)" },
  { value: "planner", label: "Planner: Create Post Outline" },
  { value: "research_plan", label: "Research Plan: Gather Key Info" },
  { value: "generate", label: "Generate: Draft Your Post" },
  { value: "reflect", label: "Reflect: Review & Suggest Edits" },
  { value: "research_critique", label: "Research Critique: Add Final Details" },
];

function ContentSettings() {
  const dispatch = useDispatch();
  const { topic, stopAfter, includeImage, isGenerating, isServerReady } =
    useSelector((state) => state.content);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Content Settings
      </h2>
      <div className="space-y-6">
        <div className="relative">
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Topic
          </label>
          <FontAwesomeIcon
            icon={faPen}
            className="absolute left-3 top-10 text-gray-400"
          />
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => dispatch(setTopic(e.target.value))}
            placeholder="e.g., Spring Sale"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isGenerating || !isServerReady}
          />
        </div>
        <div className="relative">
          <label
            htmlFor="stopAfter"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Workflow Control (Optional)
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="ml-2 text-gray-400 cursor-help"
              title="Choose where to stop the generation process"
            />
          </label>
          <FontAwesomeIcon
            icon={faCog}
            className="absolute left-3 top-10 text-gray-400"
          />
          <select
            id="stopAfter"
            value={stopAfter}
            onChange={(e) => dispatch(setStopAfter(e.target.value))}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isGenerating || !isServerReady}
          >
            {nodeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                id="includeImage"
                type="checkbox"
                checked={includeImage}
                onChange={(e) => dispatch(setIncludeImage(e.target.checked))}
                className="sr-only"
                disabled={isGenerating || !isServerReady}
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors ${
                  includeImage ? "bg-blue-600" : "bg-gray-300"
                } ${isGenerating || !isServerReady ? "opacity-50" : ""}`}
              ></div>
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  includeImage ? "translate-x-4" : ""
                }`}
              ></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Include Image
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default ContentSettings;
