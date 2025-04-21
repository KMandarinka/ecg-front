import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';
import SelectPatientPage from "./pages/SelectPatientPage/SelectPatientPage.jsx";
import AddPatientPage from "./pages/AddPatientPage/AddPatientPage";
import PatientPage from './pages/PatientPage/PatientPage';
import ECGVECGPage from './pages/ECGVECGPage/ECGVECGPage.jsx';
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage.jsx";
import ArchivePage from "./pages/ArchivePage/ArchivePage.jsx";



const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/select-patient" element={<SelectPatientPage />} />
      <Route path="/add-patient" element={<AddPatientPage />} />
      <Route path="/patient" element={<PatientPage />} />
      <Route path="/ecgvecg" element={<ECGVECGPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/archive" element={<ArchivePage />} />
    </Routes>
  </Router>
);

export default App;
