import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FaTasks, FaFileAlt, FaDollarSign, FaMedal } from "react-icons/fa";
import api from "../../../configs/axios";

const Overview = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quitplansRes, postsRes, paymentsRes, badgesRes] =
          await Promise.all([
            api.get("/admin/dashboard/users/monthly"),
            api.get("/admin/dashboard/posts"),
            api.get("/admin/dashboard/payments"),
            api.get("/admin/dashboard/coaches/monthly"),
          ]);

        const quitplansData = quitplansRes.data;
        const badgesData = badgesRes.data;
        const posts = postsRes.data;
        const payments = paymentsRes.data;

        const totalUsers = quitplansData.reduce(
          (acc, current) => acc + current.count,
          0
        );
        const totalCoaches = badgesData.reduce(
          (acc, current) => acc + current.count,
          0
        );

        setData({
          posts,
          payments,
          totalUsers,
          totalCoaches,
        });

        // Chart hiển thị số lượng user và coach
        setChartData([
          { name: "Users", value: totalUsers },
          { name: "Coaches", value: totalCoaches },
        ]);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const MetricCard = ({ title, value, icon: Icon, color, prefix = "" }) => (
    <div className="p-6 rounded-lg shadow bg-white hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );

  if (isLoading || !data) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2">Quick statistics snapshot</p>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total User"
          value={data.totalUsers}
          icon={FaTasks}
          color="bg-blue-500"
        />
        <MetricCard
          title="Total Posts"
          value={data.posts.totalPosts}
          icon={FaFileAlt}
          color="bg-yellow-500"
        />
        <MetricCard
          title="Total Revenue"
          value={data.payments.totalRevenue}
          icon={FaDollarSign}
          color="bg-green-500"
          prefix="$"
        />
        <MetricCard
          title="Total Coach"
          value={data.totalCoaches}
          icon={FaMedal}
          color="bg-purple-500"
        />
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Số lượng Users và Coaches
        </h2>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                formatter={(value) => [`${value.toLocaleString()}`, "Số lượng"]}
                contentStyle={{
                  backgroundColor: "#FFF",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "Users" ? "#3B82F6" : "#8B5CF6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Overview;
