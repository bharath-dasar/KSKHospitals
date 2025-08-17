import React, { useEffect, useState } from "react";
import { message, Tooltip, Modal, DatePicker, Button } from "antd";
import { useNavigate } from "react-router-dom"; // React Router v6
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs, { Dayjs } from "dayjs";

// Define the Appointment Interface
interface Appointment {
  appointmentIdentifier: string;
  patientIdentifier: string;
  doctorIdentifier: string;
  patient: {
    patientIdentifier: string;
    username: string;
    dob: string;
    age: string;
    gender: string;
    phone: string;
    email: string;
    address: {
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    patientStatus: string;
    active: boolean;
  };
  doctor: {
    identifier: string;
    dob: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    address: {
      addressLine1: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    designationDetails: string;
    active: boolean;
  };
  dateTime: string; // Keep as string since it's in ISO format
  reason: string;
  status: string;
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
  const [isPatientTypeModalVisible, setIsPatientTypeModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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
      
      // Format dates as yyyy-MM-dd to match backend LocalDate expectation
      const fromDateStr = fromDate.format('YYYY-MM-DD');
      const toDateStr = toDate.format('YYYY-MM-DD');
      
      console.log('Date range being sent:', {
        from: fromDateStr,
        to: toDateStr,
        fromDate: fromDate.format('YYYY-MM-DD'),
        toDate: toDate.format('YYYY-MM-DD')
      });
      
      // Fetch appointments with date range
      const response = await axios.get('/appointment/getAll', {
        params: { from: fromDateStr, to: toDateStr },
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
      content: `Are you sure you want to delete the appointment for ${appointment.patient.username} with Dr. ${appointment.doctor.name}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        deleteAppointment(appointment.appointmentIdentifier);
      },
    });
  };

  const handleRowClick = (record: Appointment) => {
    setSelectedAppointment(record);
    setIsPatientTypeModalVisible(true);
  };

  const handlePatientTypeSelection = (patientType: 'outpatient' | 'inpatient') => {
    if (!selectedAppointment) return;
    
    setIsPatientTypeModalVisible(false);
    
    if (patientType === 'outpatient') {
      navigate(
        `/reportForm?user=${selectedAppointment.patientIdentifier}&token=${selectedAppointment.appointmentIdentifier}`,
      );
    } else {
      // Navigate to inpatient admissions page
      navigate(
        `/admissionsIPD?user=${selectedAppointment.patientIdentifier}&token=${selectedAppointment.appointmentIdentifier}`,
      );
    }
    
    setSelectedAppointment(null);
  };

  const handleModalCancel = () => {
    setIsPatientTypeModalVisible(false);
    setSelectedAppointment(null);
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
                <tr 
                  key={key}
                  onClick={() => handleRowClick(appointment)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors"
                >
                                     <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                     <h5 className="font-medium text-black dark:text-white">
                       {appointment.patient.username}
                     </h5>
                   </td>
                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                     <p className="text-black dark:text-white">
                       {appointment.doctor.name}
                     </p>
                   </td>
                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                     <p className="text-black dark:text-white">
                       {appointment.reason}
                     </p>
                   </td>
                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                     <p className="text-black dark:text-white">
                       {formatDate(appointment.dateTime)}
                     </p>
                   </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center">
                      <Tooltip title="Delete Appointment">
                        <button
                          className="hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(appointment);
                          }}
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

      {/* Patient Type Selection Modal */}
      <Modal
        title="Select Patient Type"
        open={isPatientTypeModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
        width={400}
      >
        <div className="py-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Please select the type of patient for{' '}
            <strong>{selectedAppointment?.patient.username}</strong>:
          </p>
          <div className="flex flex-col gap-4">
            <Button
              type="primary"
              size="large"
              onClick={() => handlePatientTypeSelection('outpatient')}
              className="w-full h-12 text-lg"
            >
              Out Patient
            </Button>
            <Button
              size="large"
              onClick={() => handlePatientTypeSelection('inpatient')}
              className="w-full h-12 text-lg"
            >
              In Patient
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Appointments;
