import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TeamDashboard from "./pages/TeamDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Dashboard Đội hình */}
        <Route path="/team" element={<TeamDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;