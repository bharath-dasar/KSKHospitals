import { useState, useEffect } from "react";
import { Button } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import { Package } from "../../types/package";
import { Edit } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [packageData, setPackageData] = useState<Package[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState(() => sessionStorage.getItem('selectedHospital') || 'ALL');

  const fetchPackageData = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token is missing in sessionStorage");
      return;
    }
    try {
      let url = '';
      if (selectedHospital === 'ALL') {
        url = 'user/getAll';
      } else {
        url = `user/getAll/hospital/${selectedHospital}`;
      }
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setPackageData(Array.isArray(data) ? data : []);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error("Error fetching package data:", error);
      setPackageData([]); // Ensure packageData is always an array
    }
  };

  const paginatedData = packageData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchPackageData();
    const handler = () => {
      setSelectedHospital(sessionStorage.getItem('selectedHospital') || 'ALL');
      setCurrentPage(1);
    };
    window.addEventListener('hospitalChanged', handler);
    return () => window.removeEventListener('hospitalChanged', handler);
  }, [selectedHospital]);

  function userdelete(identifier: string) {
    const deleteFunc = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        console.error("Token is missing in sessionStorage");
        return;
      }
      try {
        await axios.delete(`user/${identifier}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Remove deleted user from UI
        setPackageData((prevData) =>
          prevData.filter((user) => user.identifier !== identifier),
        );

        // ✅ Update pagination after deletion
        setTotalPages((_prev) =>
          Math.ceil((packageData.length - 1) / pageSize),
        );
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };
    deleteFunc();
  }

  return (
    <div>
      <div className="flex justify-end py-4">
        <Button
          type="primary"
          onClick={() => navigate("/createUser")}
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
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Name
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Phone Number
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Role
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
                paginatedData.map((packageItem, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {packageItem.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {packageItem.email}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {packageItem.phone}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {packageItem.role}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        {/* <button className="hover:text-primary">
                          <Edit />
                        </button> */}
                        <button
                          className="hover:text-primary"
                          onClick={() => userdelete(packageItem.identifier)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No users available
                  </td>
                </tr>
              )}
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
              className={`py-2 px-4 ${
                currentPage === totalPages ? "opacity-50" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
