import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  DatePicker,
  Select,
  Input,
  Button,
  message,
  Spin,
  Card,
  Tag,
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

// Doctor interface
interface Doctor {
  identifier: string;
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
  designation: {
    identifier: string;
    name: string;
  };
}

// Form values interface
interface AppointmentFormValues {
  dateTime: Dayjs;
  doctor: string;
  reason: string;
  notes?: string;
}

// Props interface
interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientIdentifier: string;
  patientName: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  patientIdentifier,
  patientName,
}) => {
  const [form] = Form.useForm<AppointmentFormValues>();
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Doctor fetching state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in sessionStorage");
        message.error("Authentication token is missing");
        return;
      }

      const designationIdentifier = "a45f6bce-72cc-4be4-b70f-519b89eec3df";
      const response = await axios.get(`/user/filterUserByDesignation/${designationIdentifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const doctorData: Doctor[] = response.data;
        setDoctors(doctorData);
        setFilteredDoctors(doctorData);
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      message.error('Failed to load doctors');
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Handle modal open/close
  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
      form.resetFields();
      setSelectedDateTime(null);
      setSelectedDoctor(null);
    }
  }, [isOpen, form]);

  // Handle date/time change
  const handleDateTimeChange = (value: Dayjs | null) => {
    setSelectedDateTime(value);
    if (value) {
      form.setFieldsValue({ dateTime: value });
    }
  };

  // Handle doctor search
  const handleDoctorSearch = (value: string) => {
    if (!value.trim()) {
      setFilteredDoctors(doctors);
      return;
    }
    
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(value.toLowerCase()) ||
      doctor.designation?.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  // Handle doctor selection
  const handleDoctorSelect = (value: string) => {
    const doctor = doctors.find(d => d.identifier === value);
    setSelectedDoctor(doctor || null);
  };

  // Create appointment
  const handleCreateAppointment = async (values: AppointmentFormValues) => {
    try {
      setModalLoading(true);

      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const token = sessionStorage.getItem("token");
      const currentUserId = sessionStorage.getItem("userIdentifier");

      if (!hospitalIdentifier || !token || !currentUserId) {
        message.error("Authentication information is missing");
        return;
      }

      if (!selectedDoctor) {
        message.error("Please select a doctor");
        return;
      }

      const requestBody = {
        appointmentIdentifier: crypto.randomUUID(),
        hospitalIdentifier: hospitalIdentifier,
        patientIdentifier: patientIdentifier,
        doctorIdentifier: selectedDoctor.identifier,
        dateTime: values.dateTime.toISOString(),
        reason: values.reason || "General Checkup",
        status: "OPEN",
      };

      const response = await axios.post(`/appointment`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.status === 200 || response.status === 201) {
        message.success("Appointment created successfully!");
        onClose();
        form.resetFields();
        setSelectedDateTime(null);
        setSelectedDoctor(null);
      }
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Failed to create appointment. Please try again.");
      }
    } finally {
      setModalLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    form.resetFields();
    setSelectedDateTime(null);
    setSelectedDoctor(null);
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <CalendarOutlined className="text-primary" />
          <span className="text-lg font-semibold">Schedule New Appointment</span>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <div className="py-4">
        {/* Patient Info */}
        <Card 
          size="small" 
          className="mb-6 border-l-4 border-l-purple-500"
          title={
            <div className="flex items-center space-x-2">
              <UserOutlined className="text-purple-500" />
              <span>Patient Information</span>
            </div>
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{patientName}</p>
            </div>
            <Tag color="purple">Active Patient</Tag>
          </div>
        </Card>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateAppointment}
          initialValues={{
            reason: "General Checkup"
          }}
        >
          {/* Date and Time Selection */}
          <Card 
            size="small" 
            className="mb-6 border-l-4 border-l-primary"
            title={
              <div className="flex items-center space-x-2">
                <ClockCircleOutlined className="text-primary" />
                <span>Appointment Date & Time</span>
              </div>
            }
          >
            <Form.Item
              name="dateTime"
              label="Select Date & Time"
              rules={[
                { required: true, message: 'Please select appointment date and time' },
                {
                  validator: (_, value) => {
                    if (value && value.isBefore(dayjs(), 'minute')) {
                      return Promise.reject('Appointment time cannot be in the past');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder="Select date and time"
                className="w-full"
                onChange={handleDateTimeChange}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                showNow={false}
              />
            </Form.Item>
          </Card>

          {/* Doctor Selection */}
          <Card 
            size="small" 
            className="mb-6 border-l-4 border-l-blue-500"
            title={
              <div className="flex items-center space-x-2">
                <UserOutlined className="text-blue-500" />
                <span>Select Doctor</span>
              </div>
            }
          >
            <Form.Item
              name="doctor"
              label="Choose Doctor"
              rules={[{ required: true, message: 'Please select a doctor' }]}
            >
              <Select
                showSearch
                placeholder="Search and select doctor"
                optionFilterProp="children"
                onChange={handleDoctorSelect}
                onSearch={handleDoctorSearch}
                loading={loadingDoctors}
                notFoundContent={loadingDoctors ? <Spin size="small" /> : null}
                className="w-full"
              >
                {filteredDoctors.map((doctor) => (
                  <Select.Option key={doctor.identifier} value={doctor.identifier}>
                    Dr. {doctor.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Selected Doctor Name Only */}
            {selectedDoctor && (
              <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  Selected: Dr. {selectedDoctor.name}
                </p>
              </div>
            )}
          </Card>

          {/* Appointment Details */}
          <Card 
            size="small" 
            className="mb-6 border-l-4 border-l-green-500"
            title={
              <div className="flex items-center space-x-2">
                <MedicineBoxOutlined className="text-green-500" />
                <span>Appointment Details</span>
              </div>
            }
          >
            <Form.Item
              name="reason"
              label="Reason for Visit"
              rules={[{ required: true, message: 'Please provide a reason for the visit' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Describe the reason for the appointment..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="notes"
              label="Additional Notes (Optional)"
            >
              <Input.TextArea
                rows={2}
                placeholder="Any additional notes or special requirements..."
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button onClick={handleClose} size="large">
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              loading={modalLoading}
              icon={<CalendarOutlined />}
            >
              Schedule Appointment
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AppointmentModal; 