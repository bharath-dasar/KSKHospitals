export type Package = {
  id: number;
  lastName: string;
  firstName: string;
  age: number;
  role: string;
};
export type PackagePatient = {
  id: number;
  fullName: string;    // Combine first and last name
  // age: number;
  phoneNumber: string; // Ensure to add this if needed
  email: string;       // Ensure to add this if needed
  dob: string;         // Ensure to add this if needed
};

