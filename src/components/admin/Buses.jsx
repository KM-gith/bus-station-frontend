import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://bus-station-backend-265a.onrender.com";

function Buses() {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({
    plateNumber: "", busNumber: "", totalSeats: "", busType: "standard", status: "active",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchBuses = async () => {
    try {
      const res = await axios.get(`${API}/buses`, authHeader);
      setBuses(res.data);
    } catch { setError("Failed to fetch buses."); }
  };

  useEffect(() => { const load = async () => { await fetchBuses(); }; load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/buses/${editId}`, form, authHeader);
        setEditId(null);
      } else {
        await axios.post(`${API}/buses`, form, authHeader);
      }
      setForm({ plateNumber: "", busNumber: "", totalSeats: "", busType: "standard", status: "active" });
      fetchBuses();
    } catch { setError("Failed to save bus."); }
  };

  const handleEdit = (bus) => {
    setForm({ plateNumber: bus.plateNumber, busNumber: bus.busNumber, totalSeats: bus.totalSeats, busType: bus.busType, status: bus.status });
    setEditId(bus._id);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`${API}/buses/${id}`, authHeader); fetchBuses(); }
    catch { setError("Failed to delete bus."); }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Buses</h2>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {/* FORM */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
          {editId ? "Edit Bus" : "Add New Bus"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Plate Number</label>
            <input name="plateNumber" placeholder="AA-12345" value={form.plateNumber} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Bus Number</label>
            <input name="busNumber" placeholder="BUS-001" value={form.busNumber} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Total Seats</label>
            <input name="totalSeats" type="number" placeholder="45" value={form.totalSeats} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Bus Type</label>
            <select name="busType" value={form.busType} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm">
              <option value="standard">TATA BUS</option>
              <option value="vip">ODAA BUS</option>
              <option value="minibus">Minibus</option>
              <option value="airbus">AIR BUS</option>
              <option value="selam">SELAM BUS</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm">
              <option value="active">1st Level</option>
              <option value="maintenance">2nd Level</option>
              <option value="inactive">3rd Level</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit"
              className={`w-full p-3 rounded-lg text-white font-semibold transition text-sm ${editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"}`}>
              {editId ? "Update Bus" : "Add Bus"}
            </button>
          </div>
        </form>
      </div>

      {/* LIST — Cards on mobile, table on desktop */}
      {/* Mobile cards */}
      <div className="grid gap-3 sm:hidden">
        {buses.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-400">No buses yet.</div>
        )}
        {buses.map((bus) => (
          <div key={bus._id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-gray-800">{bus.busNumber}</p>
                <p className="text-sm text-gray-500">{bus.plateNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                bus.status === "active" ? "bg-green-100 text-green-700" :
                bus.status === "maintenance" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"}`}>
                {bus.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div><span className="text-gray-400">Seats: </span><span className="font-medium">{bus.totalSeats}</span></div>
              <div><span className="text-gray-400">Type: </span><span className="font-medium capitalize">{bus.busType}</span></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(bus)}
                className="flex-1 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm rounded-lg transition font-medium">Edit</button>
              <button onClick={() => handleDelete(bus._id)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Plate</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Bus No.</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Seats</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Type</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.length === 0 && (
              <tr><td colSpan="6" className="text-center p-6 text-gray-400">No buses yet.</td></tr>
            )}
            {buses.map((bus) => (
              <tr key={bus._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">{bus.plateNumber}</td>
                <td className="p-4 text-gray-600">{bus.busNumber}</td>
                <td className="p-4 text-gray-600">{bus.totalSeats}</td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">{bus.busType}</span></td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    bus.status === "active" ? "bg-green-100 text-green-700" :
                    bus.status === "maintenance" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"}`}>{bus.status}</span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(bus)} className="px-3 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-sm rounded-lg transition">Edit</button>
                  <button onClick={() => handleDelete(bus._id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Buses;
