import React, { useEffect, useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Package } from '../../types/package';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Button, Modal } from 'antd'; // Importing Button and Modal from Ant Design

const UserList = () => {
  const [packageData, setPackageData] = useState<Package[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal handlers
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await axios.get('/api/userlist'); // Replace with your API URL
        const data: Package[] = response.data;
        setPackageData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
      } catch (error) {

        //to be removed
        const data: Package[] = [
          { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
          { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
          { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
          { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
          { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 1 },
          { id: 6, lastName: 'Melisandre', firstName: 'A', age: 150 },
          { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
          { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
          { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
          { id: 10, lastName: 'Baratheon', firstName: 'Robert', age: 40 },
          { id: 11, lastName: 'Tyrell', firstName: 'Margaery', age: 24 },
          { id: 12, lastName: 'Greyjoy', firstName: 'Theon', age: 30 },
          { id: 13, lastName: 'Bolton', firstName: 'Ramsay', age: 27 },
          { id: 14, lastName: 'Martell', firstName: 'Oberyn', age: 38 },
          { id: 15, lastName: 'Baelish', firstName: 'Petyr', age: 42 },
        ];
        setPackageData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
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
                <th className="min-w-[20px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Id</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Last name</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">First Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Age</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((packageItem, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{packageItem.id}</h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{packageItem.firstName}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{packageItem.lastName}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{packageItem.age}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {/* <button className="hover:text-primary">
                        <RemoveRedEyeIcon />
                      </button> */}
                      <button className="hover:text-primary">
                        <DeleteIcon />
                      </button>                      
                      <button className="hover:text-primary">
                        <EditOutlinedIcon />
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
            <span>Page {currentPage} of {totalPages}</span>
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
      <Modal title="Create User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <label className="block text-black dark:text-white py-2">
            First Name
          </label>
          <input
            type="text"
            placeholder="First Name"
            className="w-full rounded-lg border-[1px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-black dark:text-white py-2">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Last Name"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-black dark:text-white py-2">
            Age
          </label>
          <input
            type="number"
            placeholder="Age"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-black dark:text-white py-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-black dark:text-white py-2">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-black dark:text-white py-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-black dark:text-white py-2">
            Retype Password
          </label>
          <input
            type="password"
            placeholder="Retype Password"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserList;
