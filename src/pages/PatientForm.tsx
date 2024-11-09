import { AutoComplete, message } from 'antd';
import { useState } from 'react';
import DatePickerOne from '../components/Forms/DatePicker/DatePickerOne';
import SelectGroupOne from '../components/Forms/SelectGroup/SelectGroupOne';
import { Navigate, useNavigate } from 'react-router-dom';

const doctors = [
  { label: 'Dr. John Smith', value: 'Dr. John Smith' },
  { label: 'Dr. Emily White', value: 'Dr. Emily White' },
  { label: 'Dr. Michael Brown', value: 'Dr. Michael Brown' },
];

const PatientForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    age: '',
    dateOfBirth: '',
    medicalHistory: '',
    time: '',
    doctorName: '',
    height: '',
    weight: '',
    symptoms: '',
  });
  const [showAppointmentFields, setShowAppointmentFields] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const navigate = useNavigate(); 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  const handleCreatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/createPatient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log('Patient created successfully');
        message.success('Patient created successfully')
        navigate('/clientList')
      } else {
        console.log('Failed to create patient');
        message.error('Failed to create patient')
      }
    } catch (error) {
      message.error('Error to create patient')
      console.error('Error creating patient:', error);
    }

  };

  // Handle typeahead for Doctor's Name
  const handleDoctorSearch = (value: string) => {
    setFilteredDoctors(
      doctors.filter((doctor) =>
        doctor.value.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFormData({ ...formData, doctorName: value });
  };

  const handleCreateAppointment = async () => {
    try {
      const response = await fetch('/api/createAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log('Appointment created successfully');
        message.success('Appointment created successfully');
      } else {
        console.log('Failed to create appointment');
        message.error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      message.error('Error creating appointment');
    }
  };

  const handleStartAppointment = async () => {
    setShowAppointmentFields(true);
  };
  const handleCloseAppointment = async () => {
    setShowAppointmentFields(false);
  };

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Patient Form</h3>
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
                  <DatePickerOne onDateChange={handleDateChange} />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="mb-4.5 w-full xl:w-1/2">
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
                <div className="mb-4.5 w-full xl:w-1/4">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Age <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="mb-4.5 w-full xl:w-1/4">
                  <SelectGroupOne />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">Previous Medical History</label>
                <textarea
                  name="medicalHistory"
                  rows={6}
                  placeholder="Type here"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
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
                  <DatePickerOne onDateChange={handleDateChange} />
                </div>
                <div className="w-full xl:w-1/4">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    placeholder="Enter height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/4">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    placeholder="Enter weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
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
                    style={{ width: '100%',height: '85%' }}
                    onSearch={handleDoctorSearch}
                    onSelect={(value) => setFormData({ ...formData, doctorName: value })}
                    placeholder="Select doctor's name"
                    value={formData.doctorName}
                  />

                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">Symptoms</label>
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
                </button>)}
                {showAppointmentFields && (
                <button
                  type="button"
                  onClick={handleCloseAppointment}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Close Appointment
                </button>)}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;