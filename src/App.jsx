import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import CursorEffect from "./components/CursorEffect";
import BackgroundEffect from "./components/BackgroundEffect";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MySkills from "./pages/MySkills";
import BrowseSkills from "./pages/BrowseSkills";
import StudentProfile from "./pages/StudentProfile";
import Requests from "./pages/Requests";
import Messages from "./pages/Messages";

function App() {
  return (
    <Router>
      <BackgroundEffect />
      <CursorEffect />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-skills" element={<MySkills />} />
            <Route path="/skills" element={<BrowseSkills />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
