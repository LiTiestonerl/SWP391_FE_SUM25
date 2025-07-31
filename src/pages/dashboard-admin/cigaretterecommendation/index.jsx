import { useState } from "react";
import { FiPackage, FiAlertCircle } from "react-icons/fi";
import { Switch } from "@headlessui/react";
import api from "../../../configs/axios"; // ← Cấu hình axios của bạn

const CigaretteRecommendation = () => {
  const [formData, setFormData] = useState({
    recId: "",
    notes: "",
    priorityOrder: "",
    isActive: false,
    fromCigarette: {
      packageId: "",
      name: "",
      brand: "",
      nicotineStrength: "",
      flavor: "",
      price: "",
      sticksPerPack: ""
    },
    toCigarette: {
      packageId: "",
      name: "",
      brand: "",
      nicotineStrength: "",
      flavor: "",
      price: "",
      sticksPerPack: ""
    },
    smokingStatus: {
      id: "",
      description: ""
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nicotineOptions = ["ZERO", "LOW", "MEDIUM", "HIGH"];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recId) newErrors.recId = "Recommendation ID is required";
    if (!formData.priorityOrder) newErrors.priorityOrder = "Priority Order is required";
    if (formData.priorityOrder && formData.priorityOrder < 0) newErrors.priorityOrder = "Priority must be positive";

    // From Cigarette
    if (!formData.fromCigarette.packageId) newErrors.fromPackageId = "Package ID is required";
    if (!formData.fromCigarette.price || formData.fromCigarette.price < 0) newErrors.fromPrice = "Price must be positive";
    if (!formData.fromCigarette.sticksPerPack || formData.fromCigarette.sticksPerPack < 1)
      newErrors.fromSticksPerPack = "Sticks must be positive integer";

    // To Cigarette
    if (!formData.toCigarette.packageId) newErrors.toPackageId = "Package ID is required";
    if (!formData.toCigarette.price || formData.toCigarette.price < 0) newErrors.toPrice = "Price must be positive";
    if (!formData.toCigarette.sticksPerPack || formData.toCigarette.sticksPerPack < 1)
      newErrors.toSticksPerPack = "Sticks must be positive integer";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.post("/cigarette-recommendations", formData);
      alert("Recommendation saved successfully!");
      console.log("Created:", res.data);
      // Optionally reset form:
      // setFormData(...);
    } catch (error) {
      console.error("Error saving recommendation:", error);
      alert("Failed to save recommendation.");
    }

    setIsSubmitting(false);
  };

  const CigaretteSection = ({ type, data, onChange }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <FiPackage className="mr-2" />
        {type} Cigarette Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["packageId", "name", "brand", "flavor", "price", "sticksPerPack"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={["price", "sticksPerPack"].includes(field) ? "number" : "text"}
              value={data[field]}
              onChange={(e) =>
                onChange(type.toLowerCase() + "Cigarette", field, e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min={field === "sticksPerPack" ? 1 : 0}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nicotine Strength</label>
          <select
            value={data.nicotineStrength}
            onChange={(e) => onChange(type.toLowerCase() + "Cigarette", "nicotineStrength", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Strength</option>
            {nicotineOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cigarette Recommendation Management</h1>
          <p className="mt-2 text-gray-600">Create or edit cigarette recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Recommendation ID</label>
                <input
                  type="text"
                  value={formData.recId}
                  onChange={(e) => handleChange(null, "recId", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.priorityOrder}
                  onChange={(e) => handleChange(null, "priorityOrder", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange(null, "notes", e.target.value)}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <Switch
                  checked={formData.isActive}
                  onChange={(checked) => handleChange(null, "isActive", checked)}
                  className={`${formData.isActive ? "bg-blue-600" : "bg-gray-200"} relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Active Status</span>
                  <span
                    className={`${formData.isActive ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
                <span className="ml-3 text-sm font-medium text-gray-700">Active Status</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CigaretteSection type="From" data={formData.fromCigarette} onChange={handleChange} />
            <CigaretteSection type="To" data={formData.toCigarette} onChange={handleChange} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Smoking Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status ID</label>
                <input
                  type="text"
                  value={formData.smokingStatus.id}
                  onChange={(e) => handleChange("smokingStatus", "id", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={formData.smokingStatus.description}
                  onChange={(e) => handleChange("smokingStatus", "description", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Please correct the following errors:</h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : "Save Recommendation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CigaretteRecommendation;
