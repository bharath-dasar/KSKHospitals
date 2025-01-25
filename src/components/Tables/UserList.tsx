import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Select } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Package } from '../../types/package';
import { Edit } from '@mui/icons-material';
import { Option } from 'antd/es/mentions';
import Column from 'antd/es/table/Column';

const UserList = () => {
  // Explicitly define the type of packageData
  const [packageData, setPackageData] = useState<Package[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phoneNumber: '',
    role: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    hospitalIdentifier: '',
    designation: '',
  }); 

  // Fetch data from API
  useEffect(() => {
    const fetchPackageData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('Token is missing in sessionStorage');
        return;
      }
      try {
        const response = await fetch(`http://localhost:8081/kskhospital/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send token as Bearer token
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Package[] = await response.json();
        console.log("__yashasisgay",data)
        setPackageData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
      } catch (error) {
        console.error('Error fetching package data:', error);
      }
    };

    fetchPackageData();
  }, []);

  const paginatedData = packageData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token is missing in sessionStorage');
      return;
    }
  
    // Map formData to match the API's expected request body
    const requestBody = {
      dob:"11122024", // Example static value for dob
      age: formData.age,
      name: `${formData.name}`, // Combining name and lastName
      email: formData.email,
      role: formData.role, // Static value for role
      phone: formData.phoneNumber,
      address: {
        address: 'Sample Address Line 1', // Replace with appropriate field
        addressLine2: 'Sample Address Line 2', // Replace with appropriate field
        city: 'Sample City', // Replace with appropriate field
        state: 'Sample State', // Replace with appropriate field
        country: 'Sample Country', // Replace with appropriate field
        postalCode: '123456', // Replace with appropriate field
      },
      hospitalIdentifier: 'SampleHospitalIdentifier', // Replace with appropriate field
      designation: 'Sample Designation', // Replace with appropriate field
    };
    console.log("requestBody",requestBody)
    try {
      const response = await fetch('http://localhost:8081/kskhospital/user', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'curIdentifier': '8c520cd7-e799-47a8-8dde-80420a443c13',
          'Authorization': `Bearer ${token}`, // Send token as Bearer token
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      console.log('Form submitted successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      {/* Create User button that opens the modal */}
      <div className="flex justify-end py-4">
        <Button
          type="primary"
          onClick={showModal}
          className="inline-flex items-center justify-center bg-primary py-2 px-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-4"
        >
          Create User
        </Button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {/* <th className="min-w-[20px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Id</th> */}
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Name</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">E Mail</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Phone Number</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Role</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((packageItem, key) => (
                <tr key={key}>
                  {/* <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{packageItem.id}</h5>
                  </td> */}
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{packageItem.name}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{packageItem.email}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{packageItem.phone}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{packageItem.role}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <Edit />
                      </button>
                      <button className="hover:text-primary">
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`py-2 px-4 ${currentPage === 1 ? 'opacity-50' : ''}`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`py-2 px-4 ${currentPage === totalPages ? 'opacity-50' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {/* <Modal title="Create User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <label className="py-2 block text-black dark:text-white">First Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="py-2 block text-black dark:text-white">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="py-2 block text-black dark:text-white">Role</label>
          <Select
            value={formData.role}
            onChange={(value) => handleInputChange({ target: { name: 'role', value } })}
            placeholder="Select Role"
            className="w-full"
          >
            <Option value="Admin">Admin</Option>
            <Option value="Doctor">Doctor</Option>
            <Option value="Patient">Patient</Option>
            <Option value="Receptionist">Receptionist</Option>
          </Select>
        </div>
        <div>
          <label className="py-2 block text-black dark:text-white">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="py-2 block text-black dark:text-white">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="py-2 block text-black dark:text-white">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
            placeholder="Address Line 1"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="py-2 block text-black dark:text-white">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="py-2 block text-black dark:text-white">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="State"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="py-2 block text-black dark:text-white">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder="Postal Code"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="py-2 block text-black dark:text-white">Hospital Identifier</label>
          <input
            type="text"
            name="hospitalIdentifier"
            value={formData.hospitalIdentifier}
            onChange={handleInputChange}
            placeholder="Hospital Identifier"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="py-2 block text-black dark:text-white">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            placeholder="Designation"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
      </Modal> */}
      
      <Modal title="Create User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {[
          { label: 'Name', name: 'name' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Phone Number', name: 'phoneNumber' },
          { label: 'Address Line 1', name: 'addressLine1' },
          { label: 'City', name: 'city' },
          { label: 'State', name: 'state' },
          { label: 'Postal Code', name: 'postalCode' },
          { label: 'Hospital Identifier', name: 'hospitalIdentifier' },
          { label: 'Designation', name: 'designation' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label className="py-2 block text-black dark:text-white">{label}</label>
            <input
              type={type}
              name={name}
              value={(formData as any)[name]}
              onChange={handleInputChange}
              placeholder={label}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        ))}
        <div>
          <label className="py-2 block text-black dark:text-white">Role</label>
          <Select
            value={formData.role}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
            placeholder="Select Role"
            className="w-full"
          >
            {['Admin', 'Doctor', 'Patient', 'Receptionist'].map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>

    </div>
  );
};

export default UserList;
