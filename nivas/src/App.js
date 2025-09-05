import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./page/SignInPage";
import RegisterPage from "./page/RegisterPage";

import ReportForm from "./page/ReportForm";
import Home from "./page/home";
import TrackComplaint from "./page/getcomplaint";
import Profile from "./page/profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/report" element={<ReportForm />} />
      <Route path="/getcomplaint" element={<TrackComplaint />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
