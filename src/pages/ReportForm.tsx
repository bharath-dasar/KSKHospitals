import React, { useState } from 'react';
import { Select, Table, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;

const ReportPage = () => {
  const navigate = useNavigate();
  const [selectedMedicines, setSelectedMedicines] = useState<{ medicine: string; tablets: string; usageInstructions: string }[]>([]);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [reportData, setReportData] = useState({
    patientName: '',
    doctorName: '',
    diagnosis: '',
  });

  const availableMedicines = [
    'Paracetamol',
    'Ibuprofen',
    'Amoxicillin',
    'Ciprofloxacin',
    'Metformin',
    'Omeprazole',
    'Aspirin',
    'Losartan',
    'Atorvastatin',
  ];

  const availableDiseases = [
    'Diabetes',
    'Hypertension',
    'Asthma',
    'Cancer',
    'COVID-19',
    'Pneumonia',
    'Tuberculosis',
    'Chronic Kidney Disease',
    'Heart Disease',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicineSelect = (value: string[]) => {
    const updatedMedicines = value.map((medicine) => {
      const existing = selectedMedicines.find((med) => med.medicine === medicine);
      return existing || { medicine, tablets: '', usageInstructions: '' };
    });
    setSelectedMedicines(updatedMedicines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...reportData,
      prescribedMedicines: selectedMedicines,
      diagnosedDiseases: selectedDiseases,
    };

    try {
      await axios.post('/api/reports', payload);
      navigate('/appointments');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the report. Please try again.');
    }
  };

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Report Page</h3>
          </div>
          <div className="p-6.5">
            <form>
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
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
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
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
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
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                ></textarea>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Prescribed Medicines
                </label>
                <Select
                  mode="multiple"
                  placeholder="Search and add medicines"
                  value={selectedMedicines.map((med) => med.medicine)}
                  onChange={handleMedicineSelect}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  className="w-full border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary"
                >
                  {availableMedicines.map((medicine) => (
                    <Option key={medicine} value={medicine}>
                      {medicine}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="mb-4.5">
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
                    String(option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  className="w-full border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary"
                >
                  {availableDiseases.map((disease) => (
                    <Option key={disease} value={disease}>
                      {disease}
                    </Option>
                  ))}
                </Select>
              </div>
            </form>

            {selectedMedicines.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h2 className="mb-4.5 font-medium text-black dark:text-white">Prescribed Medicines</h2>
                <Table
                  dataSource={selectedMedicines}
                  columns={[
                    { title: 'Medicine Name', dataIndex: 'medicine', key: 'medicine' },
                    {
                      title: 'Number of Tablets',
                      dataIndex: 'tablets',
                      key: 'tablets',
                      render: (_, _record, index) => (
                        <Input
                          type="number"
                          value={selectedMedicines[index].tablets}
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
                      render: (_, _record, index) => (
                        <Input
                          type="text"
                          value={selectedMedicines[index].usageInstructions}
                          onChange={(e) => {
                            const updatedMedicines = [...selectedMedicines];
                            updatedMedicines[index].usageInstructions = e.target.value;
                            setSelectedMedicines(updatedMedicines);
                          }}
                        />
                      ),
                    },
                  ]}
                  pagination={false}
                />
              </div>
            )}

            <div className="p-6.5">
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;