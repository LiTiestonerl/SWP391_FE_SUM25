import React from 'react';

const MonthNavigator = ({ currentMonth, onMonthChange }) => {
  return (
    <div className="text-center mb-8 mt-18">
      <div className="flex justify-center items-center gap-6 p-3 bg-gradient-to-r from-gray-200 to-gray-300 bg-opacity-80 rounded-xl shadow-lg">
        <button
          onClick={() => onMonthChange(-1)}
          className="px-4 py-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 text-gray-600 hover:text-gray-800"
          aria-label="Previous month"
        >
          ←
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800">
          {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        
        <button
          onClick={() => onMonthChange(1)}
          className="px-4 py-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 text-gray-600 hover:text-gray-800"
          aria-label="Next month"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default MonthNavigator;