import React, { useEffect, useState } from "react";
import { message, Table, Tooltip } from "antd";
import { useNavigate } from "react-router-dom"; // React Router v6
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";

// Define the Appointment Interface
interface Appointment {
  tokenNumber: string;
  patientIdentifier: string;
  doctorIdentifier: string;
  patientName: string;
  doctorName: string;
  reason: string;
  status: string;
  date: string; // Keep as string since it's in ISO format
}

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", ""); // Remove the comma
};

// Define Table Columns for Appointments
const columns: ColumnsType<Appointment> = [
  {
    title: "Patient Name",
    dataIndex: "patientName",
    key: "patientName",
  },
  {
    title: "Doctor Name",
    dataIndex: "doctorName",
    key: "doctorName",
  },
  {
    title: "Appointment Date",
    dataIndex: "date",
    key: "date",
    render: (date: string) => formatDate(date),
  },
  {
    title: "Symptoms",
    dataIndex: "reason",
    key: "reason",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

// Main Appointments Component
const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const pageSize = 7;

  const paginatedData = appointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchPackageData();
  }, []);

  const fetchPackageData = async () => {
    try {
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");

      // Get current date
      const today = new Date();

      // Set fromDate to one day before today
      const fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 1); // Subtract 1 day
      const fromDateISO = fromDate.toISOString();

      // Set toDate to one day after today
      const toDate = new Date(today);
      toDate.setDate(today.getDate() + 1); // Add 1 day
      const toDateISO = toDate.toISOString();

      const response = await axios.get<Appointment[]>(`/appointment/getAll`, {
        params: { from: fromDateISO, to: toDateISO },
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          HospitalIdentifier: hospitalIdentifier,
        },
      });
      console.log("__AAAresponse", response.data);
      const data: Appointment[] = response.data;
      setAppointments(data); // Assuming you have a state like `const [appointments, setAppointments] = useState<Appointment[]>([])`
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error("Error fetching package data:", error);
      message.error("Error fetching data");
    }
  };

  const deleteAppointment = async (tokenNumber: string) => {
    try {
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");
      await axios.delete(`/appointment/${tokenNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          HospitalIdentifier: hospitalIdentifier,
          AppointmentIdentifier: tokenNumber,
        },
      });
      fetchPackageData();
    } catch (error) {
      message.error("Error fetching data");
    }
  };

  const handleRowClick = (record: Appointment) => {
    navigate(
      `/reportForm?user=${record.patientIdentifier}&${record.tokenNumber}`,
    );
  };

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Assigned Appointments
            </h3>
          </div>
        </div>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[20px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Patient's name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Doctor's name
                </th>
                {/*<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">*/}
                {/*  First Name*/}
                {/*</th>*/}
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Reason
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Date Time
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((appointment, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {appointment.patientName}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {appointment.doctorName}
                    </p>
                  </td>
                  {/*<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">*/}
                  {/*  <p className="text-black dark:text-white">*/}
                  {/*    {appointment.tokenNumber}*/}
                  {/*  </p>*/}
                  {/*</td>*/}
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {appointment.reason}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {appointment.date}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <RemoveRedEyeIcon />
                      </button>
                      <Tooltip title="Delete Patient">
                        <button
                          className="hover:text-primary"
                          onClick={() =>
                            deleteAppointment(appointment.tokenNumber)
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
    </div>
  );
};
//
export default Appointments;
