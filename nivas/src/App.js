import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import RegisterPage from "./components/RegisterPage";
import ProfileDashboard from "./components/ProfileDashboard";
import ReportForm from "./components/ReportForm";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<SignInPage />} />
      <Route path="/register" element={<RegisterPage />} />
       <Route path="/dashboard" element={<ProfileDashboard />} /> */}
      <Route path="/report" element={<ReportForm />} />
    </Routes>
  );
}

export default App;
