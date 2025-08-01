import React, { useEffect, useState } from "react";
import { message, Table, Tooltip, Modal, DatePicker, Button } from "antd";
import { useNavigate } from "react-router-dom"; // React Router v6
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs, { Dayjs } from "dayjs";

// Define the Appointment Interface
interface Appointment {
  appointmentIdentifier: string;
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

// Main Appointments Component
const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedHospital, setSelectedHospital] = useState(() => sessionStorage.getItem('selectedHospital') || 'ALL');
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs('2025-08-01T00:00:00'));
  const [toDate, setToDate] = useState<Dayjs>(dayjs('2025-08-31T23:59:59'));

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
    const handler = () => {
      setSelectedHospital(sessionStorage.getItem('selectedHospital') || 'ALL');
      setCurrentPage(1);
    };
    window.addEventListener('hospitalChanged', handler);
    return () => window.removeEventListener('hospitalChanged', handler);
  }, [selectedHospital]);

  const fetchPackageData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      
      // Use local date format to avoid timezone conversion issues
      const fromDateISO = fromDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      const toDateISO = toDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      
      console.log('Date range being sent:', {
        from: fromDateISO,
        to: toDateISO,
        fromDate: fromDate.format('YYYY-MM-DD HH:mm'),
        toDate: toDate.format('YYYY-MM-DD HH:mm')
      });
      
      // Fetch appointments with date range
      const response = await axios.get('/appointment/getAll', {
        params: { from: fromDateISO, to: toDateISO },
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: sessionStorage.getItem("useridentifier"),
        },
      });
      
      let allAppointments: Appointment[] = response.data;
      
      // If a specific hospital is selected, filter appointments by hospital
      if (selectedHospital !== 'ALL') {
        try {
          // Fetch all users for the selected hospital
          const usersResponse = await axios.get(`/user/getAll/hospital/${selectedHospital}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Create a set of doctor identifiers from the selected hospital
          const hospitalDoctorIds = new Set(usersResponse.data.map((user: any) => user.identifier));
          
          // Filter appointments to only include those where the doctor is from the selected hospital
          allAppointments = allAppointments.filter(appointment => 
            hospitalDoctorIds.has(appointment.doctorIdentifier)
          );
        } catch (error) {
          console.error("Error fetching hospital users:", error);
          // If we can't fetch hospital users, show all appointments
        }
      }
      
      setAppointments(allAppointments);
      setTotalPages(Math.ceil(allAppointments.length / pageSize));
    } catch (error) {
      console.error("Error fetching package data:", error);
      message.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (appointmentIdentifier: string) => {
    try {
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");
      await axios.delete(`/appointment/${appointmentIdentifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          HospitalIdentifier: hospitalIdentifier,
        },
      });
      message.success("Appointment deleted successfully");
      fetchPackageData();
    } catch (error) {
      message.error("Error deleting appointment");
    }
  };

  const handleDeleteClick = (appointment: Appointment) => {
    Modal.confirm({
      title: "Delete Appointment",
      content: `Are you sure you want to delete the appointment for ${appointment.patientName} with Dr. ${appointment.doctorName}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        deleteAppointment(appointment.appointmentIdentifier);
      },
    });
  };

  const handleRowClick = (record: Appointment) => {
    navigate(
      `/reportForm?user=${record.patientIdentifier}&${record.tokenNumber}`,
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPackageData();
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
      
      {/* Date Range Filter */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-4">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Date Range Filter
          </h3>
        </div>
        <div className="p-6.5">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="flex-1">
              <label className="mb-2.5 block text-black dark:text-white">
                From Date
              </label>
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                value={fromDate}
                onChange={(date) => {
                  if (date) {
                    setFromDate(date);
                  }
                }}
                className="w-full"
                placeholder="Select from date"
                size="large"
              />
            </div>
            
            <div className="flex-1">
              <label className="mb-2.5 block text-black dark:text-white">
                To Date
              </label>
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                value={toDate}
                onChange={(date) => {
                  if (date) {
                    setToDate(date);
                  }
                }}
                className="w-full"
                placeholder="Select to date"
                disabledDate={(current) => current && current < fromDate}
                size="large"
              />
            </div>
            
            <div className="flex-1">
              <Button 
                type="primary" 
                onClick={handleSearch}
                loading={loading}
                className="w-full h-10"
                size="large"
              >
                Search Appointments
              </Button>
            </div>
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
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {appointment.reason}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {formatDate(appointment.date)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center">
                      <Tooltip title="Delete Appointment">
                        <button
                          className="hover:text-primary"
                          onClick={() => handleDeleteClick(appointment)}
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

export default Appointments;
