import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./frontend/SignInPage";
import RegisterPage from "./frontend/RegisterPage";
import ProfileDashboard from "./frontend/ProfileDashboard";
import ReportForm from "./frontend/ReportForm";
import Home from "./frontend/home";
import TrackComplaint from "./frontend/getcomplaint";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/report" element={<ReportForm />} />
      <Route path="/getcomplaint" element={<TrackComplaint />} />
    </Routes>
  );
}

export default App;
