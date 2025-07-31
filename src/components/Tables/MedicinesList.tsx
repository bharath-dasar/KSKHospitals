import { useState, useEffect } from 'react';
import { Button, Tooltip, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from '@mui/icons-material';

interface MedicalItem {
  identifier: string;
  name: string;
  hsn: number;
  description: string;
  gst: number;
  category: string;
  unit: string;
  stock_qty: number;
  mrp: number;
  selling_price: number;
}

const MedicalList = () => {
  const [medicalData, setMedicalData] = useState<MedicalItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 8;

  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicalData();
  }, []);

  const fetchMedicalData = async () => {
    try {
      setLoading(true);
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");
      
      if (!hospitalIdentifier || !token) {
        message.error("Authentication information is missing");
        return;
      }

      const response = await axios.get('/product/getAll', {
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          HospitalIdentifier: hospitalIdentifier,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const data: MedicalItem[] = response.data;
        setMedicalData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
      } else {
        setMedicalData([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching medical data:', error);
      message.error("Error fetching medical data");
      setMedicalData([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const paginatedData = medicalData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const redirectToAddMedicine = () => {
    navigate('/addMedicine');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading medicines...</div>
      </div>
    );
  }

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
                <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Description</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Category</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">HSN</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">GST (%)</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Unit</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Stock Qty</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">MRP</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Selling Price</th>
                <th className="font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((medicalItem, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">{medicalItem.name}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{medicalItem.description}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{medicalItem.category}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{medicalItem.hsn}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{medicalItem.gst}%</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{medicalItem.unit}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{medicalItem.stock_qty}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">₹{medicalItem.mrp}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">₹{medicalItem.selling_price}</p>
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
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-gray-500">
                    No medicines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalList;
