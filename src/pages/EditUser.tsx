import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import DOB from "../components/Forms/DatePicker/DOB";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  dob: string;
  age: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface Designation {
  identifier: string;
  name: string;
}

const EditUser = () => {
  const { userIdentifier } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    role: "",
    designation: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    dob: "",
    age: "",
  });

  const [selectedDesignation, setSelectedDesignation] = useState<{identifier: string, name: string} | null>(null);
  const [isDesignationSelected, setIsDesignationSelected] = useState<boolean>(false);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    if (userIdentifier) {
      fetchUserData();
    } else {
      message.error("User identifier is missing");
    }
  }, [userIdentifier]);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setInitialLoading(true);
      const token = sessionStorage.getItem("token");
      
      if (!token) {
        message.error("Authentication token not found");
        return;
      }

      const response = await axios.get(`/user/GetUserByIdentifier/${userIdentifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;
      
      // Populate form with user data
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.role || "",
        designation: "",
        addressLine1: userData.address?.addressLine1 || "",
        addressLine2: userData.address?.addressLine2 || "",
        city: userData.address?.city || "",
        state: userData.address?.state || "",
        country: userData.address?.country || "",
        postalCode: userData.address?.postalCode || "",
        dob: userData.dob || "",
        age: userData.age || "",
      });

      // Set designation if available
      if (userData.designation) {
        setSelectedDesignation(userData.designation);
        setIsDesignationSelected(true);
      }

    } catch (error: any) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user data");
    } finally {
      setInitialLoading(false);
    }
  };

  // Fetch designations
  const fetchDesignations = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in sessionStorage");
        return;
      }

      const response = await axios.get(`/user/getAllDesignations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 200) {
        setDesignations(response.data);
      }
    } catch (error) {
      message.error("Error getting all designations contact admin");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return '';
      
      case 'phone':
        if (!value) return 'Phone number is required';
        if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'role':
        if (!value) return 'Role is required';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validate required fields
    const requiredFields = ['name', 'phone', 'email', 'role'];
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof UserFormData] as string);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      age: age.toString(),
      dob: dob,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date: string) => {
    calculateAge(date);
  };

  const changeDesignationTextColor = () => {
    setIsDesignationSelected(true);
  };

  const updateUser = async (): Promise<void> => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        message.error("Authentication token not found");
        return;
      }

      const requestBody = {
        identifier: userIdentifier,
        dob: formData.dob,
        age: formData.age,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: "", // Password field is required but we don't update it in edit
        phone: formData.phone,
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        hospitalIdentifier: sessionStorage.getItem("HospitalIdentifier"),
        designationDetails: selectedDesignation?.name || "",
        designation: selectedDesignation,
      };

      const response = await axios.put(`/user`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("User updated successfully");
      navigate("/userList");
    } catch (error: any) {
      console.error("Error updating user:", error);
      
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

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      message.error("Please fix the validation errors");
      return;
    }

    if (!selectedDesignation) {
      message.error("Please select a designation");
      return;
    }

    setLoading(true);
    try {
      await updateUser();
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    name: keyof UserFormData,
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
    name: keyof UserFormData,
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

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Edit User
            </h3>
          </div>
          <form onSubmit={handleUpdateUser}>
            <div className="p-6.5">
              {/* Basic Information */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('name', 'Full Name', 'text', 'Enter your full name', true)}
                {renderInputField('phone', 'Phone Number', 'text', 'Enter your phone number', true)}
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                {renderInputField('email', 'Email', 'email', 'Enter your email address', true)}
                <div className="w-full xl:w-1/2">
                  <DOB onDateChange={handleDateChange} />
                </div>
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Role <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      validationErrors.role 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-stroke dark:border-form-strokedark'
                    } bg-transparent`}
                  >
                    <option value="" disabled className="text-body dark:text-bodydark">Select your Role</option>
                    <option value="MEMBER" className="text-body dark:text-bodydark">MEMBER</option>
                    <option value="ADMIN" className="text-body dark:text-bodydark">ADMIN</option>
                    <option value="OWNER" className="text-body dark:text-bodydark">OWNER</option>
                    <option value="SUPERUSER" className="text-body dark:text-bodydark">SUPERUSER</option>
                  </select>
                  {validationErrors.role && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.role}</div>
                  )}
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Designation <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      value={selectedDesignation?.identifier || ""}
                      onChange={(e) => {
                        const selectedDesignationItem = designations.find(d => d.identifier === e.target.value);
                        setSelectedDesignation(selectedDesignationItem || null);
                        changeDesignationTextColor();
                      }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isDesignationSelected ? "text-black dark:text-white" : ""
                      }`}
                    >
                      <option value="" disabled className="text-body dark:text-bodydark">
                        Select your Designation
                      </option>
                      {designations.map((designation) => (
                        <option
                          key={designation.identifier}
                          value={designation.identifier}
                          className="text-body dark:text-bodydark"
                        >
                          {designation.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {renderTextArea('addressLine1', 'Address Line 1')}
              {renderTextArea('addressLine2', 'Address Line 2')}
              
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('city', 'City', 'text', 'Enter your city')}
                {renderInputField('state', 'State', 'text', 'Enter your state')}
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('country', 'Country', 'text', 'Enter your country')}
                {renderInputField('postalCode', 'Postal Code', 'text', 'Enter your postal code')}
              </div>

              {/* Action Buttons */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Updating User...' : 'Update User'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser; 