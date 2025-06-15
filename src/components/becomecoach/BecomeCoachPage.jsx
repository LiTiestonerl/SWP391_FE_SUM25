import React, { useState } from "react";

const BecomeCoachPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    experience: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.experience.trim()) {
      newErrors.experience = "Please describe your experience";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", form);
      alert("Application submitted successfully!");
      // Reset form
      setForm({ fullName: "", email: "", experience: "" });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Apply to Become a Coach
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className={`w-full border p-3 rounded ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={`w-full border p-3 rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Your Background & Experience"
              rows={4}
              className={`w-full border p-3 rounded ${
                errors.experience ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default BecomeCoachPage;
