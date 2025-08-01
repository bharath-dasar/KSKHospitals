import { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from '@mui/icons-material';

interface MedicalItem {
  id: number;
  medicineName: string;
  dosage: string;
  manufacturer: string;
  expiryDate: string;
  quantity: number;
}

const MedicalList = () => {
  const [medicalData, setMedicalData] = useState<MedicalItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const [selectedHospital, setSelectedHospital] = useState(() => sessionStorage.getItem('selectedHospital') || 'ALL');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        // Since medicine API might not exist, we'll show empty data for now
        // You can replace this with the actual medicine API when available
        setMedicalData([]);
        setTotalPages(1);
        console.log('Medicine API not implemented yet');
      } catch (error) {
        setMedicalData([]);
        setTotalPages(1);
        console.error('Error fetching medical data:', error);
      }
    };
    fetchMedicalData();
    const handler = () => {
      setSelectedHospital(sessionStorage.getItem('selectedHospital') || 'ALL');
      setCurrentPage(1);
    };
    window.addEventListener('hospitalChanged', handler);
    return () => window.removeEventListener('hospitalChanged', handler);
  }, [selectedHospital]);

  const paginatedData = medicalData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const redirectToAddMedicine = () => {
    navigate('/addMedicine'); // Update the route to your "Add Medicine" form
  };

  return (
    <div>
      <div className="flex justify-end py-4">
        <Button
          type="primary"
          onClick={redirectToAddMedicine}
          className="inline-flex items-center justify-center bg-primary py-2 px-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-4"
        >
          Add Medicine
        </Button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Medicine Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Dosage</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Manufacturer</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Expiry Date</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Quantity</th>
                <th className="font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((medicalItem, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{medicalItem.medicineName}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{medicalItem.dosage}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{medicalItem.manufacturer}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{medicalItem.expiryDate}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{medicalItem.quantity}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <Tooltip title="Edit Medicine">
                        <button className="hover:text-primary">
                          <Edit />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete Medicine">
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

export default MedicalList;
