import React, { useState, useEffect, useRef } from 'react';
import { Input, message, Button } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { FileTextOutlined, PrinterOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

interface BillingData {
  doctorFee: number;
  additionalMedicinesFee: number;
  discount: number;
  totalAmount: number;
}

interface ValidationErrors {
  [key: string]: string;
}

const ReportForm = () => {
  const [searchParams] = useSearchParams();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [billingData, setBillingData] = useState<BillingData>({
    doctorFee: 0,
    additionalMedicinesFee: 0,
    discount: 0,
    totalAmount: 0,
  });
  
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [appointmentInfo, setAppointmentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showInvoice, setShowInvoice] = useState(false);
  
  // Get patient and appointment identifiers from URL
  const patientIdentifier = searchParams.get('user') || '';
  const appointmentIdentifier = searchParams.get('token') || '';
  
  // Invoice data
  const invoiceNumber = `INV-${Date.now()}`;
  const invoiceDate = new Date().toLocaleDateString('en-GB');

  // Fetch patient and appointment information
  useEffect(() => {
    if (patientIdentifier) {
      fetchPatientInfo();
    }
    if (appointmentIdentifier) {
      fetchAppointmentInfo();
    }
  }, [patientIdentifier, appointmentIdentifier]);

  // Calculate total amount whenever billing data changes
  useEffect(() => {
    const total = billingData.doctorFee + billingData.additionalMedicinesFee - billingData.discount;
    setBillingData(prev => ({ ...prev, totalAmount: Math.max(0, total) }));
  }, [billingData.doctorFee, billingData.additionalMedicinesFee, billingData.discount]);

  const fetchPatientInfo = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`/patient/${patientIdentifier}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatientInfo(response.data);
    } catch (error) {
      console.error("Error fetching patient info:", error);
      message.error("Failed to fetch patient information");
    }
  };

  const fetchAppointmentInfo = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`/appointment/${appointmentIdentifier}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointmentInfo(response.data);
    } catch (error) {
      console.error("Error fetching appointment info:", error);
    }
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    setBillingData(prev => ({ ...prev, [name]: numericValue }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    if (billingData.doctorFee <= 0) {
      errors.doctorFee = 'Doctor fee is required and must be greater than 0';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateBill = () => {
    if (!validateForm()) {
      message.error('Please fill in all required fields');
      return;
    }
    
    setShowInvoice(true);
    message.success('Invoice generated successfully!');
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    try {
      setLoading(true);
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice-${invoiceNumber}.pdf`);
      message.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const renderBillingField = (
    name: keyof BillingData,
    label: string,
    placeholder: string = "0.00",
    required: boolean = false
  ) => (
    <div className="w-full xl:w-1/2">
      <label className="mb-2.5 block text-black dark:text-white">
        {label} {required && <span className="text-meta-1">*</span>}
      </label>
      <Input
        type="number"
        name={name}
        placeholder={placeholder}
        value={billingData[name] || ''}
        onChange={handleBillingChange}
        prefix="₹"
        size="large"
        min={0}
        step={0.01}
        className={validationErrors[name] ? 'border-red-500' : ''}
      />
      {validationErrors[name] && (
        <div className="text-red-500 text-sm mt-1">{validationErrors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        {/* Patient & Appointment Information Header */}
        {(patientInfo || appointmentInfo) && (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Patient & Appointment Information
              </h3>
            </div>
            <div className="p-6.5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {patientInfo && (
                  <>
                    <div>
                      <span className="font-medium text-black dark:text-white">Patient: </span>
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
                    <div>
                      <span className="font-medium text-black dark:text-white">Phone: </span>
                      <span className="text-black dark:text-white">{patientInfo.phone}</span>
                    </div>
                  </>
                )}
                {appointmentInfo && (
                  <>
                    <div>
                      <span className="font-medium text-black dark:text-white">Doctor: </span>
                      <span className="text-black dark:text-white">{appointmentInfo.doctor?.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black dark:text-white">Date: </span>
                      <span className="text-black dark:text-white">
                        {new Date(appointmentInfo.dateTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-black dark:text-white">Time: </span>
                      <span className="text-black dark:text-white">
                        {new Date(appointmentInfo.dateTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-black dark:text-white">Reason: </span>
                      <span className="text-black dark:text-white">{appointmentInfo.reason}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Billing Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              <FileTextOutlined className="mr-2" />
              Billing Information
            </h3>
          </div>
          <div className="p-6.5">
            {/* Billing Fields */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              {renderBillingField('doctorFee', 'Doctor Fee', '500.00', true)}
              {renderBillingField('additionalMedicinesFee', 'Additional Medicines Fee', '0.00')}
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              {renderBillingField('discount', 'Discount', '0.00')}
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white font-medium">
                  Total Amount
                </label>
                <Input
                  value={`₹${billingData.totalAmount.toFixed(2)}`}
                  size="large"
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 font-bold text-lg"
                />
              </div>
            </div>

            {/* Generate Bill Button */}
            <div className="flex gap-4">
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={generateBill}
                size="large"
                className="flex-1"
              >
                Generate Bill
              </Button>
              
              {showInvoice && (
                <Button
                  type="default"
                  icon={<PrinterOutlined />}
                  onClick={downloadPDF}
                  loading={loading}
                  size="large"
                >
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Section */}
        {showInvoice && (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Generated Invoice
              </h3>
            </div>
            <div className="p-6.5">
              {/* Professional Invoice Template */}
              <div ref={invoiceRef} className="bg-white p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
                {/* Invoice Header */}
                <div className="mb-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-blue-600 mb-2">KSK HOSPITALS</h1>
                      <p className="text-gray-600">Premium Healthcare Services</p>
                      <p className="text-gray-600">📧 info@kskhospitals.com | 📞 +91-XXXXXXXXXX</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
                      <p className="text-gray-600">Invoice #: {invoiceNumber}</p>
                      <p className="text-gray-600">Date: {invoiceDate}</p>
                    </div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="mb-8 p-4 bg-gray-50 rounded">
                  <h3 className="font-bold text-gray-800 mb-3">BILL TO:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Patient Name:</strong> {patientInfo?.username || 'N/A'}</p>
                      <p><strong>Age:</strong> {patientInfo?.age || 'N/A'}</p>
                      <p><strong>Gender:</strong> {patientInfo?.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p><strong>Phone:</strong> {patientInfo?.phone || 'N/A'}</p>
                      <p><strong>Doctor:</strong> {appointmentInfo?.doctor?.name || 'N/A'}</p>
                      <p><strong>Date:</strong> {appointmentInfo ? new Date(appointmentInfo.dateTime).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Services Table */}
                <table className="w-full mb-8 border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 p-3 text-left">Description</th>
                      <th className="border border-gray-300 p-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Doctor Consultation Fee</td>
                      <td className="border border-gray-300 p-3 text-right">{billingData.doctorFee.toFixed(2)}</td>
                    </tr>
                    {billingData.additionalMedicinesFee > 0 && (
                      <tr>
                        <td className="border border-gray-300 p-3">Additional Medicines</td>
                        <td className="border border-gray-300 p-3 text-right">{billingData.additionalMedicinesFee.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="border border-gray-300 p-3">Subtotal</td>
                      <td className="border border-gray-300 p-3 text-right font-semibold">
                        {(billingData.doctorFee + billingData.additionalMedicinesFee).toFixed(2)}
                      </td>
                    </tr>
                    {billingData.discount > 0 && (
                      <tr>
                        <td className="border border-gray-300 p-3">Discount</td>
                        <td className="border border-gray-300 p-3 text-right text-red-600">-{billingData.discount.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="bg-blue-50">
                      <td className="border border-gray-300 p-3 font-bold text-lg">TOTAL AMOUNT</td>
                      <td className="border border-gray-300 p-3 text-right font-bold text-lg">₹{billingData.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Payment Terms */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-800 mb-2">Payment Terms:</h3>
                  <p className="text-gray-600">• Payment is due within 30 days of invoice date</p>
                  <p className="text-gray-600">• Please include invoice number with payment</p>
                  <p className="text-gray-600">• For queries, contact: billing@kskhospitals.com</p>
                </div>

                {/* Footer */}
                <div className="text-center border-t pt-4">
                  <p className="text-gray-600">Thank you for choosing KSK Hospitals!</p>
                  <p className="text-sm text-gray-500">This is a computer-generated invoice.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;