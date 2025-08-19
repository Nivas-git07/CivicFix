import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import RegisterPage from "./components/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
