import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PassengerDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("search");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchSchedules = async () => {
    try {
      const res = await axios.get("https://bus-station-backend-265a.onrender.com/schedules", authHeader);
      setSchedules(res.data);
    } catch {
      setError("Failed to fetch schedules.");
    }
  };

  const fetchMyTickets = async () => {
    try {
      const res = await axios.get("https://bus-station-backend-265a.onrender.com/tickets/my", authHeader);
      setMyTickets(res.data);
    } catch {
      setError("Failed to fetch tickets.");
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchMyTickets();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBookTicket = async (scheduleId, seatNumber) => {
    setError("");
    setSuccess("");
    try {
      await axios.post("https://bus-station-backend-265a.onrender.com/tickets", { scheduleId, seatNumber }, authHeader);
      setSuccess("Ticket booked successfully! ");
      fetchSchedules();
      fetchMyTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book ticket.");
    }
  };

  const handleCancelTicket = async (ticketId) => {
    setError("");
    setSuccess("");
    try {
      await axios.put(`https://bus-station-backend-265a.onrender.com/tickets/${ticketId}/cancel`, {}, authHeader);
      setSuccess("Ticket cancelled.");
      fetchMyTickets();
      fetchSchedules();
    } catch {
      setError("Failed to cancel ticket.");
    }
  };

  const tabs = [
    { id: "search", label: " Available Buses" },
    { id: "tickets", label: " My Tickets" },
  ];

  return (
    <div className="min-h-screen bg-blue-50">

      {/* NAVBAR */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-black tracking-tight">Bus Station Scheduling System</h1>
            <p className="text-blue-200 text-xs font-medium">Passenger Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-blue-300">Signed in as</p>
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
        <div className="max-w-5xl mx-auto px-6 flex gap-1 py-3">
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
      <div className="max-w-5xl mx-auto px-6 py-6">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-xl mb-4 text-sm">
            ✅ {success}
          </div>
        )}

        {/* AVAILABLE BUSES */}
        {activeTab === "search" && (
          <div className="grid gap-4">
            <h2 className="text-2xl font-black text-gray-900"> Available Buses</h2>
            {schedules.filter(s => s.status === "scheduled").length === 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 text-center text-gray-400">
                No available buses at the moment.
              </div>
            )}
            {schedules
              .filter((s) => s.status === "scheduled" && s.availableSeats > 0)
              .map((s) => (
                <div key={s._id} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 hover:border-blue-300 transition">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-black text-gray-900">
                          {s.route?.origin} → {s.route?.destination}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Bus: {s.bus?.busNumber} ({s.bus?.busType})
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                          <p className="text-xs text-blue-400 font-medium mb-0.5">Seats Left</p>
                          <p className="text-sm font-bold text-blue-700">{s.availableSeats} seats</p>
                        </div>
                        <div className="bg-blue-700 rounded-xl p-3">
                          <p className="text-xs text-blue-200 font-medium mb-0.5">Price</p>
                          <p className="text-sm font-bold text-white">ETB {s.route?.price}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end min-w-[100px]">
                      <input
                        type="number"
                        placeholder="Seat No."
                        min="1"
                        max={s.bus?.totalSeats}
                        className="w-24 p-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition text-center font-semibold"
                        id={`seat-${s._id}`}
                      />
                      <button
                        onClick={() => {
                          const seat = document.getElementById(`seat-${s._id}`).value;
                          if (!seat) {
                            setError("Please enter a seat number.");
                            return;
                          }
                          handleBookTicket(s._id, parseInt(seat));
                        }}
                        className="w-24 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition shadow-md shadow-blue-200"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* MY TICKETS */}
        {activeTab === "tickets" && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6"> My Tickets</h2>
            {myTickets.length === 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 text-center text-gray-400">
                No tickets yet. Book one from Available Buses!
              </div>
            )}
            <div className="grid gap-4">
             {myTickets
              .filter((t) => t.status !== "cancelled")
              .map((t) => (
                <div key={t._id} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                          {t.ticketCode}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          t.status === "booked" ? "bg-blue-100 text-blue-700" :
                          t.status === "cancelled" ? "bg-red-100 text-red-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-gray-900">
                        {t.schedule?.route?.origin} → {t.schedule?.route?.destination}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Bus: {t.schedule?.bus?.busNumber} | Seat: <span className="font-bold text-gray-700">{t.seatNumber}</span>
                      </p>
                      <p className="text-blue-700 font-black text-base mt-2">
                        ETB {t.price}
                      </p>
                    </div>

                    {t.status === "booked" && (
                      <button
                        onClick={() => handleCancelTicket(t._id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold rounded-xl transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PassengerDashboard;
