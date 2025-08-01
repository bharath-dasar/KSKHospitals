import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

interface HospitalFormData {
  hospitalName: string;
  hospitalIdentifier: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const CreateHospital = () => {
  const [formData, setFormData] = useState<HospitalFormData>({
    hospitalName: "",
    hospitalIdentifier: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'hospitalName':
        if (!value.trim()) return 'Hospital name is required';
        if (value.trim().length < 3) return 'Hospital name must be at least 3 characters';
        return '';
      
      case 'phone':
        if (!value) return 'Phone number is required';
        if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'city':
        if (!value.trim()) return 'City is required';
        return '';
      
      case 'state':
        if (!value.trim()) return 'State is required';
        return '';
      
      case 'country':
        if (!value.trim()) return 'Country is required';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validate required fields
    const requiredFields = ['hospitalName', 'phone', 'email', 'city', 'state', 'country'];
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof HospitalFormData] as string);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      message.error("Please fix the validation errors");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      message.error("Authentication token not found");
      return;
    }

    const requestBody = {
      hospitalName: formData.hospitalName,
      address: {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
      },
      phone: formData.phone,
      email: formData.email,
    };

    setLoading(true);
    try {
      const response = await axios.post("/hospital", requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        message.success("Hospital created successfully");
        navigate("/hospitals");
      }
    } catch (error: any) {
      console.error("Error creating hospital:", error);
      
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
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    name: keyof HospitalFormData,
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
        value={formData[name]}
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
    name: keyof HospitalFormData,
    label: string,
    rows: number = 1,
    placeholder: string = "Type here"
  ) => (
    <div className="mb-3">
      <label className="mb-2.5 block text-black dark:text-white">
        {label}
      </label>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>
  );

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create Hospital
            </h3>
          </div>
          <form onSubmit={handleCreateHospital}>
            <div className="p-6.5">
              {/* Basic Information */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('hospitalName', 'Hospital Name', 'text', 'Enter hospital name', true)}
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                {renderInputField('phone', 'Phone Number', 'text', 'Enter phone number', true)}
                {renderInputField('email', 'Email', 'email', 'Enter email address', true)}
              </div>

              {/* Address Information */}
              {renderTextArea('addressLine1', 'Address Line 1')}
              {renderTextArea('addressLine2', 'Address Line 2')}
              
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('city', 'City', 'text', 'Enter city', true)}
                {renderInputField('state', 'State', 'text', 'Enter state', true)}
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('country', 'Country', 'text', 'Enter country', true)}
                {renderInputField('postalCode', 'Postal Code', 'text', 'Enter postal code')}
              </div>

              {/* Action Buttons */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Creating Hospital...' : 'Create Hospital'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHospital; 