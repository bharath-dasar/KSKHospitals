export type Package = {
  identifier: string;
  name: string; // Combine first and last name
  phone: string; // Ensure to add this if needed
  email: string;
  role: string;
  designation?: {
    identifier: string;
    name: string;
  };
};
export type PackagePatient = {
  patientIdentifier: string;
  username: string; // Combine first and last name
  // age: number;
  phone: string; // Ensure to add this if needed
  email: string; // Ensure to add this if needed
  dob: string; // Ensure to add this if needed
  lastVisitedTime?: string; // Last visited time for the patient
  healthMetrics?: {
    updatedDateTime?: string;
    [key: string]: any;
  };
};
