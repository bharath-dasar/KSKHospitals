import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import Calendar from "./pages/Calendar";
import Chart from "./pages/Chart";
import ECommerce from "./pages/Dashboard/ECommerce";
import FormElements from "./pages/Form/FormElements";
import FormLayout from "./pages/Form/FormLayout";
import Profile from "./pages/Profile";
// import Settings from './pages/Settings';
// import CreateUser from './pages/CreatePatient';
import PatientForm from "./pages/PatientForm";
import ReportForm from "./pages/ReportForm";
import CreateUser from "./pages/CreateUser";
import Tables from "./pages/Tables";
import Alerts from "./pages/UiElements/Alerts";
import Buttons from "./pages/UiElements/Buttons";
import DefaultLayout from "./layout/DefaultLayout";
import List from "./pages/List";
import UserList from "./components/Tables/UserList";
import ClientList from "./components/Tables/ClientList";
import MedicinesList from "./components/Tables/MedicinesList";
import DoctorList from "./components/Tables/DoctorList";
import CreatePatient from "./pages/CreatePatient";
import DoctorForm from "./pages/DoctorForm";
import Appointments from "./components/Tables/Appointments";
import axios from "axios";
import ReportGenerate from "./pages/ReportGenerate";

axios.defaults.baseURL = "https://kskhospital.prime5d.in/kskhospital";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            isLoggedIn ? (
              <>
                <PageTitle title="Dashboard " />
                <ECommerce />
              </>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar " />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements " />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout " />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables " />
              <Tables />
            </>
          }
        />
        <Route
          path="/list"
          element={
            <>
              <PageTitle title="Tables " />
              <List />
            </>
          }
        />
        <Route
          path="/userList"
          element={
            <>
              <PageTitle title="Users" />
              <UserList />
            </>
          }
        />
        <Route
          path="/clientList"
          element={
            <>
              <PageTitle title="Clients" />
              <ClientList />
            </>
          }
        />
        <Route
          path="/medicineList"
          element={
            <>
              <PageTitle title="Pharamacy" />
              <MedicinesList />
            </>
          }
        />
        <Route
          path="/doctorsList"
          element={
            <>
              <PageTitle title="Doctors" />
              <DoctorList />
            </>
          }
        />
        <Route
          path="/patientForm"
          element={
            <>
              <PageTitle title="patientForm " />
              <PatientForm />
            </>
          }
        />
        <Route
          path="/reportForm"
          element={
            <>
              <PageTitle title="reportForm " />
              <ReportGenerate />
            </>
          }
        />
        <Route
          path="/reportgenerate"
          element={
            <>
              <PageTitle title="reportForm " />
              <ReportGenerate />
            </>
          }
        />
        <Route
          path="/appointments"
          element={
            <>
              <PageTitle title="appointments" />
              <Appointments />
            </>
          }
        />
        <Route
          path="/doctorForm"
          element={
            <>
              <PageTitle title="doctorForm " />
              <DoctorForm />
            </>
          }
        />
        <Route
          path="/createPatient"
          element={
            <>
              <PageTitle title="Settings " />
              <CreatePatient />
            </>
          }
        />
        <Route
          path="/createUser"
          element={
            <>
              <PageTitle title="Settings " />
              <CreateUser />
            </>
          }
        />
        <Route
          path="/createUser"
          element={
            <>
              <PageTitle title="Settings " />
              <CreateUser />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart " />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts " />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons " />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin " />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup " />
              <SignUp />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
