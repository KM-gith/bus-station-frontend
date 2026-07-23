import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://bus-station-backend-265a.onrender.com";

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ bus: "", route: "", departureTime: "", arrivalTime: "", availableSeats: "", status: "scheduled" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAll = async () => {
    try {
      const [s, b, r] = await Promise.all([
        axios.get(`${API}/schedules`, authHeader),
        axios.get(`${API}/buses`, authHeader),
        axios.get(`${API}/routes`, authHeader),
      ]);
      setSchedules(s.data); setBuses(b.data); setRoutes(r.data);
    } catch { setError("Failed to fetch data."); }
  };

  useEffect(() => { const load = async () => { await fetchAll(); }; load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await axios.put(`${API}/schedules/${editId}`, form, authHeader); setEditId(null); }
      else { await axios.post(`${API}/schedules`, form, authHeader); }
      setForm({ bus: "", route: "", departureTime: "", arrivalTime: "", availableSeats: "", status: "scheduled" });
      fetchAll();
    } catch { setError("Failed to save schedule."); }
  };

  const handleEdit = (s) => {
    setForm({ bus: s.bus._id, route: s.route._id, departureTime: s.departureTime?.slice(0, 16), arrivalTime: s.arrivalTime?.slice(0, 16), availableSeats: s.availableSeats, status: s.status });
    setEditId(s._id);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`${API}/schedules/${id}`, authHeader); fetchAll(); }
    catch { setError("Failed to delete schedule."); }
  };

  const statusColor = (status) => {
    if (status === "scheduled") return "bg-blue-100 text-blue-700";
    if (status === "departed") return "bg-yellow-100 text-yellow-700";
    if (status === "arrived") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6"> Schedules</h2>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {/* FORM */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
          {editId ? "Edit Schedule" : "Add New Schedule"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Bus</label>
            <select name="bus" value={form.bus} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm">
              <option value="">Select Bus</option>
              {buses.map((b) => <option key={b._id} value={b._id}>{b.busNumber} — {b.plateNumber}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Route</label>
            <select name="route" value={form.route} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm">
              <option value="">Select Route</option>
              {routes.map((r) => <option key={r._id} value={r._id}>{r.origin} → {r.destination}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Departure Time</label>
            <input name="departureTime" type="datetime-local" value={form.departureTime} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Arrival Time</label>
            <input name="arrivalTime" type="datetime-local" value={form.arrivalTime} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Available Seats</label>
            <input name="availableSeats" type="number" placeholder="45" value={form.availableSeats} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm">
              <option value="scheduled">Scheduled</option>
              <option value="departed">Departed</option>
              <option value="arrived">Arrived</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <button type="submit"
              className={`w-full p-3 rounded-lg text-white font-semibold transition text-sm ${editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"}`}>
              {editId ? "Update Schedule" : "Add Schedule"}
            </button>
          </div>
        </form>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 sm:hidden">
        {schedules.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-400">No schedules yet.</div>
        )}
        {schedules.map((s) => (
          <div key={s._id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-gray-800">{s.route?.origin} → {s.route?.destination}</p>
                <p className="text-sm text-gray-500">Bus: {s.bus?.busNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor(s.status)}`}>{s.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div><p className="text-gray-400 text-xs">Departure</p><p className="font-medium text-xs">{new Date(s.departureTime).toLocaleString()}</p></div>
              <div><p className="text-gray-400 text-xs">Arrival</p><p className="font-medium text-xs">{new Date(s.arrivalTime).toLocaleString()}</p></div>
              <div><p className="text-gray-400 text-xs">Seats</p><p className="font-medium">{s.availableSeats}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(s)} className="flex-1 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm rounded-lg transition font-medium">Edit</button>
              <button onClick={() => handleDelete(s._id)} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Route</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Bus</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Departure</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Arrival</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Seats</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 && <tr><td colSpan="7" className="text-center p-6 text-gray-400">No schedules yet.</td></tr>}
            {schedules.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">{s.route?.origin} → {s.route?.destination}</td>
                <td className="p-4 text-gray-600">{s.bus?.busNumber}</td>
                <td className="p-4 text-gray-600">{new Date(s.departureTime).toLocaleString()}</td>
                <td className="p-4 text-gray-600">{new Date(s.arrivalTime).toLocaleString()}</td>
                <td className="p-4 text-gray-600">{s.availableSeats}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor(s.status)}`}>{s.status}</span></td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(s)} className="px-3 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-sm rounded-lg transition">Edit</button>
                  <button onClick={() => handleDelete(s._id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Schedules;
