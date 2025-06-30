import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';

const DateRangePicker = ({ onSelectDateRange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handleApply = () => {
    onSelectDateRange(dateRange[0].startDate, dateRange[0].endDate);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 rounded-full hover:bg-gray-200 transition"
      >
        📅
      </button>
      
      {showPicker && (
        <div className="absolute z-50 right-0 mt-2 bg-white p-4 rounded-lg shadow-xl border border-gray-200"
          style={{ width: '350px' }}>
          <DateRange
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
          />
          
          <div className="flex justify-between mt-4">
            <div className="text-sm">
              Selected: {format(dateRange[0].startDate, 'dd/MM/yyyy')} - {format(dateRange[0].endDate, 'dd/MM/yyyy')}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowPicker(false)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleApply}
                className="px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;