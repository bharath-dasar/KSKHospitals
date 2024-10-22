import { useState } from 'react';
import DatePickerOne from '../components/Forms/DatePicker/DatePickerOne';
import SelectGroupOne from '../components/Forms/SelectGroup/SelectGroupOne';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    age: '',
    dateOfBirth: '',
    medicalHistory: '',
  });

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
      } else {
        console.log('Failed to create patient');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  const handleCreateAppointment = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
      } else {
        console.log('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
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
                <div className="w-1/2 xl:w-1/2">
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
                <div className="w-1/2 xl:w-1/2">
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
                <div className="mb-4.5 w-1/2 xl:w-1/4">
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
                <div className="mb-4.5 w-1/2 xl:w-1/4">
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

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <button
                  type="submit"
                  className="flex w-1/2 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Create Patient
                </button>
                <button
                  type="button"
                  onClick={handleCreateAppointment}
                  className="flex w-1/2 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Create Appointment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;