import { useState, useEffect } from "react";
import { AutoComplete, Button, message, Modal, Tooltip } from "antd";
import axios from "axios";
import { PackagePatient } from "../../types/package";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit } from "@mui/icons-material";
import Date from "../Forms/DatePicker/Date";

const doctors = [
  { label: "Dr. John Smith", value: "Dr. John Smith" },
  { label: "Dr. Emily White", value: "Dr. Emily White" },
  { label: "Dr. Michael Brown", value: "Dr. Michael Brown" },
];

const ClientList = () => {
  const [packageData, setPackageData] = useState<PackagePatient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    time: "",
    date: "",
    doctorName: "",
    symptoms: "",
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Modal handlers
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date: date });
  };
  const handleOk = () => {
    console.log("Form Data:", formData);
    setIsModalOpen(false);
  };
  const handleDoctorSearch = (value: string) => {
    setFilteredDoctors(
      doctors.filter((doctor) =>
        doctor.value.toLowerCase().includes(value.toLowerCase()),
      ),
    );
    setFormData({ ...formData, doctorName: value });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
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
        console.log("________AAAAAAAA", response.data);
        const data: PackagePatient[] = response.data;
        setPackageData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
      } catch (error) {
        console.error("Error fetching package data:", error);
        message.error("Error fetching data");
      }
    };

    fetchPackageData();
  }, []);

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
                          onClick={showModal}
                        >
                          <AddIcon />
                        </button>
                      </Tooltip>
                      <Tooltip title="Edit Patient">
                        <button className="hover:text-primary">
                          <Edit />
                        </button>
                      </Tooltip>

                      {/* Delete Appointment Button */}
                      {/* permission based button */}
                      <Tooltip title="Delete Patient">
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
      {/* Modal */}
      <Modal
        title="Create Appointment"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Appointment Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-full xl:w-1/2">
              <Date onDateChange={handleDateChange} />
            </div>
          </div>
          <div className="mb-4.5 flex flex-col xl:flex-row">
            <div className="w-full xl:w-full">
              <label className=" block text-black dark:text-white">
                Doctor's Name
              </label>
              <AutoComplete
                className="w-full  border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                options={filteredDoctors}
                style={{ width: "100%", height: "85%" }}
                onSearch={handleDoctorSearch}
                onSelect={(value) =>
                  setFormData({ ...formData, doctorName: value })
                }
                placeholder="Select doctor's name"
                value={formData.doctorName}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Symptoms
            </label>
            <textarea
              name="symptoms"
              rows={4}
              placeholder="Describe symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
          </div>
          <div className="mb-6">
            <button
              type="button"
              // onClick={handleCreateAppointment}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              Schedule Appointment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientList;
