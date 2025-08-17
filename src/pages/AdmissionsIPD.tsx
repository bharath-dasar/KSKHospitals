import { message, DatePicker, TimePicker } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

// Types
interface AdmissionFormData {
  patientIdentifier: string;
  appointmentIdentifier: string;
  bedType: string;
  roomNumber: string;
  admissionDate: string;
  admissionTime: string;
  admittingDoctor: string;
  chiefComplaint: string;
  provisionalDiagnosis: string;
  treatmentPlan: string;
  // Treatment sections
  dailyRounds: {
    morningRounds: boolean;
    eveningRounds: boolean;
    specialRounds: boolean;
    roundsNotes: string;
  };
  medicines: {
    prescribedMedicines: string;
    medicationSchedule: string;
    allergies: string;
  };
  nursingCare: {
    vitalMonitoring: boolean;
    personalCare: boolean;
    mobilityAssistance: boolean;
    nursingNotes: string;
  };
  labScans: {
    bloodTests: boolean;
    urineBehavior: boolean;
    xRay: boolean;
    ctScan: boolean;
    mri: boolean;
    ecg: boolean;
    labNotes: string;
  };
  // Discharge process
  dischargeProcess: {
    finalCheckupScheduled: boolean;
    dischargeSummaryPrepared: boolean;
    finalBillingCompleted: boolean;
    dischargeDate: string;
    dischargeTime: string;
    dischargeNotes: string;
  };
}

interface ValidationErrors {
  [key: string]: string;
}

interface BedType {
  type: string;
  description: string;
  price: number;
  features: string[];
}

