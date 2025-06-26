import React, { useState, useEffect } from "react";
import { format, addMonths, isAfter, isBefore, startOfToday } from "date-fns";
import { FaCalendar, FaUserMd, FaClock, FaCheckCircle } from "react-icons/fa";
import { Select } from "antd";
import { ca, se } from "date-fns/locale";
import api from "../../configs/axios";
import axios from "axios";
import { toast } from "react-toastify";
import "./booking.css";

const MedicalBooking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  // fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://14.225.210.212:8080/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  useEffect(() => {
    fetchDoctors();
  }, []);

  // fetch services
  const fetchServices = async () => {
    try {
      const response = await api.get("medicineService");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching medicine Service:", error);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);

  // dotors, date => slots
  const fetchSlots = async () => {
    try {
      const response = await api.get(
        `slot/registered?accountId=${selectedDoctor.id}&date=${selectedDate}`
      );
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };
  useEffect(() => {
    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // value
    const values = {
      slotId: selectedTimeSlot,
      staffId: selectedDoctor.id,
      appointmentDate: selectedDate,
      servicesId: selectedServices.map((service) => service.id),
    };
    // call api
    try {
      const response = await api.post("appointment", {
        slotId: 5,
        staffId: 3,
        appointmentDate: "2025-06-18",
        servicesId: [1],
      });
      console.log(response);
      toast.success("Appointment submitted successfully");
    } catch (error) {
      toast.error("Error submitting appointment");
    }
    setIsSubmitting(true);
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedDoctor(null);
    setSelectedTimeSlot(null);
    setShowConfirmation(false);
    setSelectedServices([]);
  };

  const handleSelect = (service, checked) => {
    if (checked) {
      setSelectedServices((prev) => [...prev, service]);
    } else {
      setSelectedServices((prev) =>
        prev.filter((s) => s.name !== service.name)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Coach Booking
          </h1>

          {!showConfirmation ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Date Selection */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaCalendar className="text-blue-500" /> Select Date
                </h2>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min={format(new Date(), "yyyy-MM-dd")}
                  max={format(addMonths(new Date(), 3), "yyyy-MM-dd")}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              {/* Doctor Selection */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaUserMd className="text-blue-500" /> Select Coach
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`cursor-pointer p-4 rounded-lg border transition-all ${
                        selectedDoctor?.id === doctor.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4">
                        <FaUserMd className="text-blue-500 text-2xl" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center">
                        {doctor.fullName}
                      </h3>
                      <p className="text-gray-600 text-center">
                        {doctor.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaClock className="text-blue-500" /> Select Time Slot
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.label}
                      type="button"
                      onClick={() =>
                        slot.accountSlots[1].available &&
                        setSelectedTimeSlot(slot.id)
                      }
                      disabled={!slot.accountSlots[1].available}
                      className={`p-2 text-sm rounded-lg transition-all ${
                        !slot.accountSlots[1].available
                          ? "bg-zinc-400 text-white cursor-not-allowed"
                          : selectedTimeSlot === slot.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Available Services
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {services.map((service) => {
                    const isSelected = selectedServices.some(
                      (s) => s.name === service.name
                    );
                    if (service.available) {
                      return (
                        <div
                          key={service.name}
                          onClick={() => handleSelect(service, !isSelected)}
                          className={`p-4 rounded-lg cursor-pointer border transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {service.name}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">
                                {service.description}
                              </p>
                              <div className="mt-2 text-sm text-gray-500">
                                <p>Price: {service.price}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={
                    !selectedDate ||
                    !selectedDoctor ||
                    !selectedTimeSlot ||
                    isSubmitting
                  }
                  className={`px-8 py-3 rounded-lg text-white transition-all ${
                    isSubmitting
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <FaCheckCircle className="text-green-500 text-5xl mx-auto" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Booking Confirmed!
              </h2>
              <p className="text-gray-600">
                Your appointment has been scheduled with {selectedDoctor.name}{" "}
                on {format(new Date(selectedDate), "MMMM dd, yyyy")} at{" "}
                {selectedTimeSlot}
              </p>
              <button
                onClick={resetForm}
                className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Book Another Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalBooking;
