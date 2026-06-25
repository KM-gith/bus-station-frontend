import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Buses from "../components/admin/Buses";
import Routes from "../components/admin/Routes";
import Schedules from "../components/admin/Schedules";
import Tickets from "../components/admin/Tickets";

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("buses");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const tabs = [
    { id: "buses", label: " Buses" },
    { id: "routes", label: " Routes" },
    { id: "schedules", label: " Schedules" },
    { id: "tickets", label: " Tickets" },
  ];

  return (
    <div className="min-h-screen bg-blue-50">

      {/* NAVBAR */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
        
          <div>
            <h1 className="text-lg font-black tracking-tight">Bus Station Scheduling System</h1>
            <p className="text-blue-200 text-xs font-medium">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-blue-300">Admin</p>
            <p className="text-sm font-semibold">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 rounded-xl text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* TABS */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex gap-1 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
                activeTab === tab.id
                  ? "bg-blue-700 text-white shadow-md shadow-blue-200"
                  : "text-gray-500 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {activeTab === "buses" && <Buses />}
        {activeTab === "routes" && <Routes />}
        {activeTab === "schedules" && <Schedules />}
        {activeTab === "tickets" && <Tickets />}
      </div>
    </div>
  );
}

export default AdminDashboard;
