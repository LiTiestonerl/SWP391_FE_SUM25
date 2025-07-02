import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaDollarSign,
  FaFileAlt,
} from "react-icons/fa";
import { format } from "date-fns";

const Overview = () => {
  const [dateRange, setDateRange] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);

  const mockData = {
    totalUsers: 15789,
    totalCoaches: 234,
    totalRevenue: 458920,
    totalPosts: 3567,
    userGrowth: 12.5,
    coachGrowth: 8.3,
    revenueGrowth: 15.7,
    postGrowth: 23.4,
  };

  const chartData = [
    { name: "Jan", users: 1200 },
    { name: "Feb", users: 1900 },
    { name: "Mar", users: 2400 },
    { name: "Apr", users: 2800 },
    { name: "May", users: 3500 },
    { name: "Jun", users: 4200 },
    { name: "Jul", users: 4800 },
    { name: "Aug", users: 5600 },
    { name: "Sep", users: 6200 },
    { name: "Oct", users: 6800 },
    { name: "Nov", users: 7400 },
    { name: "Dec", users: 8000 },
  ];

  const MetricCard = ({ title, value, icon: Icon, growth, color, prefix }) => (
    <div className="p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div
          className={`flex items-center ${
            growth >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          <span className="text-sm font-semibold">{Math.abs(growth)}%</span>
          <span className="ml-1">{growth >= 0 ? "↑" : "↓"}</span>
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's your latest analytics
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Users"
          value={mockData.totalUsers}
          icon={FaUsers}
          growth={mockData.userGrowth}
          color="bg-blue-500"
          prefix=""
        />
        <MetricCard
          title="Total Coaches"
          value={mockData.totalCoaches}
          icon={FaChalkboardTeacher}
          growth={mockData.coachGrowth}
          color="bg-purple-500"
          prefix=""
        />
        <MetricCard
          title="Total Revenue"
          value={mockData.totalRevenue}
          icon={FaDollarSign}
          growth={mockData.revenueGrowth}
          color="bg-green-500"
          prefix="$"
        />
        <MetricCard
          title="Total Posts"
          value={mockData.totalPosts}
          icon={FaFileAlt}
          growth={mockData.postGrowth}
          color="bg-orange-500"
          prefix=""
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            User Registration Trends
          </h2>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorUsers)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Overview;
