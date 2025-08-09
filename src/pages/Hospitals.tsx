import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Button } from "antd";
import { useNavigate } from "react-router-dom";

interface Hospital {
  hospitalName: string;
  hospitalIdentifier: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  phone: string;
  email: string;
}

const Hospitals = () => {
  const [hospitalData, setHospitalData] = useState<Hospital[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const [selectedHospital, setSelectedHospital] = useState<string>(() => sessionStorage.getItem('selectedHospital') || 'ALL');
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem('role');

  const fetchHospitalData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        message.error("Authentication token not found");
        return;
      }
      const response = await axios.get(`/hospital`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data: Hospital[] = response.data;
      setHospitalData(data);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      message.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchHospitalData();
    const handler = () => {
      setSelectedHospital(sessionStorage.getItem('selectedHospital') || 'ALL');
      setCurrentPage(1);
    };
    window.addEventListener('hospitalChanged', handler);
    return () => window.removeEventListener('hospitalChanged', handler);
  }, []);

  // Filter hospitals based on selectedHospital
  const filteredData = selectedHospital === 'ALL'
    ? hospitalData
    : hospitalData.filter(h => h.hospitalIdentifier === selectedHospital);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / pageSize));
    if (currentPage > Math.ceil(filteredData.length / pageSize)) {
      setCurrentPage(1);
    }
  }, [filteredData.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const redirectToCreateHospital = () => {
    navigate("/createHospital");
  };

  return (
    <div>
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hospitals</h1>
        <p className="text-gray-600 mt-2">Manage and view all hospitals in the system</p>
      </div> */}
      
      {/* Create Hospital Button for Superusers */}
      {userRole === 'SUPERUSER' && (
        <div className="flex justify-end py-4">
          <Button
            type="primary"
            onClick={redirectToCreateHospital}
            className="inline-flex items-center justify-center bg-primary py-2 px-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-4"
          >
            Create Hospital
          </Button>
        </div>
      )}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Hospital</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">City</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Phone</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((hospital, key) => (
                <tr key={hospital.hospitalIdentifier}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{hospital.hospitalName}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{hospital.address.city}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{hospital.phone}</p>
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
              className={`py-2 px-4 ${currentPage === 1 ? "opacity-50" : ""}`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`py-2 px-4 ${currentPage === totalPages ? "opacity-50" : ""}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospitals; 