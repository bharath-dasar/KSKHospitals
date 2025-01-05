import React, { useState } from 'react';
import { Select, Button, Table, Modal, Input } from 'antd';
import { useHistory } from 'react-router-dom'; // Use useHistory for navigation
import axios from 'axios'; // Import axios for making the request
const { Option } = Select;

const ReportPage = () => {
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]); 
  const [reportData, setReportData] = useState({
    patientName: '',
    doctorName: '',
    diagnosis: '',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState('');
  const [editingDisease, setEditingDisease] = useState(''); 

  const history = useHistory(); // Hook for navigation

  const availableMedicines = [
    'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Ciprofloxacin', 'Metformin',
    'Omeprazole', 'Aspirin', 'Losartan', 'Atorvastatin',
  ];

  const availableDiseases = [
    'Diabetes', 'Hypertension', 'Asthma', 'Cancer', 'COVID-19', 'Pneumonia',
    'Tuberculosis', 'Chronic Kidney Disease', 'Heart Disease',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reportPayload = {
      ...reportData,
      prescribedMedicines: selectedMedicines,
      diagnosedDiseases: selectedDiseases,
    };

    try {
      // Send a POST request to your backend
      const response = await axios.post('http://your-api-url.com/report', reportPayload);
      
      if (response.status === 200) {
        // On success, navigate to /appointments
        history.push('/appointments');
      }
    } catch (error) {
      console.error('There was an error submitting the report:', error);
      // Optionally handle error states (e.g., show a notification)
    }
  };

  const handleEdit = (item: string, type: 'medicine' | 'disease') => {
    if (type === 'medicine') {
      setEditingMedicine(item);
    } else {
      setEditingDisease(item);
    }
    setIsModalVisible(true);
  };

  const handleSaveEdit = (type: 'medicine' | 'disease') => {
    if (type === 'medicine') {
      setSelectedMedicines((prev) =>
        prev.map((med) => (med === editingMedicine ? editingMedicine : med))
      );
    } else {
      setSelectedDiseases((prev) =>
        prev.map((dis) => (dis === editingDisease ? editingDisease : dis))
      );
    }
    setEditingMedicine('');
    setEditingDisease('');
    setIsModalVisible(false);
  };

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Report Page</h3>
          </div>
          <div className="p-6.5">
            <form onSubmit={handleSubmit}>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Patient Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Enter patient's name"
                    value={reportData.patientName}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary  "
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Doctor Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    placeholder="Enter doctor's name"
                    value={reportData.doctorName}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary  "
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Diagnosis <span className="text-meta-1">*</span>
                </label>
                <textarea
                  name="diagnosis"
                  rows={4}
                  placeholder="Enter diagnosis details"
                  value={reportData.diagnosis}
                  onChange={handleInputChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary  "
                ></textarea>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Prescribed Medicines
                </label>
                <Select
                  mode="multiple"
                  placeholder="Search and add medicines"
                  value={selectedMedicines}
                  onChange={(value) => setSelectedMedicines(value)}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  className="w-full  border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary  "
                >
                  {availableMedicines.map((medicine) => (
                    <Option key={medicine} value={medicine}>
                      {medicine}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="mb-2.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Diagnosed Diseases/Conditions
                </label>
                <Select
                  mode="multiple"
                  placeholder="Search and add diseases"
                  value={selectedDiseases}
                  onChange={(value) => setSelectedDiseases(value)}
                  showSearch
                  filterOption={(input, option) =>
                    (String(option?.value) ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  className="w-full  border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary  "
                >
                  {availableDiseases.map((disease) => (
                    <Option key={disease} value={disease}>
                      {disease}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="p-6.5">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 py-3"
                >
                  Submit Report
                </button>
              </div>
            </form>

            {/* Prescribed Medicines Table */}
            {selectedMedicines.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h2 className="mb-4.5 font-medium text-black dark:text-white">Prescribed Medicines</h2>
                <Table
                  dataSource={selectedMedicines.map((medicine, index) => ({
                    key: index,
                    medicine,
                    tablets: '', // Add field for number of tablets
                    usageInstructions: '', // Add field for usage instructions
                  }))}
                  columns={[
                    { title: 'Medicine Name', dataIndex: 'medicine', key: 'medicine' },
                    {
                      title: 'Number of Tablets',
                      dataIndex: 'tablets',
                      key: 'tablets',
                      render: (_, record, index) => (
                        <Input
                          type="number"
                          onChange={(e) => {
                            const updatedMedicines = [...selectedMedicines];
                            updatedMedicines[index].tablets = e.target.value;
                            setSelectedMedicines(updatedMedicines);
                          }}
                        />
                      ),
                    },
                    {
                      title: 'Usage Instructions',
                      dataIndex: 'usageInstructions',
                      key: 'usageInstructions',
                      render: (_, record, index) => (
                        <input
                          type="text"
                          onChange={(e) => {
                            const updatedMedicines = [...selectedMedicines];
                            updatedMedicines[index].usageInstructions = e.target.value;
                            setSelectedMedicines(updatedMedicines);
                          }}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1 text-black outline-none transition focus:border-primary active:border-primary  "
                        />
                      ),
                    },
                  ]}
                  pagination={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
