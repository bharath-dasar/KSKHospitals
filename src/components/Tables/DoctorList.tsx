import React, { useState, useEffect } from 'react';
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
        setDoctorData([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [pageSize]);
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

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentDoctors = doctorData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Doctor Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Phone
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Role
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Designation
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                City
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                State
              </th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((doctor, index) => (
              <tr key={doctor.identifier}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    Dr. {doctor.name}
                  </h5>
                  <p className="text-sm">{doctor.designationDetails || 'No details'}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{doctor.email}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{doctor.phone}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{doctor.role}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{doctor.designation?.name || 'N/A'}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{doctor.address?.city || 'N/A'}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{doctor.address?.state || 'N/A'}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, doctorData.length)} of {doctorData.length} doctors
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
