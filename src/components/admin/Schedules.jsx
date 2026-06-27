import { useState, useEffect } from "react";
import axios from "axios";

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({
    bus: "",
    route: "",
    departureTime: "",
    arrivalTime: "",
    availableSeats: "",
    status: "scheduled",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAll = async () => {
    try {
      const [s, b, r] = await Promise.all([
        axios.get("https://bus-station-backend-265a.onrender.com/schedules", authHeader),
        axios.get("https://bus-station-backend-265a.onrender.com/buses", authHeader),
        axios.get("https://bus-station-backend-265a.onrender.com/routes", authHeader),
      ]);
      setSchedules(s.data);
      setBuses(b.data);
      setRoutes(r.data);
    } catch {
      setError("Failed to fetch data.");
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`https://bus-station-backend-265a.onrender.com/schedules/${editId}`, form, authHeader);
        setEditId(null);
      } else {
        await axios.post("https://bus-station-backend-265a.onrender.com/schedules", form, authHeader);
      }
      setForm({ bus: "", route: "", departureTime: "", arrivalTime: "", availableSeats: "", status: "scheduled" });
      fetchAll();
    } catch {
      setError("Failed to save schedule.");
    }
  };

  const handleEdit = (schedule) => {
    setForm({
      bus: schedule.bus._id,
      route: schedule.route._id,
      departureTime: schedule.departureTime?.slice(0, 16),
      arrivalTime: schedule.arrivalTime?.slice(0, 16),
      availableSeats: schedule.availableSeats,
      status: schedule.status,
    });
    setEditId(schedule._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://bus-station-backend-265a.onrender.com/schedules/${id}`, authHeader);
      fetchAll();
    } catch {
      setError("Failed to delete schedule.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6"> Schedules</h2>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {editId ? "Edit Schedule" : "Add New Schedule"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Bus</label>
            <select
              name="bus" value={form.bus} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">Select Bus</option>
              {buses.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.busNumber} — {b.plateNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Route</label>
            <select
              name="route" value={form.route} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">Select Route</option>
              {routes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.origin} → {r.destination}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Departure Time</label>
            <input
              name="departureTime" type="datetime-local"
              value={form.departureTime} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Arrival Time</label>
            <input
              name="arrivalTime" type="datetime-local"
              value={form.arrivalTime} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Available Seats</label>
            <input
              name="availableSeats" type="number" placeholder="45"
              value={form.availableSeats} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Status</label>
            <select
              name="status" value={form.status} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="scheduled">Scheduled</option>
              <option value="departed">Departed</option>
              <option value="arrived">Arrived</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className={`w-full p-3 rounded-lg text-white font-semibold transition ${
                editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editId ? "Update Schedule" : "Add Schedule"}
            </button>
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
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
            {schedules.length === 0 && (
              <tr><td colSpan="7" className="text-center p-6 text-gray-400">No schedules yet.</td></tr>
            )}
            {schedules.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">
                  {s.route?.origin} → {s.route?.destination}
                </td>
                <td className="p-4 text-gray-600">{s.bus?.busNumber}</td>
                <td className="p-4 text-gray-600">
                  {new Date(s.departureTime).toLocaleString()}
                </td>
                <td className="p-4 text-gray-600">
                  {new Date(s.arrivalTime).toLocaleString()}
                </td>
                <td className="p-4 text-gray-600">{s.availableSeats}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    s.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                    s.status === "departed" ? "bg-yellow-100 text-yellow-700" :
                    s.status === "arrived" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="px-3 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-sm rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition"
                  >
                    Delete
                  </button>
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