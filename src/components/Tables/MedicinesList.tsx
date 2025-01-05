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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        const response = await axios.get('/api/medicallist'); // Replace with your API URL
        const data: MedicalItem[] = response.data;
        setMedicalData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
      } catch (error) {
        console.error('Error fetching medical data:', error);
        // Fallback data for testing
        const fallbackData: MedicalItem[] = [
          {
            id: 1,
            medicineName: 'Paracetamol',
            dosage: '500mg',
            manufacturer: 'XYZ Pharma',
            expiryDate: '2025-12-01',
            quantity: 100,
          },
          {
            id: 2,
            medicineName: 'Ibuprofen',
            dosage: '200mg',
            manufacturer: 'ABC Pharma',
            expiryDate: '2024-06-15',
            quantity: 50,
          },
          {
            id: 3,
            medicineName: 'Amoxicillin',
            dosage: '250mg',
            manufacturer: 'PQR Pharma',
            expiryDate: '2023-11-10',
            quantity: 30,
          },
        ];
        setMedicalData(fallbackData);
        setTotalPages(Math.ceil(fallbackData.length / pageSize));
      }
    };

    fetchMedicalData();
  }, []);

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
