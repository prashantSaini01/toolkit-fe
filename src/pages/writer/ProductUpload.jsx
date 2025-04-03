import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../../redux/content/contentSlice";

function ProductUpload() {
  const dispatch = useDispatch();
  const { products, activeBrand, isGenerating, isServerReady } = useSelector(
    (state) => state.content
  );
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) return;
    const dummyProducts = [
      { name: "Product 1", desc: "Description", price: "$10" },
      { name: "Product 2", desc: "Another item", price: "$20" },
    ];
    dispatch(setProducts(dummyProducts));
    setFile(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between"
      >
        Product Details
        <span className="transition-transform duration-300">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      <div
        className={`space-y-4 transition-all duration-300 ${
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <input
          type="file"
          accept=".pdf,.xlsx,.csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isGenerating || !isServerReady}
        />
        {file && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span>{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          disabled={isGenerating || !isServerReady || !file}
        >
          Upload & Process
        </button>
        {products.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              {products.length} products processed for{" "}
              {activeBrand ? activeBrand.name : "generic use"}.
            </p>
            <table className="w-full text-sm text-gray-700 border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 3).map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductUpload;
