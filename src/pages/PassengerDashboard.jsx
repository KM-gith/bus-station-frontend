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

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [seatNumber, setSeatNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isBooking, setIsBooking] = useState(false);

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

  // Step 1 — Seat filuu fi modal banu
  const handleOpenPayment = (schedule) => {
    const seatVal = document.getElementById(`seat-${schedule._id}`).value;
    if (!seatVal) {
      setError("Please enter a seat number.");
      return;
    }
    setError("");
    setSelectedSchedule(schedule);
    setSeatNumber(seatVal);
    setPaymentStep(1);
    setPaymentMethod("");
    setAccountNumber("");
    setShowPaymentModal(true);
  };

  // Step Final — Book godhu
  const handleConfirmBooking = async () => {
    if (!accountNumber) {
      setError("Please enter your account number.");
      return;
    }
    setIsBooking(true);
    setError("");
    try {
      await axios.post(
        "https://bus-station-backend-265a.onrender.com/tickets",
        { scheduleId: selectedSchedule._id, seatNumber: parseInt(seatNumber) },
        authHeader
      );
      setSuccess(`Ticket booked successfully via ${paymentMethod}! 🎉`);
      setShowPaymentModal(false);
      fetchSchedules();
      fetchMyTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book ticket.");
      setShowPaymentModal(false);
    }
    setIsBooking(false);
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
    { id: "search", label: "🔍 Available Buses" },
    { id: "tickets", label: "🎫 My Tickets" },
  ];

  return (
    <div className="min-h-screen bg-blue-50">

      {/* NAVBAR */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-xl">🚌</div>
          <div>
            <h1 className="text-lg font-black tracking-tight">Bus Station System</h1>
            <p className="text-blue-200 text-xs font-medium">Passenger Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-blue-300">Signed in as</p>
            <p className="text-sm font-semibold">{user?.name}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 rounded-xl text-sm font-semibold transition">
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
                activeTab === tab.id ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "text-gray-500 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">⚠️ {error}</div>}
        {success && <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-xl mb-4 text-sm">✅ {success}</div>}

        {/* AVAILABLE BUSES */}
        {activeTab === "search" && (
          <div className="grid gap-4">
            <h2 className="text-2xl font-black text-gray-900">🔍 Available Buses</h2>
            {schedules.filter(s => s.status === "scheduled" && s.availableSeats > 0).length === 0 && (
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
                      <h3 className="text-lg font-black text-gray-900">{s.route?.origin} → {s.route?.destination}</h3>
                      <p className="text-gray-400 text-sm mb-4">Bus: {s.bus?.busNumber} ({s.bus?.busType})</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-blue-50 rounded-xl p-3">
                          <p className="text-xs text-blue-400 font-medium mb-0.5">Departure</p>
                          <p className="text-sm font-semibold text-gray-800">{new Date(s.departureTime).toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-3">
                          <p className="text-xs text-blue-400 font-medium mb-0.5">Arrival</p>
                          <p className="text-sm font-semibold text-gray-800">{new Date(s.arrivalTime).toLocaleString()}</p>
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
                        onClick={() => handleOpenPayment(s)}
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
            <h2 className="text-2xl font-black text-gray-900 mb-6">🎫 My Tickets</h2>
            {myTickets.filter(t => t.status !== "cancelled").length === 0 && (
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
                          <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{t.ticketCode}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            t.status === "booked" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                          }`}>{t.status}</span>
                        </div>
                        <h3 className="text-lg font-black text-gray-900">{t.schedule?.route?.origin} → {t.schedule?.route?.destination}</h3>
                        <p className="text-gray-400 text-sm mt-1">Bus: {t.schedule?.bus?.busNumber} | Seat: <span className="font-bold text-gray-700">{t.seatNumber}</span></p>
                        <p className="text-blue-700 font-black text-base mt-2">ETB {t.price}</p>
                      </div>
                      {t.status === "booked" && (
                        <button onClick={() => handleCancelTicket(t._id)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold rounded-xl transition">
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

      {/* ✅ PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">💳 Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>

            {/* Route info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-blue-700">{selectedSchedule?.route?.origin} → {selectedSchedule?.route?.destination}</p>
              <p className="text-xs text-gray-500 mt-1">Seat: <span className="font-bold text-gray-700">{seatNumber}</span> | Price: <span className="font-bold text-blue-700">ETB {selectedSchedule?.route?.price}</span></p>
            </div>

            {/* Step 1 — Payment method filuu */}
            {paymentStep === 1 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-4">Kaffaltii karaa maaliitin raawwatta?</p>
                <div className="grid gap-3">
                  <button
                    onClick={() => { setPaymentMethod("TeleBirr"); setPaymentStep(2); }}
                    className="w-full p-4 border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 rounded-xl flex items-center gap-3 transition"
                  >
                    <span className="text-2xl">📱</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-800">TeleBirr</p>
                      <p className="text-xs text-gray-500">Telebirr account irraa kafali</p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setPaymentMethod("Bank Account"); setPaymentStep(2); }}
                    className="w-full p-4 border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 rounded-xl flex items-center gap-3 transition"
                  >
                    <span className="text-2xl">🏦</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-800">Bank Account</p>
                      <p className="text-xs text-gray-500">Bank account irraa kafali</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Account number galchuu */}
            {paymentStep === 2 && (
              <div>
                <button onClick={() => setPaymentStep(1)} className="text-blue-600 text-sm font-semibold mb-4 flex items-center gap-1">← Back</button>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {paymentMethod === "TeleBirr" ? "📱 TeleBirr" : "🏦 Bank Account"} — Account Number galchi
                </p>
                <input
                  type="text"
                  placeholder={paymentMethod === "TeleBirr" ? "09XXXXXXXX" : "1000XXXXXXXXX"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition text-gray-800 font-mono text-lg tracking-wider mb-4"
                />
                <button
                  onClick={() => { if (accountNumber) setPaymentStep(3); }}
                  disabled={!accountNumber}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold rounded-xl transition"
                >
                  Confirm →
                </button>
              </div>
            )}

            {/* Step 3 — Confirm */}
            {paymentStep === 3 && (
              <div>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Route</span>
                    <span className="font-bold text-gray-800">{selectedSchedule?.route?.origin} → {selectedSchedule?.route?.destination}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Seat</span>
                    <span className="font-bold text-gray-800">{seatNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment</span>
                    <span className="font-bold text-gray-800">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Account</span>
                    <span className="font-bold text-gray-800 font-mono">{accountNumber}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold text-gray-700">Total</span>
                    <span className="font-black text-blue-700 text-lg">ETB {selectedSchedule?.route?.price}</span>
                  </div>
                </div>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isBooking}
                  className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-black rounded-xl transition text-base"
                >
                  {isBooking ? "Booking..." : "✅ Confirm & Book Ticket"}
                </button>
                <button onClick={() => setPaymentStep(2)} className="w-full py-2 text-gray-500 text-sm mt-2">← Back</button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default PassengerDashboard;
