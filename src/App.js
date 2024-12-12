import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';
import SelectPatientPage from "./pages/SelectPatientPage/SelectPatientPage.jsx";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/select-patient" element={<SelectPatientPage />} />
    </Routes>
  </Router>
);

export default App;
