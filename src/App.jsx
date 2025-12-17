import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import HomePage from "./pages/home.jsx";
import ForgetPasswordPage from "./pages/forgetPassword.jsx";
// import Header from "./components/header.jsx";
import AdminPage from "./pages/adminPAge.jsx";
import TestPage from "./pages/testPage.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <div className="">
        <Toaster position="top-center" />
        {/* <Header/> */}
        <Routes path="/*">
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forget" element={<ForgetPasswordPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/*" element={<HomePage />} />
          <Route path="/testing" element={<TestPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


//https://kuieyzgnzuxwutbpsfzb.supabase.co

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1aWV5emduenV4d3V0YnBzZnpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMjIzNzYsImV4cCI6MjA3MjY5ODM3Nn0.q4pVuPQ8ZnM5hgVAR9OPTh_gtuX3oBIk2n84OL0Bmo8
