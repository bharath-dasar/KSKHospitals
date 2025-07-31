import { useState, useEffect } from 'react';
import { Button, Tooltip, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from '@mui/icons-material';

interface BedItem {
  hospitalBedIdentifier: string;
  roomNumber: string;
  bedType: string;
  status: string;
  active: boolean;
  price: number;
  taxPercentage: number;
  description: string;
  hospitalIdentifier: string;
}

const BedsList = () => {
  const [bedsData, setBedsData] = useState<BedItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 8;

  const navigate = useNavigate();

  useEffect(() => {
    fetchBedsData();
  }, []);

  const fetchBedsData = async () => {
    try {
      setLoading(true);
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");
      
      if (!hospitalIdentifier || !token) {
        message.error("Authentication information is missing");
        return;
      }

      const response = await axios.get(`/hospital/bed/getAll/${hospitalIdentifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          HospitalIdentifier: hospitalIdentifier,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const data: BedItem[] = response.data;
        setBedsData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
      } else {
        setBedsData([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching beds data:', error);
      message.error("Error fetching beds data");
      setBedsData([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const paginatedData = bedsData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const redirectToAddBed = () => {
    navigate('/createBed');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'text-green-600 bg-green-100';
      case 'OCCUPIED':
        return 'text-red-600 bg-red-100';
      case 'MAINTENANCE':
        return 'text-yellow-600 bg-yellow-100';
      case 'RESERVED':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Available';
      case 'OCCUPIED':
        return 'Occupied';
      case 'MAINTENANCE':
        return 'Maintenance';
      case 'RESERVED':
        return 'Reserved';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading beds...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end py-4">
        <Button
          type="primary"
          onClick={redirectToAddBed}
          className="inline-flex items-center justify-center bg-primary py-2 px-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-4"
        >
          Add Bed
        </Button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Room Number</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Bed Type</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Active</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Price (₹)</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Tax (%)</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Description</th>
                <th className="font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((bedItem, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">{bedItem.roomNumber}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{bedItem.bedType}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bedItem.status)}`}>
                        {getStatusText(bedItem.status)}
                      </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bedItem.active 
                          ? 'text-green-600 bg-green-100' 
                          : 'text-red-600 bg-red-100'
                      }`}>
                        {bedItem.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">₹{bedItem.price}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{bedItem.taxPercentage}%</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white max-w-xs truncate" title={bedItem.description}>
                        {bedItem.description}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <Tooltip title="Edit Bed">
                          <button className="hover:text-primary">
                            <Edit />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete Bed">
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
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No beds found
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

export default BedsList; 