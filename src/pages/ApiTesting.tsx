import React, { useState } from "react";
import axios from "axios";
import { message, Button, Card, Input, Select, Space, Divider, Typography, Row, Col } from "antd";
import PageTitle from "../components/PageTitle";

const { Title, Text } = Typography;
const { Option } = Select;

const ApiTesting = () => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [testData, setTestData] = useState({
    designationIdentifier: "a45f6bce-72cc-4be4-b70f-519b89eec3df",
    userId: "",
    hospitalIdentifier: "",
    userIdentifier: "",
  });

  const token = sessionStorage.getItem("token");

  const setLoadingState = (key: string, loading: boolean) => {
    setLoading(prev => ({ ...prev, [key]: loading }));
  };

  const setResponse = (key: string, response: any) => {
    setResponses(prev => ({ ...prev, [key]: response }));
  };

  // User APIs
  const testGetAllDesignations = async () => {
    setLoadingState("getAllDesignations", true);
    try {
      const response = await axios.get("/user/getAllDesignations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("getAllDesignations", response.data);
      message.success("getAllDesignations API call successful");
    } catch (error: any) {
      setResponse("getAllDesignations", { error: error.response?.data || error.message });
      message.error("getAllDesignations API call failed");
    } finally {
      setLoadingState("getAllDesignations", false);
    }
  };

  const testFilterUserByDesignation = async () => {
    setLoadingState("filterUserByDesignation", true);
    try {
      const response = await axios.get(`/user/filterUserByDesignation/${testData.designationIdentifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("filterUserByDesignation", response.data);
      message.success("filterUserByDesignation API call successful");
    } catch (error: any) {
      setResponse("filterUserByDesignation", { error: error.response?.data || error.message });
      message.error("filterUserByDesignation API call failed");
    } finally {
      setLoadingState("filterUserByDesignation", false);
    }
  };

  const testGetAllUsers = async () => {
    setLoadingState("getAllUsers", true);
    try {
      const response = await axios.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("getAllUsers", response.data);
      message.success("getAllUsers API call successful");
    } catch (error: any) {
      setResponse("getAllUsers", { error: error.response?.data || error.message });
      message.error("getAllUsers API call failed");
    } finally {
      setLoadingState("getAllUsers", false);
    }
  };

  const testGetUserById = async () => {
    if (!testData.userId) {
      message.error("Please enter a User ID");
      return;
    }
    setLoadingState("getUserById", true);
    try {
      const response = await axios.get(`/user/${testData.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("getUserById", response.data);
      message.success("getUserById API call successful");
    } catch (error: any) {
      setResponse("getUserById", { error: error.response?.data || error.message });
      message.error("getUserById API call failed");
    } finally {
      setLoadingState("getUserById", false);
    }
  };

  const testCreateUser = async () => {
    const userData = {
      identifier: testData.userIdentifier || sessionStorage.getItem("userIdentifier"),
      dob: "1990-01-01",
      age: "30",
      name: "Test User",
      email: "test@example.com",
      role: "MEMBER",
      password: "testpassword",
      phone: "1234567890",
      address: {
        addressLine1: "Test Address",
        addressLine2: "",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
        postalCode: "12345",
      },
      hospitalIdentifier: testData.hospitalIdentifier || sessionStorage.getItem("HospitalIdentifier"),
      designation: "Test Designation",
    };

    setLoadingState("createUser", true);
    try {
      const response = await axios.post("/user", userData, {
        headers: {
          "Content-Type": "application/json",
          CurrentUserId: sessionStorage.getItem("useridentifier"),
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("createUser", response.data);
      message.success("createUser API call successful");
    } catch (error: any) {
      setResponse("createUser", { error: error.response?.data || error.message });
      message.error("createUser API call failed");
    } finally {
      setLoadingState("createUser", false);
    }
  };

  const testUpdateUser = async () => {
    if (!testData.userId) {
      message.error("Please enter a User ID");
      return;
    }
    const userData = {
      name: "Updated Test User",
      email: "updated@example.com",
      phone: "9876543210",
    };

    setLoadingState("updateUser", true);
    try {
      const response = await axios.put(`/user/${testData.userId}`, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("updateUser", response.data);
      message.success("updateUser API call successful");
    } catch (error: any) {
      setResponse("updateUser", { error: error.response?.data || error.message });
      message.error("updateUser API call failed");
    } finally {
      setLoadingState("updateUser", false);
    }
  };

  const testDeleteUser = async () => {
    if (!testData.userId) {
      message.error("Please enter a User ID");
      return;
    }
    setLoadingState("deleteUser", true);
    try {
      const response = await axios.delete(`/user/${testData.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("deleteUser", response.data);
      message.success("deleteUser API call successful");
    } catch (error: any) {
      setResponse("deleteUser", { error: error.response?.data || error.message });
      message.error("deleteUser API call failed");
    } finally {
      setLoadingState("deleteUser", false);
    }
  };

  // Hospital APIs
  const testGetAllHospitals = async () => {
    setLoadingState("getAllHospitals", true);
    try {
      const response = await axios.get("/hospital", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("getAllHospitals", response.data);
      message.success("getAllHospitals API call successful");
    } catch (error: any) {
      setResponse("getAllHospitals", { error: error.response?.data || error.message });
      message.error("getAllHospitals API call failed");
    } finally {
      setLoadingState("getAllHospitals", false);
    }
  };

  const testGetHospitalById = async () => {
    if (!testData.hospitalIdentifier) {
      message.error("Please enter a Hospital Identifier");
      return;
    }
    setLoadingState("getHospitalById", true);
    try {
      const response = await axios.get(`/hospital/${testData.hospitalIdentifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("getHospitalById", response.data);
      message.success("getHospitalById API call successful");
    } catch (error: any) {
      setResponse("getHospitalById", { error: error.response?.data || error.message });
      message.error("getHospitalById API call failed");
    } finally {
      setLoadingState("getHospitalById", false);
    }
  };

  // Patient APIs
  const testGetAllPatients = async () => {
    setLoadingState("getAllPatients", true);
    try {
      const response = await axios.get("/patient", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("getAllPatients", response.data);
      message.success("getAllPatients API call successful");
    } catch (error: any) {
      setResponse("getAllPatients", { error: error.response?.data || error.message });
      message.error("getAllPatients API call failed");
    } finally {
      setLoadingState("getAllPatients", false);
    }
  };

  const testCreatePatient = async () => {
    const patientData = {
      name: "Test Patient",
      age: "25",
      gender: "MALE",
      phone: "1234567890",
      address: "Test Address",
      hospitalIdentifier: testData.hospitalIdentifier || sessionStorage.getItem("HospitalIdentifier"),
    };

    setLoadingState("createPatient", true);
    try {
      const response = await axios.post("/patient", patientData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("createPatient", response.data);
      message.success("createPatient API call successful");
    } catch (error: any) {
      setResponse("createPatient", { error: error.response?.data || error.message });
      message.error("createPatient API call failed");
    } finally {
      setLoadingState("createPatient", false);
    }
  };

  // Doctor APIs
  const testGetAllDoctors = async () => {
    setLoadingState("getAllDoctors", true);
    try {
      const response = await axios.get("/doctor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("getAllDoctors", response.data);
      message.success("getAllDoctors API call successful");
    } catch (error: any) {
      setResponse("getAllDoctors", { error: error.response?.data || error.message });
      message.error("getAllDoctors API call failed");
    } finally {
      setLoadingState("getAllDoctors", false);
    }
  };

  const testCreateDoctor = async () => {
    const doctorData = {
      name: "Test Doctor",
      specialization: "Cardiology",
      phone: "1234567890",
      email: "doctor@example.com",
      hospitalIdentifier: testData.hospitalIdentifier || sessionStorage.getItem("HospitalIdentifier"),
    };

    setLoadingState("createDoctor", true);
    try {
      const response = await axios.post("/doctor", doctorData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("createDoctor", response.data);
      message.success("createDoctor API call successful");
    } catch (error: any) {
      setResponse("createDoctor", { error: error.response?.data || error.message });
      message.error("createDoctor API call failed");
    } finally {
      setLoadingState("createDoctor", false);
    }
  };

  // Appointment APIs
  const testGetAllAppointments = async () => {
    setLoadingState("getAllAppointments", true);
    try {
      const response = await axios.get("/appointment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("getAllAppointments", response.data);
      message.success("getAllAppointments API call successful");
    } catch (error: any) {
      setResponse("getAllAppointments", { error: error.response?.data || error.message });
      message.error("getAllAppointments API call failed");
    } finally {
      setLoadingState("getAllAppointments", false);
    }
  };

  const testCreateAppointment = async () => {
    const appointmentData = {
      patientId: "test-patient-id",
      doctorId: "test-doctor-id",
      appointmentDate: "2024-01-15",
      appointmentTime: "10:00",
      status: "SCHEDULED",
      hospitalIdentifier: testData.hospitalIdentifier || sessionStorage.getItem("HospitalIdentifier"),
    };

    setLoadingState("createAppointment", true);
    try {
      const response = await axios.post("/appointment", appointmentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse("createAppointment", response.data);
      message.success("createAppointment API call successful");
    } catch (error: any) {
      setResponse("createAppointment", { error: error.response?.data || error.message });
      message.error("createAppointment API call failed");
    } finally {
      setLoadingState("createAppointment", false);
    }
  };

  const renderApiSection = (title: string, apis: Array<{ name: string; testFn: () => void; description: string }>) => (
    <Card title={title} style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        {apis.map((api) => (
          <Col xs={24} sm={12} md={8} lg={6} key={api.name}>
            <Card size="small" title={api.name}>
              <Text type="secondary">{api.description}</Text>
              <br />
              <Button
                type="primary"
                onClick={api.testFn}
                loading={loading[api.name]}
                style={{ marginTop: 8 }}
                block
              >
                Test {api.name}
              </Button>
              {responses[api.name] && (
                <div style={{ marginTop: 8 }}>
                  <Text strong>Response:</Text>
                  <pre style={{ fontSize: '12px', maxHeight: '100px', overflow: 'auto' }}>
                    {JSON.stringify(responses[api.name], null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );

  return (
    <>
      <PageTitle title="API Testing" />
      <div style={{ padding: '20px' }}>
        <Title level={2}>KSK Hospital API Testing Dashboard</Title>
        <Text type="secondary">Test all backend APIs from the KSK Hospital system</Text>
        
        <Divider />

        {/* Test Data Input */}
        <Card title="Test Data Configuration" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Text>User ID:</Text>
              <Input
                placeholder="Enter User ID"
                value={testData.userId}
                onChange={(e) => setTestData({ ...testData, userId: e.target.value })}
                style={{ marginTop: 4 }}
              />
            </Col>
            <Col span={6}>
              <Text>Hospital Identifier:</Text>
              <Input
                placeholder="Enter Hospital Identifier"
                value={testData.hospitalIdentifier}
                onChange={(e) => setTestData({ ...testData, hospitalIdentifier: e.target.value })}
                style={{ marginTop: 4 }}
              />
            </Col>
            <Col span={6}>
              <Text>User Identifier:</Text>
              <Input
                placeholder="Enter User Identifier"
                value={testData.userIdentifier}
                onChange={(e) => setTestData({ ...testData, userIdentifier: e.target.value })}
                style={{ marginTop: 4 }}
              />
            </Col>
            <Col span={6}>
              <Text>Designation Identifier:</Text>
              <Input
                placeholder="Enter Designation Identifier"
                value={testData.designationIdentifier}
                onChange={(e) => setTestData({ ...testData, designationIdentifier: e.target.value })}
                style={{ marginTop: 4 }}
              />
            </Col>
          </Row>
        </Card>

        {/* User APIs */}
        {renderApiSection("User Management APIs", [
          {
            name: "getAllDesignations",
            testFn: testGetAllDesignations,
            description: "Get all designations from the system"
          },
          {
            name: "filterUserByDesignation",
            testFn: testFilterUserByDesignation,
            description: "Filter users by designation identifier"
          },
          {
            name: "getAllUsers",
            testFn: testGetAllUsers,
            description: "Get all users from the system"
          },
          {
            name: "getUserById",
            testFn: testGetUserById,
            description: "Get user by specific ID"
          },
          {
            name: "createUser",
            testFn: testCreateUser,
            description: "Create a new user"
          },
          {
            name: "updateUser",
            testFn: testUpdateUser,
            description: "Update existing user"
          },
          {
            name: "deleteUser",
            testFn: testDeleteUser,
            description: "Delete user by ID"
          }
        ])}

        {/* Hospital APIs */}
        {renderApiSection("Hospital Management APIs", [
          {
            name: "getAllHospitals",
            testFn: testGetAllHospitals,
            description: "Get all hospitals from the system"
          },
          {
            name: "getHospitalById",
            testFn: testGetHospitalById,
            description: "Get hospital by specific identifier"
          }
        ])}

        {/* Patient APIs */}
        {renderApiSection("Patient Management APIs", [
          {
            name: "getAllPatients",
            testFn: testGetAllPatients,
            description: "Get all patients from the system"
          },
          {
            name: "createPatient",
            testFn: testCreatePatient,
            description: "Create a new patient"
          }
        ])}

        {/* Doctor APIs */}
        {renderApiSection("Doctor Management APIs", [
          {
            name: "getAllDoctors",
            testFn: testGetAllDoctors,
            description: "Get all doctors from the system"
          },
          {
            name: "createDoctor",
            testFn: testCreateDoctor,
            description: "Create a new doctor"
          }
        ])}

        {/* Appointment APIs */}
        {renderApiSection("Appointment Management APIs", [
          {
            name: "getAllAppointments",
            testFn: testGetAllAppointments,
            description: "Get all appointments from the system"
          },
          {
            name: "createAppointment",
            testFn: testCreateAppointment,
            description: "Create a new appointment"
          }
        ])}
      </div>
    </>
  );
};

export default ApiTesting; 