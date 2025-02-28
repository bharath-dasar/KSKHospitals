import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportGenerate = () => {
  const reportRef = useRef(null);
  const [reportData, setReportData] = useState({
    doctorCharge: "",
    additionalCharges: "",
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false); // Hide button when generating PDF

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true); // Hide button before generating PDF

    setTimeout(() => {
      html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("Patient_Report.pdf");

        setIsGeneratingPDF(false); // Show button after generating PDF
      });
    }, 100); // Small delay to ensure button is hidden
  };

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div
          ref={reportRef}
          className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6"
        >
          {/* 🔹 Company Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="../../src/images/logo/logo.png"
              alt="Company Logo"
              className="h-16"
            />
          </div>

          <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Report Page
            </h3>
          </div>

          {/* Doctor Charge Input */}
          <div className="m-8.5">
            <label className="mb-4.5 block text-black dark:text-white">
              Doctor's Fee
            </label>
            <input
              type="number"
              name="doctorCharge"
              placeholder="Enter doctor's fee"
              value={reportData.doctorCharge}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Additional Charges Input */}
          <div className="m-8.5">
            <label className="mb-4.5 block text-black dark:text-white">
              Additional Charges
            </label>
            <input
              type="number"
              name="additionalCharges"
              placeholder="Enter additional charges"
              value={reportData.additionalCharges}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Generate Bill Button (Hidden in PDF) */}
          {!isGeneratingPDF && (
            <button
              onClick={generatePDF}
              className="w-full mt-4 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              Generate Bill
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerate;
