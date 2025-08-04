import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaSmoking, FaInfoCircle, FaEdit } from "react-icons/fa";
import { MdSmokeFree, MdLocalCafe } from "react-icons/md";
import { Select, DatePicker, InputNumber, message } from "antd";
import dayjs from "dayjs";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const packageImages = {
  1: "/cigarette/1.jpg",
  2: "/cigarette/2.jpg",
  3: "/cigarette/3.jpg",
  4: "/cigarette/4.jpg",
  5: "/cigarette/5.jpg",
  6: "/cigarette/6.jpg",
  7: "/cigarette/7.jpg",
  8: "/cigarette/8.jpg",
  9: "/cigarette/9.jpg",
  10: "/cigarette/10.jpg",
  11: "/cigarette/11.jpg",
  12: "/cigarette/12.jpg",
  13: "/cigarette/13.jpg",
  14: "/cigarette/14.jpg",
};

const StatusPage = () => {
  const navigate = useNavigate();

  const handleGoToQuitPlan = () => {
    navigate("/quit-plan");
  };
  const [existingStatus, setExistingStatus] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingStatus, setHasExistingStatus] = useState(false);
  const [packages, setPackages] = useState([]);

  const [formData, setFormData] = useState({
    cigarettesPerDay: 5,
    frequency: "DAILY",
    preferredFlavor: "CHOCOLATE",
    preferredNicotineLevel: "ZERO",
    packageId: null,
    recordDate: null,
  });

  const maxCigarettes = 20;

  const frequencyOptions = ["DAILY", "OCCASIONALLY", "SOCIAL", "STRESS"];
  const flavorOptions = [
    "MENTHOL",
    "VANILLA",
    "CHERRY",
    "CHOCOLATE",
    "ORIGINAL",
    "MINT",
  ];
  const nicotineOptions = ["ZERO", "LOW", "MEDIUM", "HIGH"];

  const getStatusColor = (count) => {
    if (count <= 5) return "bg-green-500";
    if (count <= 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleInputChange = (field, value) => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [validationErrors, setValidationErrors] = useState({});

  const handleSave = async () => {
    const errors = {};

    if (
      formData.cigarettesPerDay === null ||
      formData.cigarettesPerDay === undefined ||
      formData.cigarettesPerDay < 0
    ) {
      errors.cigarettesPerDay = "Vui lòng nhập số lượng thuốc mỗi ngày.";
    }

    if (!formData.frequency) {
      errors.frequency = "Vui lòng chọn tần suất hút thuốc.";
    }

    if (!formData.preferredFlavor) {
      errors.preferredFlavor = "Vui lòng chọn vị yêu thích.";
    }

    if (!formData.preferredNicotineLevel) {
      errors.preferredNicotineLevel = "Vui lòng chọn mức độ nicotine.";
    }

    if (!formData.packageId) {
      errors.packageId = "Vui lòng chọn gói thuốc của bạn.";
    }
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      message.warning("Vui lòng điền đầy đủ thông tin hợp lệ.");
      return;
    }

    const { recordDate, ...rest } = formData;

    const payload = {
      ...formData,
      preferredNicotineLevel: formData.preferredNicotineLevel?.toUpperCase(),
    };
    if (hasExistingStatus && existingStatus?.recordDate) {
      payload.recordDate = existingStatus.recordDate;
    }

    try {
      if (hasExistingStatus) {
        await api.put("/smoking-status", payload);
        message.success("Cập nhật trạng thái thành công!");
      } else {
        await api.post("/smoking-status", payload);
        message.success("Lưu trạng thái thành công!");
      }

      // ✅ Cập nhật lại giao diện (không cần reload)
      const refreshed = await api.get("/smoking-status");
      if (refreshed.data) {
        setFormData({
          ...refreshed.data,
          packageId: refreshed.data.cigarettePackageId,
          preferredNicotineLevel:
            refreshed.data.preferredNicotineLevel?.toUpperCase(),
        });
        setExistingStatus(refreshed.data);
      }

      setIsEditing(false);
      setHasExistingStatus(true);
      setValidationErrors({});
    } catch (error) {
      console.error("Error saving status:", error);
      message.error(
        error?.response?.data?.message || "Lỗi khi lưu trạng thái."
      );
    }
  };

  const handleDelete = async () => {
    if (!hasExistingStatus) {
      message.info("Bạn chưa có Smoking Status.");
      return;
    }

    try {
      await api.delete("/smoking-status");
      message.success("Status deleted successfully!");
      setFormData({
        cigarettesPerDay: null,
        frequency: null,
        preferredFlavor: null,
        preferredNicotineLevel: null,
        packageId: null,
        recordDate: null,
      });
      setIsEditing(true);
      setHasExistingStatus(false);
    } catch (error) {
      console.error("Error deleting status:", error);
      message.error("Failed to delete status.");
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/smoking-status");
        if (res.data) {
          setFormData({
            ...res.data,
            packageId: res.data.cigarettePackageId,
            preferredNicotineLevel:
              res.data.preferredNicotineLevel?.toUpperCase(),
          });
          setExistingStatus(res.data);
          setHasExistingStatus(true);
          setIsEditing(false);
        } else {
          setFormData({
            cigarettesPerDay: null,
            frequency: null,
            preferredFlavor: null,
            preferredNicotineLevel: null,
            packageId: null,
            recordDate: null,
          });
          setHasExistingStatus(false);
          setIsEditing(true);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setFormData({
            cigarettesPerDay: null,
            frequency: null,
            preferredFlavor: null,
            preferredNicotineLevel: null,
            packageId: null,
            recordDate: null,
          });
          setHasExistingStatus(false);
          setIsEditing(true);
        } else {
          message.error("Unable to load status.");
        }
      }
    };

    const fetchPackages = async () => {
      try {
        const res = await api.get("/cigarette-packages");
        setPackages(
          (res.data || []).filter((pkg) => pkg?.cigarettePackageId != null)
        );
      } catch (error) {
        message.error("Không thể tải danh sách gói thuốc.");
      }
    };

    fetchStatus();
    fetchPackages();
  }, []);

  const selectedPackage = packages.find(
    (pkg) => String(pkg.cigarettePackageId) === String(formData.packageId)
  );
  const packageImage = selectedPackage
    ? packageImages[selectedPackage.cigarettePackageId]
    : null;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Smoking Status</h1>
            <div className="flex gap-4">
              <button
                onClick={handleGoToQuitPlan}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Your Quit Plan
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaEdit /> Edit Status
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {!isEditing ? (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Daily Consumption */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Daily Consumption
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`${getStatusColor(
                        formData.cigarettesPerDay
                      )} rounded-full p-4`}
                    >
                      <FaSmoking className="text-white text-2xl" />
                    </div>
                    <div>
                      <span className="text-4xl font-bold text-gray-800">
                        {formData.cigarettesPerDay}
                      </span>
                      <span className="text-gray-600 ml-2">per day</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className={`${getStatusColor(
                        formData.cigarettesPerDay
                      )} h-4 transition-all duration-300`}
                      style={{
                        width: `${
                          (formData.cigarettesPerDay / maxCigarettes) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Habit Details */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Habit Details
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MdSmokeFree className="text-blue-500 text-2xl" />
                      <div>
                        <p className="font-medium text-gray-800">Frequency</p>
                        <p className="text-gray-600">{formData.frequency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MdLocalCafe className="text-brown-500 text-2xl" />
                      <div>
                        <p className="font-medium text-gray-800">
                          Preferred Flavor
                        </p>

                        <p className="text-gray-600">
                          {formData.preferredFlavor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaInfoCircle className="text-green-500 text-2xl" />
                      <div>
                        <p className="font-medium text-gray-800">
                          Nicotine Level
                        </p>
                        <p className="text-gray-600">
                          {formData.preferredNicotineLevel}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package and Date */}
                <div className="md:col-span-2 grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                      Package Information
                    </h2>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      {selectedPackage ? (
                        <div className="flex items-center gap-4">
                          {packageImage && (
                            <img
                              src={packageImage}
                              alt={`${selectedPackage.cigaretteBrand} - ${selectedPackage.cigarettePackageName}`}
                              className="w-20 h-20 object-contain rounded shadow"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-800">
                              {selectedPackage.cigaretteBrand} -{" "}
                              {selectedPackage.cigarettePackageName}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="font-medium text-gray-800">
                          {formData.cigarettePackageName || formData.packageId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                      Record Date
                    </h2>
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-blue-500 text-2xl" />
                      <span className="text-gray-800">
                        {formData.recordDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Form Edit Mode
            <>
              <div className="space-y-6">
                <div>
                  <label className="block mb-1 text-gray-700">
                    Cigarettes Per Day
                  </label>
                  <InputNumber
                    min={0}
                    max={100}
                    value={formData.cigarettesPerDay}
                    onChange={(value) =>
                      handleInputChange("cigarettesPerDay", value)
                    }
                    style={{ width: "100%" }}
                    status={validationErrors.cigarettesPerDay ? "error" : ""}
                  />
                  {validationErrors.cigarettesPerDay && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.cigarettesPerDay}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-gray-700">Frequency</label>
                  <Select
                    value={formData.frequency}
                    onChange={(value) => handleInputChange("frequency", value)}
                    style={{ width: "100%" }}
                    status={validationErrors.frequency ? "error" : ""}
                  >
                    {frequencyOptions.map((opt) => (
                      <Option key={opt} value={opt}>
                        {opt}
                      </Option>
                    ))}
                  </Select>
                  {validationErrors.frequency && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.frequency}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-gray-700">
                    Preferred Flavor
                  </label>
                  <Select
                    value={formData.preferredFlavor}
                    onChange={(value) =>
                      handleInputChange("preferredFlavor", value)
                    }
                    style={{ width: "100%" }}
                    status={validationErrors.preferredFlavor ? "error" : ""}
                  >
                    {flavorOptions.map((opt) => (
                      <Option key={opt} value={opt}>
                        {opt}
                      </Option>
                    ))}
                  </Select>
                  {validationErrors.preferredFlavor && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.preferredFlavor}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-gray-700">
                    Nicotine Level
                  </label>
                  <Select
                    value={formData.preferredNicotineLevel}
                    onChange={(value) =>
                      handleInputChange("preferredNicotineLevel", value)
                    }
                    style={{ width: "100%" }}
                    status={
                      validationErrors.preferredNicotineLevel ? "error" : ""
                    }
                  >
                    {nicotineOptions.map((opt) => (
                      <Option key={opt} value={opt}>
                        {opt}
                      </Option>
                    ))}
                  </Select>
                  {validationErrors.preferredNicotineLevel && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.preferredNicotineLevel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-gray-700">Package</label>
                  <Select
                    value={formData.packageId}
                    onChange={(value) => handleInputChange("packageId", value)}
                    style={{ width: "100%" }}
                    placeholder="Chọn gói thuốc"
                    status={validationErrors.packageId ? "error" : ""}
                  >
                    {packages.map((pkg) => (
                      <Option
                        key={pkg.cigarettePackageId}
                        value={pkg.cigarettePackageId}
                      >
                        {pkg.cigaretteBrand} - {pkg.cigarettePackageName}
                      </Option>
                    ))}
                  </Select>
                  {validationErrors.packageId && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.packageId}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 mt-4">
                  {hasExistingStatus && (
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setValidationErrors({}); // Xóa lỗi khi hủy
                      }}
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusPage;