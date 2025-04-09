import { AutoComplete, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOB from "../components/Forms/DatePicker/DOB";
import axios from "axios";

const doctors = [
  { label: "Dr. John Smith", value: "Dr. John Smith" },
  { label: "Dr. Emily White", value: "Dr. Emily White" },
  { label: "Dr. Michael Brown", value: "Dr. Michael Brown" },
];

const PatientForm = () => {
  const [formData, setFormData] = useState({
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

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };
  const [showAppointmentFields, setShowAppointmentFields] = useState(false);
  const [showDetailsFields, setShowDetailsFields] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const navigate = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, dateOfBirth: date });
  };
  const calculateAge = (dob: string): number => {
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
    return age;
  };

  const handleCreatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
    const useridentifier = sessionStorage.getItem("userIdentifier");
    if (!token) {
      console.error("Token is missing in sessionStorage");
      return;
    }
    const requestBody = {
      patientId: 0,
      identifier: useridentifier,
      status: "ACTIVE",
      username: formData.fullName,
      dob: formData.dateOfBirth,
      age: calculateAge(formData.dateOfBirth).toString(),
      gender: selectedOption, // tbd
      phone: formData.phoneNumber,
      email: formData.email,
      address: {
        // tbd
        addressLine1: formData.addressLine1, // tbd
        addressLine2: formData.addressLine2, // tbd
        city: formData.city, // tbd
        state: formData.state, // tbd
        country: formData.country, // tbd
        postalCode: formData.postalCode, // tbd
      },
      patientStatus: "ACTIVE",
      hospitalIdentifier: hospitalIdentifier,
      healthMetrics: {
        createdBy: useridentifier,
        createdDateTime: new Date().toISOString(),
        updatedBy: useridentifier,
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

    try {
      const response = await axios.post("/patient", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          HospitalIdentifier: hospitalIdentifier,
        },
      });

      message.success("Patient Created ");
      navigate("/clientList");
    } catch (error) {
      if (error.response) {
        console.log(
          "Error response:",
          error.response.data,
          error.response.status,
        ); // Debugging log

        if (error.response.status === 400) {
          const errorData = error.response.data;

          // Convert object to a readable error message
          const errorMessage = Object.values(errorData).join(", ");
          message.error("Error in creating user: " + errorMessage);
        } else {
          message.error("Unexpected error: " + error.response.status);
        }
      } else if (error.request) {
        message.error("No response from server. Please try again.");
      } else {
        message.error("Request failed: " + error.message);
      }
    }
  };

  // Handle typeahead for Doctor's Name
  const handleDoctorSearch = (value: string) => {
    setFilteredDoctors(
      doctors.filter((doctor) =>
        doctor.value.toLowerCase().includes(value.toLowerCase()),
      ),
    );
    setFormData({ ...formData, doctorName: value });
  };

  const handleCreateAppointment = async () => {
    try {
      const response = await fetch("/api/createAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      message.error("Error creating appointment");
    }
  };

  const handleCreateAppointment1 = async () => {
    try {
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");

      const fromDate = new Date(); // Example: Set the start date dynamically
      const toDate = new Date(); // Example: Set the end date dynamically
      const requestBody = {
        appointmentIdentifier: "11",
        hospitalIdentifier: hospitalIdentifier,
        patientIdentifier: "0f360bc8-0dc8-46b0-8d94-e153dbbafdd5",
        doctorIdentifier: "fac2251e-30ba-4538-9df0-69719ceb7b5d",
        dateTime: "2025-03-30T17:57:46.999Z",
        reason: "Mild Concussions",
        status: "OPEN",
      };

      const response = await axios.post(`/appointment`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          HospitalIdentifier: hospitalIdentifier,
        },
      });
    } catch (error) {
      console.error("Error fetching package data:", error);
      message.error("Error fetching data");
    }
  };

  const handleStartAppointment = async () => {
    setShowAppointmentFields(true);
  };
  const handleCloseAppointment = async () => {
    setShowAppointmentFields(false);
  };

  const handleAddMoreDetails = async () => {
    setShowDetailsFields(true);
  };
  const handleHideMoreDetails = async () => {
    setShowDetailsFields(false);
  };

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
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Full name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
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
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
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
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/4">
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {" "}
                      Gender{" "}
                    </label>

                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        value={selectedOption}
                        onChange={(e) => {
                          setSelectedOption(e.target.value);
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
                          Select your Gender
                        </option>
                        <option
                          value="MALE"
                          className="text-body dark:text-bodydark"
                        >
                          Male
                        </option>
                        <option
                          value="FEMALE"
                          className="text-body dark:text-bodydark"
                        >
                          Female
                        </option>
                        <option
                          value="OTHER"
                          className="text-body dark:text-bodydark"
                        >
                          Others
                        </option>
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
              <div className="mb-3">
                <label className="mb-2.5 block text-black dark:text-white">
                  Address
                </label>
                <textarea
                  name="address"
                  rows={1}
                  placeholder="Type here"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
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
              {/*<div className="mb-6">*/}
              {/*  <label className="mb-2.5 block text-black dark:text-white">*/}
              {/*    Previous Medical History / Remarks*/}
              {/*  </label>*/}
              {/*  <textarea*/}
              {/*    name="medicalHistory"*/}
              {/*    rows={6}*/}
              {/*    placeholder="Type here"*/}
              {/*    value={formData.medicalHistory}*/}
              {/*    onChange={handleChange}*/}
              {/*    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"*/}
              {/*  ></textarea>*/}
              {/*</div>*/}
              {/* Additional Fields */}
              {showDetailsFields && (
                <div className="mt-6">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="Enter height"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="w-full xl:w-1/3">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Enter weight"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="w-full xl:w-1/3">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Blood Pressure
                      </label>
                      <input
                        type="text"
                        name="bloodPressure"
                        value={formData.bloodPressure}
                        onChange={handleChange}
                        placeholder="e.g., 120/80"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Pulse (bpm)
                      </label>
                      <input
                        type="number"
                        name="pulse"
                        value={formData.pulse}
                        onChange={handleChange}
                        placeholder="Enter pulse"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        RBS (mg/dL)
                      </label>
                      <input
                        type="number"
                        name="randomBloodSugar"
                        value={formData.randomBloodSugar}
                        onChange={handleChange}
                        placeholder="Enter RBS"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        BMI
                      </label>
                      <input
                        type="number"
                        name="bmi"
                        value={formData.bmi}
                        onChange={handleChange}
                        placeholder="Enter BMI"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Body Water
                      </label>
                      <input
                        type="number"
                        name="bodyWater"
                        value={formData.bodyWater}
                        onChange={handleChange}
                        placeholder="Enter Body Water"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Body Temperature
                      </label>
                      <input
                        type="number"
                        name="bodyTemperature"
                        value={formData.bodyTemperature}
                        onChange={handleChange}
                        placeholder="Enter Body Temperature"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Body Fat
                      </label>
                      <input
                        type="number"
                        name="bodyFat"
                        value={formData.bodyFat}
                        onChange={handleChange}
                        placeholder="Enter Body Fat"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Visceral Fat(%)
                      </label>
                      <input
                        type="number"
                        name="visceralFat"
                        value={formData.visceralFat}
                        onChange={handleChange}
                        placeholder="Enter Visceral Fat percentage"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Skeletal Muscle(%)
                      </label>
                      <input
                        type="number"
                        name="skeletalMuscle"
                        value={formData.skeletalMuscle}
                        onChange={handleChange}
                        placeholder="Enter Skeletal Muscle percentage"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Bone Mass
                      </label>
                      <input
                        type="number"
                        name="boneMass"
                        value={formData.boneMass}
                        onChange={handleChange}
                        placeholder="Enter Bone Mass"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Basal Metabolic Rate in kcal/day
                      </label>
                      <input
                        type="number"
                        name="bmr"
                        value={formData.bmr}
                        onChange={handleChange}
                        placeholder="Enter BMR"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
              {showAppointmentFields && (
                <div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/4">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Appointment Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-full xl:w-1/4">
                      <DOB onDateChange={handleDateChange} />
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col xl:flex-row">
                    <div className="w-full xl:w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Doctor's Name
                      </label>
                      <AutoComplete
                        className="w-full  border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        options={filteredDoctors}
                        style={{ width: "100%", height: "85%" }}
                        onSearch={handleDoctorSearch}
                        onSelect={(value) =>
                          setFormData({ ...formData, doctorName: value })
                        }
                        placeholder="Select doctor's name"
                        value={formData.doctorName}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Symptoms
                    </label>
                    <textarea
                      name="symptoms"
                      rows={4}
                      placeholder="Describe symptoms"
                      value={formData.symptoms}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={handleCreateAppointment}
                      className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                      Schedule Appointment
                    </button>
                  </div>
                </div>
              )}

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
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Create Patient
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
