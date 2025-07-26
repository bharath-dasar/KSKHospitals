import { AutoComplete, message } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Doctor {
  label: string;
  value: string;
}

const doctors = [
  { label: 'Cardiology', value: 'Cardiology' },
  { label: 'Dermatology', value: 'Dermatology' },
  { label: 'Pediatrics', value: 'Pediatrics' },
];

const DoctorForm = () => {
  const [formData, setFormData] = useState({
    id: 0,
    lastName: '',
    firstName: '',
    specialization: '',
    experience: 0,
  });
  
  const [apiDoctors, setApiDoctors] = useState<Doctor[]>([]);
  const navigate = useNavigate(); 

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in sessionStorage");
        return;
      }

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
        
        setApiDoctors(doctorsList);
        console.log("Doctors fetched successfully:", doctorsList);
      }
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      message.error("Failed to fetch doctors. Please contact admin.");
      setApiDoctors([]);
    }
  };

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'experience' ? parseInt(value) : value });
  };

  const handleSpecializationChange = (value: string) => {
    setFormData({ ...formData, specialization: value });
  };

  const handleCreateDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/createDoctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        message.success('Doctor created successfully');
        navigate('/doctorList');
      } else {
        message.error('Failed to create doctor');
      }
    } catch (error) {
      message.error('Error creating doctor');
      console.error('Error creating doctor:', error);
    }
  };

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Doctor Form</h3>
          </div>
          <form onSubmit={handleCreateDoctor}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    First Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Last Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className=" block text-black dark:text-white">
                    Specialization <span className="text-meta-1">*</span>
                  </label>
                  <AutoComplete
                    options={doctors}
                    className="w-full  border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    style={{ width: '100%', height: '85%'}}
                    onSelect={handleSpecializationChange}
                    placeholder="Select specialization"
                    value={formData.specialization}
                    onSearch={handleSpecializationChange}
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Years of Experience <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="experience"
                    placeholder="Enter experience in years"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Create Doctor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorForm;
