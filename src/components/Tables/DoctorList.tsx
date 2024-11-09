import { useEffect, useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Doctor } from '../../types/doctor'; // Define the Doctor type with fields like id, lastName, firstName, specialization, experience
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const data: Doctor[] = [
  { id: 1, lastName: 'Smith', firstName: 'John', specialization: 'Cardiology', experience: 15 },
  { id: 2, lastName: 'Johnson', firstName: 'Emily', specialization: 'Neurology', experience: 10 },
  { id: 3, lastName: 'Williams', firstName: 'Michael', specialization: 'Orthopedics', experience: 8 },
  { id: 4, lastName: 'Brown', firstName: 'Sarah', specialization: 'Pediatrics', experience: 12 },
  { id: 5, lastName: 'Jones', firstName: 'David', specialization: 'Dermatology', experience: 20 },
  { id: 6, lastName: 'Garcia', firstName: 'Laura', specialization: 'Oncology', experience: 11 },
  { id: 7, lastName: 'Martinez', firstName: 'Chris', specialization: 'Radiology', experience: 7 },
  { id: 8, lastName: 'Davis', firstName: 'Jessica', specialization: 'Gastroenterology', experience: 9 },
  { id: 9, lastName: 'Lopez', firstName: 'Daniel', specialization: 'Urology', experience: 14 },
  { id: 10, lastName: 'Gonzalez', firstName: 'Sophia', specialization: 'Ophthalmology', experience: 5 },
  { id: 11, lastName: 'Wilson', firstName: 'James', specialization: 'ENT', experience: 6 },
  { id: 12, lastName: 'Anderson', firstName: 'Linda', specialization: 'Rheumatology', experience: 13 },
  { id: 13, lastName: 'Thomas', firstName: 'Robert', specialization: 'Pulmonology', experience: 18 },
  { id: 14, lastName: 'Moore', firstName: 'Patricia', specialization: 'Nephrology', experience: 16 },
  { id: 15, lastName: 'Taylor', firstName: 'Jennifer', specialization: 'Psychiatry', experience: 4 },
];
const DoctorsList = () => {
  const [doctorData, setDoctorData] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate(); 


  const pageSize = 10;
  // Fetch doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get('/api/doctors'); // Replace with the doctors API endpoint
        const data: Doctor[] = response.data;
        setDoctorData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
      } catch (error) {
        setDoctorData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
        console.error('Error fetching doctor data:', error);
      }
    };
    fetchDoctorData();
  }, []);

  // Get paginated data
  const paginatedData = doctorData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const redirectToCreatePatient = () => {
    navigate('/doctorForm'); 
  };

  return (
    <div>
<div className="flex justify-end py-4">
        <Button
          type="primary"
          onClick={redirectToCreatePatient}
          className="inline-flex items-center justify-center bg-primary py-2 px-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-4"
        >
          Create Doctor
        </Button>
      </div>
<div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[20px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Id
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Last name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                First Name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Specialization
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Experience (years)
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((doctor, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {doctor.id}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {doctor.lastName}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {doctor.firstName}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {doctor.specialization}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {doctor.experience}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      <RemoveRedEyeIcon />
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
    </div>
  );
};

export default DoctorsList;