const AdmissionsIPD: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Initialize form data with URL parameters
  const [formData, setFormData] = useState<AdmissionFormData>({
    patientIdentifier: searchParams.get('user') || '',
    appointmentIdentifier: searchParams.get('token') || '',
    bedType: '',
    roomNumber: '',
    admissionDate: '',
    admissionTime: '',
    admittingDoctor: '',
    chiefComplaint: '',
    provisionalDiagnosis: '',
    treatmentPlan: '',
    dailyRounds: {
      morningRounds: false,
      eveningRounds: false,
      specialRounds: false,
      roundsNotes: '',
    },
    medicines: {
      prescribedMedicines: '',
      medicationSchedule: '',
      allergies: '',
    },
    nursingCare: {
      vitalMonitoring: false,
      personalCare: false,
      mobilityAssistance: false,
      nursingNotes: '',
    },
    labScans: {
      bloodTests: false,
      urineBehavior: false,
      xRay: false,
      ctScan: false,
      mri: false,
      ecg: false,
      labNotes: '',
    },
    dischargeProcess: {
      finalCheckupScheduled: false,
      dischargeSummaryPrepared: false,
      finalBillingCompleted: false,
      dischargeDate: '',
      dischargeTime: '',
      dischargeNotes: '',
    },
  });

  const [selectedBedType, setSelectedBedType] = useState<string>('');
  const [isBedTypeSelected, setIsBedTypeSelected] = useState<boolean>(false);
  const [showTreatmentFields, setShowTreatmentFields] = useState(false);
  const [showDischargeFields, setShowDischargeFields] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<any>(null);

  // Bed types configuration
  const bedTypes: BedType[] = [
    {
      type: 'PREMIUM',
      description: 'Premium Room',
      price: 5000,
      features: ['Private AC Room', '24/7 Nursing', 'TV & WiFi', 'Attendant Bed', 'Premium Meals']
    },
    {
      type: 'INTERMEDIATE',
      description: 'Intermediate Room',
      price: 3000,
      features: ['Semi-Private Room', 'AC Available', 'TV Access', 'Standard Meals', 'Regular Nursing']
    },
    {
      type: 'STARTER',
      description: 'General Ward',
      price: 1500,
      features: ['Shared Ward', 'Basic Amenities', 'Standard Care', 'Basic Meals']
    }
  ];

  // Fetch patient information on component mount
  useEffect(() => {
    if (formData.patientIdentifier) {
      fetchPatientInfo();
    }
  }, [formData.patientIdentifier]);

  const fetchPatientInfo = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`/patient/${formData.patientIdentifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatientInfo(response.data);
    } catch (error) {
      console.error("Error fetching patient info:", error);
      message.error("Failed to fetch patient information");
    }
  };

  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBedTypeChange = (bedType: string) => {
    setSelectedBedType(bedType);
    setIsBedTypeSelected(true);
    setFormData(prev => ({ ...prev, bedType }));
    if (validationErrors.bedType) {
      setValidationErrors(prev => ({ ...prev, bedType: '' }));
    }
  };

  const handleDateTimeChange = (field: string, value: Dayjs | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, [field]: value.toISOString() }));
    }
  };

  const handleCheckboxChange = (section: string, field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof AdmissionFormData],
        [field]: checked
      }
    }));
  };

  const handleNestedChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof AdmissionFormData],
        [field]: value
      }
    }));
  };

  // Form submission
  const handleCreateAdmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!selectedBedType) {
      message.error("Please select a bed type");
      return;
    }

    if (!formData.admissionDate) {
      message.error("Please select admission date");
      return;
    }

    if (!formData.admissionTime) {
      message.error("Please select admission time");
      return;
    }

    if (!formData.chiefComplaint.trim()) {
      message.error("Please enter chief complaint");
      return;
    }

    setLoading(true);
    try {
      await createAdmission();
    } finally {
      setLoading(false);
    }
  };

  const createAdmission = async (): Promise<void> => {
    try {
      const token = sessionStorage.getItem("token");
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const userIdentifier = sessionStorage.getItem("userIdentifier");

      const requestBody = {
        admissionIdentifier: crypto.randomUUID(),
        patientIdentifier: formData.patientIdentifier,
        appointmentIdentifier: formData.appointmentIdentifier,
        hospitalIdentifier: hospitalIdentifier,
        bedType: formData.bedType,
        roomNumber: formData.roomNumber,
        admissionDateTime: formData.admissionDate,
        admittingDoctor: userIdentifier,
        chiefComplaint: formData.chiefComplaint,
        provisionalDiagnosis: formData.provisionalDiagnosis,
        treatmentPlan: formData.treatmentPlan,
        status: "ADMITTED",
        treatmentDetails: {
          dailyRounds: formData.dailyRounds,
          medicines: formData.medicines,
          nursingCare: formData.nursingCare,
          labScans: formData.labScans,
        },
        dischargeProcess: formData.dischargeProcess,
        createdBy: userIdentifier,
        createdDateTime: new Date().toISOString(),
      };

      const response = await axios.post("/admission", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          HospitalIdentifier: hospitalIdentifier,
        },
      });

      message.success("Patient admitted successfully");
      navigate("/appointments");
    } catch (error: any) {
      console.error("Error creating admission:", error);
      message.error("Failed to admit patient. Please try again.");
    }
  };

  // UI state handlers
  const handleShowTreatment = () => setShowTreatmentFields(true);
  const handleHideTreatment = () => setShowTreatmentFields(false);
  const handleShowDischarge = () => setShowDischargeFields(true);
  const handleHideDischarge = () => setShowDischargeFields(false);

  // Render helper functions
  const renderInputField = (
    name: string,
    label: string,
    type: string = "text",
    placeholder: string = "",
    required: boolean = false
  ) => (
    <div className="w-full xl:w-1/2">
      <label className="mb-2.5 block text-black dark:text-white">
        {label} {required && <span className="text-meta-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name as keyof AdmissionFormData] as string}
        onChange={handleChange}
        className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white dark:focus:border-primary ${
          validationErrors[name] 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-stroke dark:border-form-strokedark'
        } bg-transparent`}
      />
      {validationErrors[name] && (
        <div className="text-red-500 text-sm mt-1">{validationErrors[name]}</div>
      )}
    </div>
  );

  const renderTextArea = (
    name: string,
    label: string,
    rows: number = 3,
    placeholder: string = "Type here"
  ) => (
    <div className="mb-3">
      <label className="mb-2.5 block text-black dark:text-white">
        {label}
      </label>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={formData[name as keyof AdmissionFormData] as string}
        onChange={handleChange}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>
  );

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        {/* Patient Information Header */}
        {patientInfo && (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Patient Information
              </h3>
            </div>
            <div className="p-6.5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium text-black dark:text-white">Name: </span>
                  <span className="text-black dark:text-white">{patientInfo.username}</span>
                </div>
                <div>
                  <span className="font-medium text-black dark:text-white">Age: </span>
                  <span className="text-black dark:text-white">{patientInfo.age}</span>
                </div>
                <div>
                  <span className="font-medium text-black dark:text-white">Gender: </span>
                  <span className="text-black dark:text-white">{patientInfo.gender}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Admission Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              In-Patient Admission (IPD)
            </h3>
          </div>
          <form onSubmit={handleCreateAdmission}>
            <div className="p-6.5">
              {/* Bed Type Selection */}
              <div className="mb-6">
                <label className="mb-4 block text-black dark:text-white font-medium">
                  Select Bed/Room Type <span className="text-meta-1">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bedTypes.map((bed) => (
                    <div
                      key={bed.type}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedBedType === bed.type
                          ? 'border-primary bg-primary/10'
                          : 'border-stroke dark:border-strokedark'
                      }`}
                      onClick={() => handleBedTypeChange(bed.type)}
                    >
                      <div className="text-center">
                        <h4 className="font-semibold text-lg text-black dark:text-white mb-2">
                          {bed.description}
                        </h4>
                        <p className="text-2xl font-bold text-primary mb-3">
                          ₹{bed.price}/day
                        </p>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {bed.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basic Admission Details */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('roomNumber', 'Room Number', 'text', 'Enter room number')}
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Admission Date <span className="text-meta-1">*</span>
                  </label>
                  <DatePicker
                    className="w-full"
                    size="large"
                    onChange={(date) => handleDateTimeChange('admissionDate', date)}
                    placeholder="Select admission date"
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Admission Time <span className="text-meta-1">*</span>
                  </label>
                  <TimePicker
                    className="w-full"
                    size="large"
                    format="HH:mm"
                    onChange={(time) => handleDateTimeChange('admissionTime', time)}
                    placeholder="Select admission time"
                  />
                </div>
                {renderInputField('admittingDoctor', 'Admitting Doctor', 'text', 'Doctor name')}
              </div>

              {/* Medical Information */}
              {renderTextArea('chiefComplaint', 'Chief Complaint *', 3, 'Enter primary complaint')}
              {renderTextArea('provisionalDiagnosis', 'Provisional Diagnosis', 2, 'Enter provisional diagnosis')}
              {renderTextArea('treatmentPlan', 'Treatment Plan', 3, 'Enter treatment plan')}

              {/* In-Patient Treatment Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-black dark:text-white">
                    In-Patient Treatment
                  </h4>
                  <button
                    type="button"
                    onClick={showTreatmentFields ? handleHideTreatment : handleShowTreatment}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {showTreatmentFields ? 'Hide Details' : 'Configure Treatment'}
                  </button>
                </div>

                {showTreatmentFields && (
                  <div className="space-y-6 p-4 border border-stroke dark:border-strokedark rounded-lg">
                    {/* Daily Rounds */}
                    <div>
                      <h5 className="font-medium text-black dark:text-white mb-3">Daily Rounds</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.dailyRounds.morningRounds}
                            onChange={(e) => handleCheckboxChange('dailyRounds', 'morningRounds', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">Morning Rounds</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.dailyRounds.eveningRounds}
                            onChange={(e) => handleCheckboxChange('dailyRounds', 'eveningRounds', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">Evening Rounds</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.dailyRounds.specialRounds}
                            onChange={(e) => handleCheckboxChange('dailyRounds', 'specialRounds', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">Special Rounds</span>
                        </label>
                      </div>
                      <textarea
                        placeholder="Rounds notes"
                        value={formData.dailyRounds.roundsNotes}
                        onChange={(e) => handleNestedChange('dailyRounds', 'roundsNotes', e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        rows={2}
                      />
                    </div>

                    {/* Medicines */}
                    <div>
                      <h5 className="font-medium text-black dark:text-white mb-3">Medicines</h5>
                      <div className="space-y-3">
                        <textarea
                          placeholder="Prescribed medicines"
                          value={formData.medicines.prescribedMedicines}
                          onChange={(e) => handleNestedChange('medicines', 'prescribedMedicines', e.target.value)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          rows={2}
                        />
                        <input
                          type="text"
                          placeholder="Medication schedule"
                          value={formData.medicines.medicationSchedule}
                          onChange={(e) => handleNestedChange('medicines', 'medicationSchedule', e.target.value)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <input
                          type="text"
                          placeholder="Known allergies"
                          value={formData.medicines.allergies}
                          onChange={(e) => handleNestedChange('medicines', 'allergies', e.target.value)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Nursing Care */}
                    <div>
                      <h5 className="font-medium text-black dark:text-white mb-3">Nursing Care</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.nursingCare.vitalMonitoring}
                            onChange={(e) => handleCheckboxChange('nursingCare', 'vitalMonitoring', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">Vital Monitoring</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.nursingCare.personalCare}
                            onChange={(e) => handleCheckboxChange('nursingCare', 'personalCare', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">Personal Care</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.nursingCare.mobilityAssistance}
                            onChange={(e) => handleCheckboxChange('nursingCare', 'mobilityAssistance', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">Mobility Assistance</span>
                        </label>
                      </div>
                      <textarea
                        placeholder="Nursing care notes"
                        value={formData.nursingCare.nursingNotes}
                        onChange={(e) => handleNestedChange('nursingCare', 'nursingNotes', e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        rows={2}
                      />
                    </div>

                    {/* Lab/Scans */}
                    <div>
                      <h5 className="font-medium text-black dark:text-white mb-3">Lab/Scans</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.labScans.bloodTests}
                            onChange={(e) => handleCheckboxChange('labScans', 'bloodTests', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">Blood Tests</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.labScans.urineBehavior}
                            onChange={(e) => handleCheckboxChange('labScans', 'urineBehavior', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">Urine Analysis</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.labScans.xRay}
                            onChange={(e) => handleCheckboxChange('labScans', 'xRay', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">X-Ray</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.labScans.ctScan}
                            onChange={(e) => handleCheckboxChange('labScans', 'ctScan', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">CT Scan</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.labScans.mri}
                            onChange={(e) => handleCheckboxChange('labScans', 'mri', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">MRI</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.labScans.ecg}
                            onChange={(e) => handleCheckboxChange('labScans', 'ecg', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-black dark:text-white">ECG</span>
                        </label>
                      </div>
                      <textarea
                        placeholder="Lab/scan notes"
                        value={formData.labScans.labNotes}
                        onChange={(e) => handleNestedChange('labScans', 'labNotes', e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Discharge Process Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-black dark:text-white">
                    Discharge Process
                  </h4>
                  <button
                    type="button"
                    onClick={showDischargeFields ? handleHideDischarge : handleShowDischarge}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {showDischargeFields ? 'Hide Details' : 'Configure Discharge'}
                  </button>
                </div>

                {showDischargeFields && (
                  <div className="space-y-4 p-4 border border-stroke dark:border-strokedark rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.dischargeProcess.finalCheckupScheduled}
                          onChange={(e) => handleCheckboxChange('dischargeProcess', 'finalCheckupScheduled', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-black dark:text-white">Final Checkup Scheduled</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.dischargeProcess.dischargeSummaryPrepared}
                          onChange={(e) => handleCheckboxChange('dischargeProcess', 'dischargeSummaryPrepared', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-black dark:text-white">Discharge Summary Prepared</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.dischargeProcess.finalBillingCompleted}
                          onChange={(e) => handleCheckboxChange('dischargeProcess', 'finalBillingCompleted', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-black dark:text-white">Final Billing Completed</span>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2.5 block text-black dark:text-white">
                          Discharge Date
                        </label>
                        <DatePicker
                          className="w-full"
                          size="large"
                          onChange={(date) => handleDateTimeChange('dischargeDate', date)}
                          placeholder="Select discharge date"
                        />
                      </div>
                      <div>
                        <label className="mb-2.5 block text-black dark:text-white">
                          Discharge Time
                        </label>
                        <TimePicker
                          className="w-full"
                          size="large"
                          format="HH:mm"
                          onChange={(time) => handleDateTimeChange('dischargeTime', time)}
                          placeholder="Select discharge time"
                        />
                      </div>
                    </div>
                    
                    <textarea
                      placeholder="Discharge notes"
                      value={formData.dischargeProcess.dischargeNotes}
                      onChange={(e) => handleNestedChange('dischargeProcess', 'dischargeNotes', e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Admitting Patient...' : 'Admit Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsIPD;
