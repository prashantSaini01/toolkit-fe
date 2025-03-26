import { useState } from "react";

function BrandManagement({
  brands,
  setBrands,
  activeBrand,
  setActiveBrand,
  isGenerating,
  isServerReady,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: "",
    tone: "Friendly",
    logo: null,
    urls: [""], // Initialize with one empty URL field
  });

  const handleAddBrand = () => {
    if (!newBrand.name.trim()) return;

    // Basic URL validation
    const invalidUrls = newBrand.urls.filter(
      (url) => url.trim() && !/^(https?:\/\/[^\s/$.?#].[^\s]*)$/i.test(url)
    );
    if (invalidUrls.length > 0) {
      alert("Please enter valid URLs (e.g., https://example.com)");
      return;
    }

    const brand = {
      ...newBrand,
      id: Date.now().toString(),
      urls: newBrand.urls.filter((url) => url.trim()), // Remove empty URLs
    };
    const updatedBrands = [...brands, brand];
    setBrands(updatedBrands);
    setActiveBrand(brand);
    setNewBrand({ name: "", tone: "Friendly", logo: null, urls: [""] });
    // localStorage.setItem("brands", JSON.stringify(updatedBrands));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setNewBrand({ ...newBrand, logo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (index, value) => {
    const updatedUrls = [...newBrand.urls];
    updatedUrls[index] = value;
    setNewBrand({ ...newBrand, urls: updatedUrls });
  };

  const addUrlField = () => {
    setNewBrand({ ...newBrand, urls: [...newBrand.urls, ""] });
  };

  const removeUrlField = (index) => {
    if (newBrand.urls.length === 1) return; // Keep at least one field
    const updatedUrls = newBrand.urls.filter((_, i) => i !== index);
    setNewBrand({ ...newBrand, urls: updatedUrls });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-lg font-semibold text-gray-800 mb-2"
      >
        Brand Management {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Brand
            </label>
            <select
              value={activeBrand ? activeBrand.id : ""}
              onChange={(e) => {
                const selected = brands.find((b) => b.id === e.target.value);
                setActiveBrand(selected || null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isGenerating || !isServerReady}
            >
              <option value="">No Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Add New Brand
            </h3>
            <input
              type="text"
              value={newBrand.name}
              onChange={(e) =>
                setNewBrand({ ...newBrand, name: e.target.value })
              }
              placeholder="Brand Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm mb-2"
              disabled={isGenerating || !isServerReady}
            />
            <select
              value={newBrand.tone}
              onChange={(e) =>
                setNewBrand({ ...newBrand, tone: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm mb-2"
              disabled={isGenerating || !isServerReady}
            >
              <option value="Friendly">Friendly</option>
              <option value="Professional">Professional</option>
              <option value="Bold">Bold</option>
              <option value="Casual">Casual</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
              disabled={isGenerating || !isServerReady}
            />
            {newBrand.logo && (
              <img
                src={newBrand.logo}
                alt="Preview"
                className="mt-2 h-16 w-16 object-contain mb-2"
              />
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Website URLs (Optional)
              </label>
              {newBrand.urls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="e.g., https://example.com"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isGenerating || !isServerReady}
                  />
                  {newBrand.urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlField(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addUrlField}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                disabled={isGenerating || !isServerReady}
              >
                Add URL
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddBrand}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isGenerating || !isServerReady || !newBrand.name.trim()}
            >
              Save & Use
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandManagement;
