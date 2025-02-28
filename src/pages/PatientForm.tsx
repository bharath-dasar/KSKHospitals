import { AutoComplete, message } from "antd";
import React, { useState } from "react";
import SelectGroupOne from "../components/Forms/SelectGroup/SelectGroupOne";
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

  const handleCreatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
    const useridentifier = sessionStorage.getItem("useridentifier");
    if (!token) {
      console.error("Token is missing in sessionStorage");
      return;
    }
    const requestBody = {
      patientId: 0,
      identifier: sessionStorage.getItem("userIdentifier"),
      status: "ACTIVE",
      username: formData.fullName,
      dob: formData.dateOfBirth,
      age: formData.age,
      gender: formData.gender, // tbd
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
        createdDateTime: new Date(),
        updatedBy: useridentifier,
        updatedDateTime: new Date(),
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

    const requestBody2 = {
      patientId: 0,
      identifier: "string",
      status: "ACTIVE",
      username: "string",
      dob: "2025-02-28",
      age: "string",
      gender: "MALE",
      phone: "string",
      email: "string",
      address: {
        addressLine1: "string",
        addressLine2: "string",
        city: "string",
        state: "string",
        country: "string",
        postalCode: "string",
      },
      patientStatus: "ACTIVE",
      hospitalIdentifier: "string",
      healthMetrics: {
        createdBy: "string",
        createdDateTime: "2025-02-28T19:12:24.983Z",
        updatedBy: "string",
        updatedDateTime: "2025-02-28T19:12:24.983Z",
        height: 0,
        weight: 0,
        bloodPressure: "string",
        pulse: 0,
        randomBloodSugar: 0,
        bmi: 0,
        bodyFat: 0,
        visceralFat: 0,
        skeletalMuscle: 0,
        boneMass: 0,
        bmr: 0,
        bodyWater: 0,
        bodyTemperature: 0,
      },
      diseases: [
        {
          createdBy: "string",
          createdDateTime: "2025-02-28T19:12:24.983Z",
          updatedBy: "string",
          updatedDateTime: "2025-02-28T19:12:24.983Z",
          identifier: "string",
          name: "string",
          description: "string",
          status: "string",
        },
      ],
      patientIdentifier: "string",
    };

    try {
      const response = await axios.post("/patients", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          HospitalIdentifier: hospitalIdentifier,
        },
      });
      if (response.status === 200) {
        message.success("User Created ");
        navigate("/clientList");
      }
    } catch (error) {
      message.error("error in creating user");
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
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Appointment created successfully");
        message.success("Appointment created successfully");
      } else {
        console.log("Failed to create appointment");
        message.error("Failed to create appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      message.error("Error creating appointment");
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
                  <SelectGroupOne />
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
                        value={formData.bmi}
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
