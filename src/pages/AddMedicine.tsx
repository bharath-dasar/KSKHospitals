import { message } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Types
interface MedicineFormData {
  name: string;
  hsn: string;
  description: string;
  gst: string;
  category: string;
  unit: string;
  stock_qty: string;
  selling_price: string;
  mrp: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const AddMedicine = () => {
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState<MedicineFormData>({
    name: "",
    hsn: "",
    description: "",
    gst: "",
    category: "",
    unit: "",
    stock_qty: "",
    selling_price: "",
    mrp: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Medicine name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return '';
      
      case 'hsn':
        if (!value) return 'HSN code is required';
        if (!/^\d+$/.test(value)) return 'HSN must be a valid number';
        return '';
      
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 5) return 'Description must be at least 5 characters';
        return '';
      
      case 'gst':
        if (!value) return 'GST percentage is required';
        if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'GST must be a valid number';
        const gstValue = parseFloat(value);
        if (gstValue < 0 || gstValue > 100) return 'GST must be between 0 and 100';
        return '';
      
      case 'category':
        if (!value.trim()) return 'Category is required';
        return '';
      
      case 'unit':
        if (!value.trim()) return 'Unit is required';
        return '';
      
      case 'stock_qty':
        if (!value) return 'Stock quantity is required';
        if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Stock quantity must be a valid number';
        if (parseFloat(value) < 0) return 'Stock quantity cannot be negative';
        return '';
      
      case 'selling_price':
        if (!value) return 'Selling price is required';
        if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Selling price must be a valid number';
        if (parseFloat(value) < 0) return 'Selling price cannot be negative';
        return '';
      
      case 'mrp':
        if (!value) return 'MRP is required';
        if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'MRP must be a valid number';
        if (parseFloat(value) < 0) return 'MRP cannot be negative';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof MedicineFormData]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    // Additional validation: MRP should be greater than or equal to selling price
    const mrp = parseFloat(formData.mrp);
    const sellingPrice = parseFloat(formData.selling_price);
    if (mrp < sellingPrice) {
      errors.mrp = 'MRP should be greater than or equal to selling price';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const getAuthData = () => {
    const token = sessionStorage.getItem("token");
    const hospitalIdentifier = sessionStorage.getItem("HospitalIdentifier");
    const userIdentifier = sessionStorage.getItem("userIdentifier");

    if (!token || !hospitalIdentifier || !userIdentifier) {
      throw new Error("Authentication data is missing");
    }

    return { token, hospitalIdentifier, userIdentifier };
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

  // API functions
  const createMedicine = async (): Promise<void> => {
    try {
      const { token, hospitalIdentifier, userIdentifier } = getAuthData();
      
      const requestBody = {
        identifier: crypto.randomUUID(),
        name: formData.name.trim(),
        hsn: parseInt(formData.hsn),
        description: formData.description.trim(),
        gst: parseFloat(formData.gst),
        category: formData.category.trim(),
        unit: formData.unit.trim(),
        stocks: [
          {
            hospitalIdentifier: hospitalIdentifier,
            stockIdentifier: crypto.randomUUID(),
            stock_qty: parseFloat(formData.stock_qty),
            update_stock_qty: parseFloat(formData.stock_qty),
            selling_price: parseFloat(formData.selling_price),
            mrp: parseFloat(formData.mrp)
          }
        ]
      };

      console.log('Request Body:', requestBody); // Debug log

      const response = await axios.post("/product", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Medicine created successfully");
      navigate("/medicineList");
    } catch (error: any) {
      console.error("Error creating medicine:", error);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        const errorMessage = typeof errorData === 'object' 
          ? Object.values(errorData).join(", ")
          : errorData;
        message.error(`Validation error: ${errorMessage}`);
      } else if (error.response?.status) {
        message.error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        message.error("No response from server. Please try again.");
      } else {
        message.error(`Request failed: ${error.message}`);
      }
    }
  };

  // Form submission
  const handleCreateMedicine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      message.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      await createMedicine();
    } finally {
      setLoading(false);
    }
  };

  // Render helper functions
  const renderInputField = (
    name: keyof MedicineFormData,
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
        value={formData[name]}
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
    name: keyof MedicineFormData,
    label: string,
    rows: number = 3,
    placeholder: string = "Type here"
  ) => (
    <div className="mb-4.5">
      <label className="mb-2.5 block text-black dark:text-white">
        {label} <span className="text-meta-1">*</span>
      </label>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
          validationErrors[name] 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-stroke'
        } bg-transparent`}
      />
      {validationErrors[name] && (
        <div className="text-red-500 text-sm mt-1">{validationErrors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add New Medicine
            </h3>
          </div>
          <form onSubmit={handleCreateMedicine}>
            <div className="p-6.5">
              {/* Basic Information */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('name', 'Medicine Name', 'text', 'Enter medicine name', true)}
                {renderInputField('hsn', 'HSN Code', 'number', 'Enter HSN code', true)}
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('category', 'Category', 'text', 'Enter category', true)}
                {renderInputField('unit', 'Unit', 'text', 'e.g., Pcs, Kg, Ltr', true)}
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('gst', 'GST (%)', 'number', 'Enter GST percentage', true)}
              </div>

              {/* Description */}
              {renderTextArea('description', 'Description', 3, 'Enter medicine description...')}

              {/* Stock and Pricing Information */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {renderInputField('stock_qty', 'Stock Quantity', 'number', 'Enter stock quantity', true)}
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    MRP (₹) <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="mrp"
                    placeholder="Enter Maximum Retail Price"
                    value={formData.mrp}
                    onChange={handleChange}
                    className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      validationErrors.mrp 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-stroke dark:border-form-strokedark'
                    } bg-transparent`}
                  />
                  {validationErrors.mrp && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.mrp}</div>
                  )}
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Selling Price (₹) <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="selling_price"
                    placeholder="Enter selling price"
                    value={formData.selling_price}
                    onChange={handleChange}
                    className={`w-full rounded border-[1.5px] py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      validationErrors.selling_price 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-stroke dark:border-form-strokedark'
                    } bg-transparent`}
                  />
                  {validationErrors.selling_price && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.selling_price}</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Creating Medicine...' : 'Create Medicine'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicine; 