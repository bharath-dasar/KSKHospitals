import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import DOB from "../components/Forms/DatePicker/DOB";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dob: "",
    email: "",
    phoneNumber: "",
    role: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    hospitalIdentifier: "",
    designation: "",
    password: "",
    retypePassword: "",
    phone: "",
  });
  const [selectedOption, setSelectedOption] = useState<{identifier: string, name: string} | null>(null);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [designations, setDesignations] = useState<Array<{identifier: string, name: string}>>([]);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };
  const navigate = useNavigate();
  const validateField = (name: string, value: string) => {
    const errors: {[key: string]: string} = {};
    
    switch (name) {
      case 'phoneNumber':
        if (value && !/^\d{10}$/.test(value)) {
          errors.phoneNumber = 'Phone number must be exactly 10 digits';
        }
        else{
          errors.phoneNumber = "";
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        else{
          errors.email = "";
        }
        break;
      case 'name':
        if (value && !value.trim()) {
          errors.name = 'Name is required';
        }
        else{
          errors.name = "";
        }
        break;
      case 'designation':
        if (value && !value.trim()) {
          errors.designation = 'Designation is required';
        }
        else{
          errors.designation = "";
        }
        break;
    }
    
    setValidationErrors(prev => ({ ...prev, ...errors }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
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

  const handleDateChange = (date: string) => {
    calculateAge(date);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the browser from appending form values to URL
    
    // Validation checks
    if (formData.password !== formData.retypePassword) {
      message.error("Both the passwords don't match");
      return;
    }

    // Phone number validation - must be exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      message.error("Phone number must be exactly 10 digits");
      return;
    }

    // Email validation - must contain @ and have proper format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      message.error("Please enter a valid email address");
      return;
    }

    // Name validation - must not be empty
    if (!formData.name.trim()) {
      message.error("Name is required");
      return;
    }

    // Role validation - must be selected
    if (!selectedOption) {
      message.error("Please select a role");
      return;
    }
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token is missing in sessionStorage");
      return;
    }

    const requestBody = {
      identifier: sessionStorage.getItem("userIdentifier"),
      dob: formData.dob,
      age: formData.age,
      name: formData.name,
      email: formData.email,
      designation: selectedOption,
      password: formData.password, //tbd
      phone: formData.phoneNumber,
      address: {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
      },
      hospitalIdentifier: sessionStorage.getItem("HospitalIdentifier"),
    };
    try {
      const response = await axios.post("/user", requestBody, {
        headers: {
          "Content-Type": "application/json",
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        message.success("User Created ");
        navigate("/userList");
      }
    } catch (error) {
      message.error("error in creating user");
    }
  };

  const handleGetAllDesignations = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token is missing in sessionStorage");
      return;
    }

    try {
      const response = await axios.get(`/user/getAllDesignations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        // message.success("All designations retrieved successfully");
        console.log(response.data);
        setDesignations(response.data);
      }
    } catch (error) {
      message.error("Error getting all designations contact admin");
      console.error(error);
    }
  };

  // useEffect to call handleGetAllDesignations on component mount
  useEffect(() => {
    handleGetAllDesignations();
  }, []);

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              User Form
            </h3>
          </div>
          <form onSubmit={handleCreateUser}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Full name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      validationErrors.name 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-stroke dark:border-form-strokedark'
                    } bg-transparent`}
                  />
                  {validationErrors.name && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.name}</div>
                  )}
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone Number <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter your Phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      validationErrors.phoneNumber 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-stroke dark:border-form-strokedark'
                    } bg-transparent`}
                  />
                  {validationErrors.phoneNumber && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</div>
                  )}
                </div>
                <div className="w-full xl:w-1/2">
                  <DOB onDateChange={handleDateChange} />
                </div>
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      validationErrors.email 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-stroke dark:border-form-strokedark'
                    } bg-transparent`}
                  />
                  {validationErrors.email && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.email}</div>
                  )}
                </div>
                <div className="mb-3 w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Address line 1
                  </label>
                  <textarea
                    name="addressLine1"
                    rows={1}
                    placeholder="Type here"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Address line 2
                </label>
                <textarea
                  name="addressLine2"
                  rows={1}
                  placeholder="Type here"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter your State"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Enter your Country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Enter your Postal Code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="" disabled>
                      Select your Role
                    </option>
                    <option value="MEMBER">MEMBER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="OWNER">OWNER</option>
                  </select>
                </div>
                <div className="w-full xl:w-1/2">
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {" "}
                      Designation{" "}
                    </label>

                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        value={selectedOption?.identifier || ""}
                        onChange={(e) => {
                          const selectedDesignation = designations.find(d => d.identifier === e.target.value);
                          setSelectedOption(selectedDesignation || null);
                          changeTextColor();
                        }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                          isOptionSelected ? "text-black dark:text-white" : ""
                        }`}
                      >
                        <option
                          value=""
                          disabled
                          className="text-body dark:text-bodydark"
                        >
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
              </div>
              <div className="mb-1 flex flex-col gap-6 xl:flex-row">
                {/* Password Field */}
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Retype Password Field */}
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Retype Password
                  </label>
                  <input
                    type="password"
                    name="retypePassword"
                    placeholder="Re-enter your password"
                    value={formData.retypePassword}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-2.5 mt-4 flex flex-col gap-6 xl:flex-row ">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Create User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
