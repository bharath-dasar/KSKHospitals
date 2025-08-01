import React, { useState } from 'react';

interface CustomDOBProps {
  onDateChange: (date: string) => void;
  value?: string;
  label?: string;
  required?: boolean;
}

const CustomDOB: React.FC<CustomDOBProps> = ({ 
  onDateChange, 
  value = "", 
  label = "Date of Birth",
  required = false 
}) => {
  const [selectedDate, setSelectedDate] = useState(value);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    onDateChange(date);
  };

  // Convert date string to YYYY-MM-DD format for input
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="w-full">
      <label className="mb-2.5 block text-black dark:text-white">
        {label} {required && <span className="text-meta-1">*</span>}
      </label>
      <input
        type="date"
        value={formatDateForInput(selectedDate)}
        onChange={handleDateChange}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        max={new Date().toISOString().split('T')[0]} // Prevent future dates
      />
    </div>
  );
};

export default CustomDOB; 