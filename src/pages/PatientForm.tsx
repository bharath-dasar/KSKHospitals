import { AutoComplete, message } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DOB from "../components/Forms/DatePicker/DOB";
import axios from "axios";

// Types
interface PatientFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  age: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: string;
  time: string;
  doctorName: string;
  symptoms: string;
  height: string;
  weight: string;
  bloodPressure: string;
  pulse: string;
  randomBloodSugar: string;
  bmi: string;
  bodyFat: string;
  visceralFat: string;
  skeletalMuscle: string;
  boneMass: string;
  bmr: string;
  bodyWater: string;
  bodyTemperature: string;
  gender: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface Doctor {
  label: string;
  value: string;
}

const PatientForm = () => {
  // State management
  const [formData, setFormData] = useState<PatientFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    age: "",
    dateOfBirth: "",
    address: "",
    medicalHistory: "",
    time: "",
    doctorName: "",
    symptoms: "",
    height: "",
    weight: "",
    bloodPressure: "",
    pulse: "",
    randomBloodSugar: "",
    bmi: "",
    bodyFat: "",
    visceralFat: "",
    skeletalMuscle: "",
    boneMass: "",
    bmr: "",
    bodyWater: "",
    bodyTemperature: "",
    gender: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const [selectedGender, setSelectedGender] = useState<string>("");
  const [isGenderSelected, setIsGenderSelected] = useState<boolean>(false);
  const [showAppointmentFields, setShowAppointmentFields] = useState(false);
  const [showDetailsFields, setShowDetailsFields] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const navigate = useNavigate();

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      const { token } = getAuthData();
      const designationIdentifier = "a45f6bce-72cc-4be4-b70f-519b89eec3df";
      
      const response = await axios.get(`/user/filterUserByDesignation/${designationIdentifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        const doctorsList: Doctor[] = response.data.map((user: any) => ({
          label: `Dr. ${user.name}`,
          value: user.identifier
        }));
        
        setDoctors(doctorsList);
        setFilteredDoctors(doctorsList);
        console.log("Doctors fetched successfully:", response);
      }
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      message.error("Failed to fetch doctors. Please contact admin.");
      setDoctors([]);
      setFilteredDoctors([]);
    }
  };

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 5) return 'Name must be at least 5 characters';
        return '';
      
      case 'phoneNumber':
        if (!value) return 'Phone number is required';
        if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        return '';
      
      case 'gender':
        if (!value) return 'Gender is required';
        return '';
      
      case 'symptoms':
        if (value && value.trim().length < 10) return 'Symptoms must be at least 10 characters';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validate required fields
    const requiredFields = ['fullName', 'phoneNumber', 'email', 'dateOfBirth'];
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof PatientFormData] as string);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    // Validate gender selection
    if (!selectedGender) {
      errors.gender = 'Gender is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Utility functions
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, dateOfBirth: date }));
    if (validationErrors.dateOfBirth) {
      setValidationErrors(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    setIsGenderSelected(true);
    if (validationErrors.gender) {
      setValidationErrors(prev => ({ ...prev, gender: '' }));
    }
  };



  // API functions
  const createPatient = async (): Promise<void> => {
    try {
      const { token, hospitalIdentifier, userIdentifier } = getAuthData();
      
      const requestBody = {
        patientId: 0,
        identifier: userIdentifier,
        status: "ACTIVE",
        username: formData.fullName,
        dob: formData.dateOfBirth,
        age: calculateAge(formData.dateOfBirth).toString(),
        gender: selectedGender,
        phone: formData.phoneNumber,
        email: formData.email,
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        patientStatus: "ACTIVE",
        hospitalIdentifier: hospitalIdentifier,
        healthMetrics: {
          createdBy: userIdentifier,
          createdDateTime: new Date().toISOString(),
          updatedBy: userIdentifier,
          updatedDateTime: new Date().toISOString(),
          height: formData.height,
          weight: formData.weight,
          bloodPressure: formData.bloodPressure,
          pulse: formData.pulse,
          randomBloodSugar: formData.randomBloodSugar,
          bmi: formData.bmi,
          bodyFat: formData.bodyFat,
          visceralFat: formData.visceralFat,
          skeletalMuscle: formData.skeletalMuscle,
          boneMass: formData.boneMass,
          bmr: formData.bmr,
          bodyWater: formData.bodyWater,
          bodyTemperature: formData.bodyTemperature,
        },
      };

      const response = await axios.post("/patient", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          HospitalIdentifier: hospitalIdentifier,
        },
      });

      message.success("Patient created successfully");
      navigate("/clientList");
    } catch (error: any) {
      console.error("Error creating patient:", error);
      
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

  const createAppointment = async (): Promise<void> => {
    try {
      const { token, hospitalIdentifier, userIdentifier } = getAuthData();

      // Validate appointment fields
      if (!formData.doctorName || !formData.time || !formData.symptoms) {
        message.error("Please fill in all required appointment fields");
        return;
      }

      const requestBody = {
        appointmentIdentifier: crypto.randomUUID(),
        hospitalIdentifier: hospitalIdentifier,
        patientIdentifier: userIdentifier,
        doctorIdentifier: formData.doctorName,
        dateTime: formData.time,
        reason: formData.symptoms,
        status: "OPEN",
      };

      const response = await axios.post("/appointment", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: userIdentifier,
          HospitalIdentifier: hospitalIdentifier,
        },
      });

      if (response.status === 200 || response.status === 201) {
        message.success("Appointment created successfully");
        resetForm();
      }
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      message.error("Failed to create appointment. Please try again.");
    }
  };

  // Form submission
  const handleCreatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation checks
    if (!formData.fullName.trim()) {
      message.error("Name is required");
      return;
    }

    // Name validation - must be at least 5 characters
    if (formData.fullName.trim().length < 5) {
      message.error("Name must be at least 5 characters");
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

    // Date of birth validation
    if (!formData.dateOfBirth) {
      message.error("Date of birth is required");
      return;
    }

    // Gender validation
    if (!selectedGender) {
      message.error("Please select a gender");
      return;
    }

    if (!validateForm()) {
      message.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      await createPatient();
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    // Appointment validation
    if (!formData.doctorName) {
      message.error("Please select a doctor");
      return;
    }

    if (!formData.time) {
      message.error("Please select appointment time");
      return;
    }

    if (!formData.symptoms.trim()) {
      message.error("Please describe the symptoms");
      return;
    }

    if (formData.symptoms.trim().length < 10) {
      message.error("Symptoms description must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      await createAppointment();
    } finally {
      setLoading(false);
    }
  };

  // UI state handlers
  const handleStartAppointment = () => setShowAppointmentFields(true);
  const handleCloseAppointment = () => setShowAppointmentFields(false);
  const handleAddMoreDetails = () => setShowDetailsFields(true);
  const handleHideMoreDetails = () => setShowDetailsFields(false);

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      age: "",
      dateOfBirth: "",
      address: "",
      medicalHistory: "",
      time: "",
      doctorName: "",
      symptoms: "",
      height: "",
      weight: "",
      bloodPressure: "",
      pulse: "",
      randomBloodSugar: "",
      bmi: "",
      bodyFat: "",
      visceralFat: "",
      skeletalMuscle: "",
      boneMass: "",
      bmr: "",
      bodyWater: "",
      bodyTemperature: "",
      gender: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    });
    setSelectedGender("");
    setIsGenderSelected(false);
    setValidationErrors({});
  };

  // Render helper functions
  const renderInputField = (
    name: keyof PatientFormData,
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
    name: keyof PatientFormData,
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
              Patient Form
            </h3>
          </div>
          <form onSubmit={handleCreatePatient}>
            <div className="p-6.5">
              {/* Basic Information */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('fullName', 'Full name', 'text', 'Enter your full name', true)}
                {renderInputField('phoneNumber', 'Phone Number', 'text', 'Enter your Phone number', true)}
                <div className="w-full xl:w-1/2">
                  <DOB onDateChange={handleDateChange} />
                  {validationErrors.dateOfBirth && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.dateOfBirth}</div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                {renderInputField('email', 'Email', 'email', 'Enter your email address', true)}
                
                {/* Gender Selection */}
                <div className="w-full xl:w-1/4">
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Gender <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        value={selectedGender}
                        onChange={(e) => handleGenderChange(e.target.value)}
                        className={`relative z-20 w-full appearance-none rounded border py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:focus:border-primary ${
                          isGenderSelected ? "text-black dark:text-white" : ""
                        } ${
                          validationErrors.gender 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-stroke dark:border-form-strokedark'
                        } bg-transparent`}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select your Gender
                        </option>
                        <option value="MALE" className="text-body dark:text-bodydark">Male</option>
                        <option value="FEMALE" className="text-body dark:text-bodydark">Female</option>
                        <option value="OTHER" className="text-body dark:text-bodydark">Others</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g opacity="0.8">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                    {validationErrors.gender && (
                      <div className="text-red-500 text-sm mt-1">{validationErrors.gender}</div>
                    )}
                  </div>
                </div>

                <div className="py-8.5 w-full xl:w-1/4">
                  {!showDetailsFields && (
                    <button
                      type="button"
                      onClick={handleAddMoreDetails}
                      className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                      Add More Patient Details
                    </button>
                  )}
                </div>
              </div>

              {/* Address Information */}
              {renderTextArea('address', 'Address')}
              {renderTextArea('addressLine2', 'Address line 2')}
              
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('state', 'State', 'text', 'Enter your State')}
                {renderInputField('country', 'Country', 'text', 'Enter your Country')}
                {renderInputField('postalCode', 'Postal Code', 'text', 'Enter your Postal Code')}
              </div>

              {/* Health Metrics */}
              {showDetailsFields && (
                <div className="mt-6">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    {renderInputField('height', 'Height (cm)', 'number', 'Enter height')}
                    {renderInputField('weight', 'Weight (kg)', 'number', 'Enter weight')}
                    {renderInputField('bloodPressure', 'Blood Pressure', 'text', 'e.g., 120/80')}
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    {renderInputField('pulse', 'Pulse (bpm)', 'number', 'Enter pulse')}
                    {renderInputField('randomBloodSugar', 'RBS (mg/dL)', 'number', 'Enter RBS')}
                    {renderInputField('bmi', 'BMI', 'number', 'Enter BMI')}
                    {renderInputField('bodyWater', 'Body Water', 'number', 'Enter Body Water')}
                    {renderInputField('bodyTemperature', 'Body Temperature', 'number', 'Enter Body Temperature')}
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    {renderInputField('bodyFat', 'Body Fat', 'number', 'Enter Body Fat')}
                    {renderInputField('visceralFat', 'Visceral Fat(%)', 'number', 'Enter Visceral Fat percentage')}
                    {renderInputField('skeletalMuscle', 'Skeletal Muscle(%)', 'number', 'Enter Skeletal Muscle percentage')}
                    {renderInputField('boneMass', 'Bone Mass', 'number', 'Enter Bone Mass')}
                    {renderInputField('bmr', 'Basal Metabolic Rate in kcal/day', 'number', 'Enter BMR')}
                  </div>
                </div>
              )}

              {/* Appointment Section */}
              {showAppointmentFields && (
                <div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    {renderInputField('time', 'Appointment Time', 'time')}
                    <div className="w-full xl:w-1/4">
                      <DOB onDateChange={handleDateChange} />
                    </div>
                  </div>
                  
                  <div className="mb-4.5 flex flex-col xl:flex-row">
                    <div className="w-full xl:w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Doctor's Name
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          value={formData.doctorName}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, doctorName: e.target.value }));
                          }}
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          <option
                            value=""
                            disabled
                            className="text-body dark:text-bodydark"
                          >
                            Select Doctor
                          </option>
                          {doctors.map((doctor) => (
                            <option
                              key={doctor.value}
                              value={doctor.value}
                              className="text-body dark:text-bodydark"
                            >
                              {doctor.label}
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
                  
                  {renderTextArea('symptoms', 'Symptoms', 4, 'Describe symptoms')}
                  
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={handleCreateAppointment}
                      disabled={loading}
                      className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {loading ? 'Creating Appointment...' : 'Schedule Appointment'}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {showDetailsFields && (
                  <button
                    type="button"
                    onClick={handleHideMoreDetails}
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    Hide Patient Details
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Creating Patient...' : 'Create Patient'}
                </button>
                
                {!showAppointmentFields && (
                  <button
                    type="button"
                    onClick={handleStartAppointment}
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    Start Appointment
                  </button>
                )}
                
                {showAppointmentFields && (
                  <button
                    type="button"
                    onClick={handleCloseAppointment}
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    Close Appointment
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
