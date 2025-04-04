import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveBrand, addBrand } from "../../../redux/slices/content/contentSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

function BrandManagement() {
  const dispatch = useDispatch();
  const { brands, activeBrand, isGenerating, isServerReady } = useSelector(
    (state) => state.content
  );
  const [isOpen, setIsOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: "",
    tone: "Friendly",
    logo: null,
    urls: [""],
  });

  const handleAddBrand = () => {
    if (!newBrand.name.trim()) return;
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
      urls: newBrand.urls.filter((url) => url.trim()),
    };
    dispatch(addBrand(brand));
    setNewBrand({ name: "", tone: "Friendly", logo: null, urls: [""] });
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

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
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
    if (newBrand.urls.length === 1) return;
    const updatedUrls = newBrand.urls.filter((_, i) => i !== index);
    setNewBrand({ ...newBrand, urls: updatedUrls });
  };

  useEffect(() => {
    console.log("Brands in BrandManagement:", brands);
  }, [brands]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between"
      >
        Brand Management
        <span className="transition-transform duration-300">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      <div
        className={`space-y-6 transition-all duration-300 ${
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Brand
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            <div
              onClick={() => dispatch(setActiveBrand(null))}
              className={`p-3 rounded-lg cursor-pointer flex items-center ${
                !activeBrand ? "bg-blue-100 border-blue-500" : "bg-gray-100"
              } border hover:bg-blue-50 transition-colors`}
            >
              <span>No Brand</span>
            </div>
            {(brands || []).map((brand) => (
              <div
                key={brand.id}
                onClick={() => dispatch(setActiveBrand(brand))}
                className={`p-3 rounded-lg cursor-pointer flex items-center ${
                  activeBrand?.id === brand.id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-100"
                } border hover:bg-blue-50 transition-colors`}
              >
                {brand.logo && (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-6 w-6 mr-2"
                  />
                )}
                <span>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Add New Brand
          </h3>
          <input
            type="text"
            value={newBrand.name}
            onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
            placeholder="Brand Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating || !isServerReady}
          />
          <select
            value={newBrand.tone}
            onChange={(e) => setNewBrand({ ...newBrand, tone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating || !isServerReady}
          >
            <option value="Friendly">Friendly</option>
            <option value="Professional">Professional</option>
            <option value="Bold">Bold</option>
            <option value="Casual">Casual</option>
          </select>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg mb-3 text-center"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
              disabled={isGenerating || !isServerReady}
            />
            <label
              htmlFor="logo-upload"
              className="cursor-pointer text-gray-600 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Drag & Drop or Click to Upload Logo
            </label>
            {newBrand.logo && (
              <img
                src={newBrand.logo}
                alt="Preview"
                className="mt-3 h-16 w-16 object-contain mx-auto"
              />
            )}
          </div>
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating || !isServerReady}
                />
                {newBrand.urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrlField(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addUrlField}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              disabled={isGenerating || !isServerReady}
            >
              Add URL
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddBrand}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            disabled={isGenerating || !isServerReady || !newBrand.name.trim()}
          >
            Save & Use
          </button>
        </div>
      </div>
    </div>
  );
}

export default BrandManagement;
