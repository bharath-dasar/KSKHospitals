import { useState, useEffect } from "react";
import {
  DatePicker,
  AutoComplete,
  Button,
  message,
  Modal,
  Tooltip,
} from "antd";
import axios from "axios";
import { PackagePatient } from "../../types/package";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit } from "@mui/icons-material";
import Date from "../Forms/DatePicker/Date";
import date from "../Forms/DatePicker/Date";

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
  const [usedPatientIdentifier, setUsedPatientIdentifier] =
    useState<String>("");
  const [usedDoctorIdentifier, setUsedDoctorIdentifier] = useState<String>("");

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [isoString, setIsoString] = useState("");

  const handleDateChange = (value: any) => {
    setSelectedDate(value);
    console.log("_____AAAAADate", value.toDate().toISOString());
    setFormData({ ...formData, date: value.toDate().toISOString() });
  };

  const handleConvert = () => {
    if (selectedDate) {
      // If selectedDate has a toDate method (e.g., dayjs), use it; otherwise, use new Date(selectedDate)
      const date = typeof (selectedDate as any).toDate === 'function' ? (selectedDate as any).toDate() : new Date(String(selectedDate));
      setIsoString(date.toISOString());
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    time: "",
    date: "",
    doctorName: "",
    symptoms: "",
    reason: "",
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Modal handlers
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Testing purpose
  const handleOk = async () => {
    try {
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");
      const currentUserId = sessionStorage.getItem("userIdentifier");

      if (!hospitalIdentifier || !token || !currentUserId) {
        message.error("Authentication information is missing");
        return;
      }

      if (!usedPatientIdentifier || !usedDoctorIdentifier) {
        message.error("Patient and Doctor information is required");
        return;
      }

      const requestBody = {
        appointmentIdentifier: crypto.randomUUID(),
        hospitalIdentifier: hospitalIdentifier,
        patientIdentifier: usedPatientIdentifier,
        doctorIdentifier: usedDoctorIdentifier,
        dateTime: formData.date,
        reason: formData.reason || "General Checkup",
        status: "OPEN",
      };

      const response = await axios.post(`/appointment`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: currentUserId,
          HospitalIdentifier: hospitalIdentifier,
        },
      });

      if (response.status === 200 || response.status === 201) {
        message.success("Appointment created successfully");
        setIsModalOpen(false);
        // Optionally refresh the list or update UI
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      message.error("Failed to create appointment. Please try again.");
    }
  };

  const testHandleOk = async () => {
    try {
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");
      const currentUserId = sessionStorage.getItem("userIdentifier");

      if (!hospitalIdentifier || !token || !currentUserId) {
        message.error("Authentication information is missing");
        console.error(
          "Error creating appointment:",
          hospitalIdentifier,
          token,
          currentUserId,
        );
        return;
      }

      // Predefined test values
      const testRequestBody = {
        appointmentIdentifier: crypto.randomUUID(),
        hospitalIdentifier: hospitalIdentifier,
        patientIdentifier: usedPatientIdentifier, // Test patient ID
        doctorIdentifier: "e71d286f-5d8b-4ea0-b84d-d8ea5c6cac3c", // Test doctor ID
        dateTime: formData.date, // Future test date
        reason: formData.symptoms || "General Checkup",
        status: "OPEN",
      };

      console.log("Test Request Body:", testRequestBody);

      const response = await axios.post(`/appointment`, testRequestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: currentUserId,
          HospitalIdentifier: hospitalIdentifier,
        },
      });

      if (response.status === 200 || response.status === 201) {
        message.success("Test appointment created successfully");
        console.log("Test Response:", response.data);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating test appointment:", error);
      message.error(
        "Failed to create test appointment. Please check console for details.",
      );
    }
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

  const [selectedHospital, setSelectedHospital] = useState(() => sessionStorage.getItem('selectedHospital') || 'ALL');

  const fetchPackageData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      let url = '/patient';
      let headers: any = {
        Authorization: `Bearer ${token}`,
      };
      if (selectedHospital !== 'ALL') {
        url = `/patient/getAll/${selectedHospital}`;
      }
      const response = await axios.get(url, { headers });
      const data: PackagePatient[] = response.data;
      setPackageData(data);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error("Error fetching package data:", error);
      message.error("Error fetching data");
    }
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
                          onClick={() => {
                            setUsedPatientIdentifier(
                              packageItem.patientIdentifier,
                            );
                            showModal();
                          }}
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
      {/* Modal */}
      <Modal
        title="Create Appointment"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div>
              <DatePicker
                showTime
                onChange={handleDateChange}
                format="YYYY-MM-DD HH:mm:ss"
              />
              {isoString && (
                <p style={{ marginTop: 10 }}>
                  <strong>ISO String:</strong> {isoString}
                </p>
              )}
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
              onClick={testHandleOk}
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
