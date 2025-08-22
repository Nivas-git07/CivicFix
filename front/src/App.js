import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import RegisterPage from "./components/RegisterPage";
import ReportForm from "./components/ReportForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/ReportForm" element={<ReportForm/>}/>
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
