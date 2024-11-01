import { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import axios from 'axios';
import { PackagePatient } from '../../types/package'; 
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from '@mui/icons-material';

const ClientList = () => {
  const [packageData, setPackageData] = useState<PackagePatient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await axios.get('/api/userlist'); // Replace with your API URL
        const data: PackagePatient[] = response.data;
        setPackageData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
      } catch (error) {
        console.error('Error fetching package data:', error);
        // Fallback data for testing
        const fallbackData: PackagePatient[] = [
          // Example data, replace with actual structure
          { id: 1, fullName: 'Jon Snow', age: 35, phoneNumber: '123-456-7890', email: 'jon@example.com', dob: '1989-01-01' },
          { id: 2, fullName: 'Cersei Lannister', age: 42, phoneNumber: '123-456-7891', email: 'cersei@example.com', dob: '1982-01-01' },
          { id: 3, fullName: 'Jaime Lannister', age: 45, phoneNumber: '123-456-7892', email: 'jaime@example.com', dob: '1979-01-01' },
          { id: 4, fullName: 'Arya Stark', age: 16, phoneNumber: '123-456-7893', email: 'arya@example.com', dob: '2008-01-01' },
          // Add more fallback data as needed
        ];
        setPackageData(fallbackData);
        setTotalPages(Math.ceil(fallbackData.length / pageSize));
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

  const redirectToCreatePatient = () => {
    navigate('/patientForm'); 
  };

  return (
    <div>
      <div className="flex justify-end py-4">
        <Button
          type="primary"
          onClick={redirectToCreatePatient}
          className="inline-flex items-center justify-center bg-primary py-2 px-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-4"
        >
          Create Patient
        </Button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Full Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Age</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Phone Number</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">DOB</th>
                <th className="font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((packageItem, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{packageItem.fullName}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-bla  ck dark:text-white">{packageItem.age}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{packageItem.phoneNumber}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{packageItem.email}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{packageItem.dob}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <Tooltip title="Add Appointment">
                        <button className="hover:text-primary">
                          <AddIcon />
                        </button>
                      </Tooltip>
                      <Tooltip title="Edit Appointment">
                        <button className="hover:text-primary">
                          <Edit/>
                        </button>
                      </Tooltip>

                      {/* Delete Appointment Button */}
                      <Tooltip title="Delete Appointment">
                        <button className="hover:text-primary">
                          <DeleteIcon />
                        </button>
                      </Tooltip>
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
    </div>
  );
};

export default ClientList;