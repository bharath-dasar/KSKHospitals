export interface Doctor {
  identifier: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  designationDetails: string;
  designation: {
    identifier: string;
    name: string;
  };
}
