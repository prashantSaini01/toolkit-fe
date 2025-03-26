import { useState } from "react";

function ProductUpload({
  products,
  setProducts,
  activeBrand,
  isGenerating,
  isServerReady,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) return;
    // Simulate product parsing (replace with actual backend call in production)
    const dummyProducts = [
      { name: "Product 1", desc: "Description", price: "$10" },
      { name: "Product 2", desc: "Another item", price: "$20" },
    ];
    setProducts(dummyProducts);
    setFile(null);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-lg font-semibold text-gray-800 mb-2"
      >
        Product Details {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && (
        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf,.xlsx,.csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isGenerating || !isServerReady}
          />
          <button
            type="button"
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isGenerating || !isServerReady || !file}
          >
            Upload & Process
          </button>
          {products.length > 0 && (
            <div>
              <p className="text-sm text-gray-600">
                {products.length} products processed for{" "}
                {activeBrand ? activeBrand.name : "generic use"}.
              </p>
              <ul className="mt-2 text-sm text-gray-700 max-h-32 overflow-y-auto">
                {products.slice(0, 3).map((p, i) => (
                  <li key={i}>{p ? `${p.name} - ${p.price}` : "Product"}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductUpload;
