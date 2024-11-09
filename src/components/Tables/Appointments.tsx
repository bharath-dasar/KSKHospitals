import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// Define the Appointment Interface
export interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  symptoms: string;
}

// Sample Data for Testing
const sampleAppointments: Appointment[] = [
  { id: 1, patientName: 'Jon Snow', doctorName: 'Dr. Emily White', appointmentDate: '2024-11-02', appointmentTime: '10:30', symptoms: 'Headache' },
  { id: 2, patientName: 'Arya Stark', doctorName: 'Dr. Michael Brown', appointmentDate: '2024-11-03', appointmentTime: '14:00', symptoms: 'Fever' },
  { id: 3, patientName: 'Daenerys Targaryen', doctorName: 'Dr. John Smith', appointmentDate: '2024-11-04', appointmentTime: '09:00', symptoms: 'Cough' },
  { id: 4, patientName: 'Tyrion Lannister', doctorName: 'Dr. Emily White', appointmentDate: '2024-11-05', appointmentTime: '11:15', symptoms: 'Back Pain' },
  { id: 5, patientName: 'Bran Stark', doctorName: 'Dr. Michael Brown', appointmentDate: '2024-11-06', appointmentTime: '13:45', symptoms: 'Dizziness' },
];

// Define Table Columns for Appointments
const columns: ColumnsType<Appointment> = [
  {
    title: 'Patient Name',
    dataIndex: 'patientName',
    key: 'patientName',
  },
  {
    title: 'Doctor Name',
    dataIndex: 'doctorName',
    key: 'doctorName',
  },
  {
    title: 'Appointment Date',
    dataIndex: 'appointmentDate',
    key: 'appointmentDate',
  },
  {
    title: 'Appointment Time',
    dataIndex: 'appointmentTime',
    key: 'appointmentTime',
  },
  {
    title: 'Symptoms',
    dataIndex: 'symptoms',
    key: 'symptoms',
  },
];

// Main Appointments Component
const Appointments: React.FC = () => {
  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Assigned Appointments</h3>
          </div>
          <div className="p-6.5">
            <Table
              columns={columns}
              dataSource={sampleAppointments}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              className="appointment-table"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
