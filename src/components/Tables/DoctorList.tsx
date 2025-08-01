import { useEffect, useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Doctor } from '../../types/doctor';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const DoctorsList = () => {
  const [doctorData, setDoctorData] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedHospital, setSelectedHospital] = useState(() => sessionStorage.getItem('selectedHospital') || 'ALL');
  const pageSize = 7;
  const navigate = useNavigate();

  // Doctor designation identifier
  const DOCTOR_DESIGNATION_ID = 'a45f6bce-72cc-4be4-b70f-519b89eec3df';

  // Fetch doctors when hospital changes
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const hospitalIdentifier = sessionStorage.getItem('HospitalIdentifier');
        
        let url = '';
        if (selectedHospital === 'ALL') {
          // If ALL hospitals selected, we need to fetch from all hospitals
          // For now, we'll use the current user's hospital
          url = `/user/getAll/hospital/${hospitalIdentifier}`;
        } else {
          url = `/user/getAll/hospital/${selectedHospital}`;
        }
        
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter users to only show doctors (users with doctor designation)
        const allUsers = response.data;
        const doctors = allUsers.filter((user: any) => 
          user.designation?.identifier === DOCTOR_DESIGNATION_ID
        );
        
        setDoctorData(doctors);
        setTotalPages(Math.ceil(doctors.length / pageSize));
      } catch (error) {
        setDoctorData([]);
        setTotalPages(1);
        console.error('Error fetching doctor data:', error);
      }
    };
    fetchDoctorData();
    const handler = () => {
      setSelectedHospital(sessionStorage.getItem('selectedHospital') || 'ALL');
      setCurrentPage(1);
    };
    window.addEventListener('hospitalChanged', handler);
    return () => window.removeEventListener('hospitalChanged', handler);
  }, [selectedHospital]);

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
      <div className="flex justify-between items-center py-4">
        <Button
          type="primary"
          onClick={redirectToCreatePatient}
          className="inline-flex items-center justify-center bg-primary py-2 px-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-4"
        >
          Create Doctor
        </Button>
        {/* Designation dropdown removed as per user request */}
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Phone</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">City</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Designation</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((doctor, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{doctor.name}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{doctor.email}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{doctor.phone}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{doctor.address?.city}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{doctor.designation?.name}</p>
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
