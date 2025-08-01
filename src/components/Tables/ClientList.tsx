import { useState, useEffect } from "react";
import {
  Button,
  message,
  Tooltip,
} from "antd";
import axios from "axios";
import { PackagePatient } from "../../types/package";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit } from "@mui/icons-material";
import AppointmentModal from "../AppointmentModal";

const ClientList = () => {
  const [packageData, setPackageData] = useState<PackagePatient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PackagePatient | null>(null);

  const navigate = useNavigate();

  // Modal handlers
  const showModal = (patient: PackagePatient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const fetchPackageData = async () => {
    try {
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `/patient/getAll/${hospitalIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            CurrentUserId: sessionStorage.getItem("useridentifier"),
            HospitalIdentifier: hospitalIdentifier,
          },
        },
      );
      const data: PackagePatient[] = response.data;
      console.log(response.data);
      setPackageData(data);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error("Error fetching package data:", error);
      message.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchPackageData();
  }, []);

  const deletePatient = async (patientIdentifier: string) => {
    try {
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");
      await axios.delete(`/patient/${patientIdentifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          HospitalIdentifier: hospitalIdentifier,
        },
      });
      fetchPackageData();
    } catch (error) {
      message.error("Error fetching data");
    }
  };

  const paginatedData = packageData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const redirectToCreatePatient = () => {
    navigate("/patientForm");
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
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Full Name
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Phone Number
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  DOB
                </th>
                <th className="font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((packageItem, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {packageItem.username}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {packageItem.phone}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {packageItem.email}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {packageItem.dob}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <Tooltip title="Add Appointment">
                        <button
                          className="hover:text-primary"
                          onClick={() => showModal(packageItem)}
                        >
                          <AddIcon />
                        </button>
                      </Tooltip>
                      {/* <Tooltip title="Edit Patient">
                        <button 
                          className="hover:text-primary"
                          onClick={() => navigate(`/editPatient/${packageItem.patientIdentifier}`)}
                        >
                          <Edit />
                        </button>
                      </Tooltip> */}
                      {/* Delete Appointment Button */}
                      {/* permission based button */}
                      <Tooltip title="Delete Patient">
                        <button
                          className="hover:text-primary"
                          onClick={() =>
                            deletePatient(packageItem.patientIdentifier)
                          }
                        >
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

      {/* Appointment Modal */}
      {selectedPatient && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          patientIdentifier={selectedPatient.patientIdentifier}
          patientName={selectedPatient.username}
        />
      )}
    </div>
  );
};

export default ClientList;
