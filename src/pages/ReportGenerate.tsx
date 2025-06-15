import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { Select } from "antd";

const { Option } = Select;

const ReportGenerate = () => {
  const reportRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [reportData, setReportData] = useState({
    doctorCharge: "",
    additionalCharges: "",
  });

  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [diseaseImage, setDiseaseImage] = useState(null); // State to store fetched image

  const availableMapOragans = [
    { key: "heart", value: 1, label: "Heart Disease" },
    { key: "lungs", value: 2, label: "Lung Infection" },
    { key: "kidney", value: 3, label: "Kidney Failure" },
    { key: "liver", value: 4, label: "Liver Cirrhosis" },
    { key: "brain", value: 5, label: "Brain Stroke" },
    { key: "stomach", value: 6, label: "Gastric Ulcer" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiseaseSelect = async (value) => {
    setSelectedDiseases(value);

    if (value.length > 0) {
      const lastSelected = value[value.length - 1]; // Get the latest selected value
      fetchDiseaseImage(lastSelected);
    } else {
      setDiseaseImage(null); // Clear image if no selection
    }
  };

  const fetchDiseaseImage = async (pointIndex) => {
    try {
      const token = sessionStorage.getItem("token");
      const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
      const currentUserId = sessionStorage.getItem("useridentifier");

      const response = await axios.get(`/user/process/${pointIndex}`, {
        responseType: "arraybuffer", // To handle binary image response
        headers: {
          Authorization: `Bearer ${token}`,
          CurrentUserId: currentUserId,
          HospitalIdentifier: hospitalIdentifier,
        },
      });

      // const blob = new Blob([response.data], { type: "image/png" });
      // const imageUrl = URL.createObjectURL(blob);
      // setDiseaseImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  // const fetchImage = async (pointIndex) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8081/kskhospital/reflexology/process/${pointIndex}`,
  //       {
  //         responseType: "arraybuffer", // To handle binary image response
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           CurrentUserId: currentUserId,
  //           HospitalIdentifier: hospitalIdentifier,
  //         },
  //       },
  //     );
  //
  //     // Convert binary response to a Base64-encoded image
  //     const base64Image = btoa(
  //       new Uint8Array(response.data).reduce(
  //         (data, byte) => data + String.fromCharCode(byte),
  //         "",
  //       ),
  //     );
  //     setImageSrc(`data:image/jpeg;base64,${base64Image}`);
  //     setSelectedPoint(pointIndex);
  //   } catch (error) {
  //     console.error("Error fetching image:", error);
  //   }
  // };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("Patient_Report.pdf");

        setIsGeneratingPDF(false);
      });
    }, 100);
  };

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div
          ref={reportRef}
          className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6"
        >
          {/* Company Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="../../src/images/logo/logo.png"
              alt="Company Logo"
              className="h-16"
            />
          </div>

          {/* Report Header */}
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

          {/* Diagnosed Diseases/Conditions */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Diagnosed Diseases/Conditions
            </label>
            <Select
              mode="multiple"
              placeholder="Search and add diseases"
              value={selectedDiseases}
              onChange={handleDiseaseSelect}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              }
              className="w-full border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary"
            >
              {availableMapOragans.map((disease) => (
                <Option key={disease.key} value={disease.value}>
                  {disease.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <img
              src="../../src/images/logo/reflexology_test.jpeg"
              alt="Selected Disease"
              className="w-92 h-92 rounded-lg border"
            />
          </div>
          {/* Display Disease Image if available */}
          {diseaseImage && (
            <div className="mt-4 flex justify-center">
              <img
                src={diseaseImage}
                alt="Reflexology Point"
                className="max-w-full h-auto border border-gray-300 p-2 rounded-md"
              />
            </div>
          )}

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
