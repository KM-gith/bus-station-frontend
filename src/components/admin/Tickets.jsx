import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://bus-station-backend-265a.onrender.com";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API}/tickets`, authHeader);
      setTickets(res.data);
    } catch { setError("Failed to fetch tickets."); }
  };

  useEffect(() => { const load = async () => { await fetchTickets(); }; load(); }, []);

  const activeTickets = tickets.filter((t) => t.status !== "cancelled");

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6"> Tickets</h2>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {/* Mobile cards */}
      <div className="grid gap-3 sm:hidden">
        {activeTickets.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-400">No tickets yet.</div>
        )}
        {activeTickets.map((t) => (
          <div key={t._id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{t.ticketCode}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                t.status === "booked" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                {t.status}
              </span>
            </div>
            <div className="mb-2">
              <p className="font-bold text-gray-800">{t.schedule?.route?.origin} → {t.schedule?.route?.destination}</p>
              <p className="text-sm text-gray-500">{t.passenger?.name} · {t.passenger?.email}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div><p className="text-gray-400 text-xs">Bus</p><p className="font-medium">{t.schedule?.bus?.busNumber}</p></div>
              <div><p className="text-gray-400 text-xs">Seat</p><p className="font-medium">{t.seatNumber}</p></div>
              <div><p className="text-gray-400 text-xs">Price</p><p className="font-bold text-blue-700">ETB {t.price}</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Ticket Code</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Passenger</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Route</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Bus</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Seat</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Price</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {activeTickets.length === 0 && <tr><td colSpan="7" className="text-center p-6 text-gray-400">No tickets yet.</td></tr>}
            {activeTickets.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-sm text-gray-700">{t.ticketCode}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-800">{t.passenger?.name}</div>
                  <div className="text-xs text-gray-500">{t.passenger?.email}</div>
                </td>
                <td className="p-4 text-gray-600">{t.schedule?.route?.origin} → {t.schedule?.route?.destination}</td>
                <td className="p-4 text-gray-600">{t.schedule?.bus?.busNumber}</td>
                <td className="p-4 text-gray-600">{t.seatNumber}</td>
                <td className="p-4 text-gray-600">ETB {t.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    t.status === "booked" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tickets;
