import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function DriverDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchSchedules = async () => {
    try {
      const res = await axios.get("${import.meta.env.VITE_API_URL}/schedules", authHeader);
      setSchedules(res.data);
    } catch {
      setError("Failed to fetch schedules.");
    }
  };

  useEffect(() => { fetchSchedules(); }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/schedules/${id}`, { status }, authHeader);
      fetchSchedules();
    } catch {
      setError("Failed to update status.");
    }
  };

  const statusConfig = {
    scheduled: { color: "bg-blue-100 text-blue-700", label: "Scheduled" },
    departed:  { color: "bg-yellow-100 text-yellow-700", label: "Departed" },
    arrived:   { color: "bg-green-100 text-green-700", label: "Arrived" },
    cancelled: { color: "bg-red-100 text-red-600", label: "Cancelled" },
  };

  return (
    <div className="min-h-screen bg-blue-50">

      {/* NAVBAR */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-black tracking-tight">Bus Station Scheduling System</h1>
            <p className="text-blue-200 text-xs font-medium">Driver Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-blue-300">Driver</p>
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

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-black text-gray-900 mb-6"> My Schedules</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="grid gap-4">
          {schedules.length === 0 && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 text-center text-gray-400">
              No schedules assigned yet.
            </div>
          )}
          {schedules.map((s) => (
            <div key={s._id} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 hover:border-blue-300 transition">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 mb-1">
                    {s.route?.origin} → {s.route?.destination}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Bus: {s.bus?.busNumber} — {s.bus?.plateNumber}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-blue-400 font-medium mb-0.5">Departure</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(s.departureTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-blue-400 font-medium mb-0.5">Arrival</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(s.arrivalTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-blue-400 font-medium mb-0.5">Available Seats</p>
                      <p className="text-sm font-bold text-blue-700">{s.availableSeats}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 items-end">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                    statusConfig[s.status]?.color || "bg-gray-100 text-gray-600"
                  }`}>
                    {statusConfig[s.status]?.label || s.status}
                  </span>

                  <div className="flex gap-2">
                    {s.status === "scheduled" && (
                      <button
                        onClick={() => handleStatusUpdate(s._id, "departed")}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold rounded-xl transition shadow-md shadow-yellow-100"
                      >
                        Mark Departed
                      </button>
                    )}
                    {s.status === "departed" && (
                      <button
                        onClick={() => handleStatusUpdate(s._id, "arrived")}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-200"
                      >
                        Mark Arrived
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
