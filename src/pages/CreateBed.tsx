import { message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Types
interface BedFormData {
  roomNumber: string;
  bedType: string;
  status: string;
  active: boolean;
  price: string;
  taxPercentage: string;
  description: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const CreateBed = () => {
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState<BedFormData>({
    roomNumber: "",
    bedType: "",
    status: "AVAILABLE",
    active: true,
    price: "",
    taxPercentage: "",
    description: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'roomNumber':
        if (!value.trim()) return 'Room number is required';
        if (value.trim().length < 1) return 'Room number must be at least 1 character';
        return '';
      
      case 'bedType':
        if (!value.trim()) return 'Bed type is required';
        if (value.trim().length < 2) return 'Bed type must be at least 2 characters';
        return '';
      
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 5) return 'Description must be at least 5 characters';
        return '';
      
      case 'price':
        if (!value) return 'Price is required';
        if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Price must be a valid number';
        if (parseFloat(value) < 0) return 'Price cannot be negative';
        return '';
      
      case 'taxPercentage':
        if (!value) return 'Tax percentage is required';
        if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Tax percentage must be a valid number';
        const taxValue = parseFloat(value);
        if (taxValue < 0 || taxValue > 100) return 'Tax percentage must be between 0 and 100';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(field => {
      if (field !== 'active' && field !== 'status') { // Skip boolean and select fields
        const value = formData[field as keyof BedFormData];
        if (typeof value === 'string') {
          const error = validateField(field, value);
          if (error) {
            errors[field] = error;
            isValid = false;
          }
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const getAuthData = () => {
    const token = sessionStorage.getItem("token");
    const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
    const userIdentifier = sessionStorage.getItem("userIdentifier");

    if (!token || !hospitalIdentifier || !userIdentifier) {
      throw new Error("Authentication data is missing");
    }

    return { token, hospitalIdentifier, userIdentifier };
  };

  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // API functions
  const createBed = async (): Promise<void> => {
    try {
      const { token, hospitalIdentifier, userIdentifier } = getAuthData();
      
      const requestBody = {
        roomNumber: formData.roomNumber.trim(),
        bedType: formData.bedType.trim(),
        status: formData.status,
        active: formData.active,
        price: parseFloat(formData.price),
        taxPercentage: parseFloat(formData.taxPercentage),
        description: formData.description.trim(),
        hospitalIdentifier: hospitalIdentifier,
        hospitalBedIdentifier: crypto.randomUUID()
      };

      console.log('Request Body:', requestBody); // Debug log

      const response = await axios.post("/hospital/bed", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Bed created successfully");
      navigate("/bedsList");
    } catch (error: any) {
      console.error("Error creating bed:", error);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        const errorMessage = typeof errorData === 'object' 
          ? Object.values(errorData).join(", ")
          : errorData;
        message.error(`Validation error: ${errorMessage}`);
      } else if (error.response?.status) {
        message.error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        message.error("No response from server. Please try again.");
      } else {
        message.error(`Request failed: ${error.message}`);
      }
    }
  };

  // Form submission
  const handleCreateBed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      message.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      await createBed();
    } finally {
      setLoading(false);
    }
  };

  // Render helper functions
  const renderInputField = (
    name: keyof BedFormData,
    label: string,
    type: string = "text",
    placeholder: string = "",
    required: boolean = false
  ) => (
    <div className="w-full xl:w-1/2">
      <label className="mb-2.5 block text-black dark:text-white">
        {label} {required && <span className="text-meta-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name] as string}
        onChange={handleChange}
        className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white dark:focus:border-primary ${
          validationErrors[name] 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-stroke dark:border-form-strokedark'
        } bg-transparent`}
      />
      {validationErrors[name] && (
        <div className="text-red-500 text-sm mt-1">{validationErrors[name]}</div>
      )}
    </div>
  );

  const renderTextArea = (
    name: keyof BedFormData,
    label: string,
    rows: number = 3,
    placeholder: string = "Type here"
  ) => (
    <div className="mb-4.5">
      <label className="mb-2.5 block text-black dark:text-white">
        {label} <span className="text-meta-1">*</span>
      </label>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={formData[name] as string}
        onChange={handleChange}
        className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
          validationErrors[name] 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-stroke'
        } bg-transparent`}
      />
      {validationErrors[name] && (
        <div className="text-red-500 text-sm mt-1">{validationErrors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add New Bed
            </h3>
          </div>
          <form onSubmit={handleCreateBed}>
            <div className="p-6.5">
              {/* Basic Information */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('roomNumber', 'Room Number', 'text', 'Enter room number', true)}
                {renderInputField('bedType', 'Bed Type', 'text', 'e.g., General, ICU, Private', true)}
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Status <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="RESERVED">Reserved</option>
                  </select>
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Active Status
                  </label>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-black dark:text-white">Active</span>
                  </div>
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('price', 'Price (₹)', 'number', 'Enter bed price per day', true)}
                {renderInputField('taxPercentage', 'Tax Percentage (%)', 'number', 'Enter tax percentage', true)}
              </div>

              {/* Description */}
              {renderTextArea('description', 'Description', 3, 'Enter bed description...')}

              {/* Action Buttons */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Creating Bed...' : 'Create Bed'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBed; 