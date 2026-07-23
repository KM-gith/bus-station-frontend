import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://bus-station-backend-265a.onrender.com";

function Routes() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ origin: "", destination: "", distance: "", duration: "", price: "", status: "active" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchRoutes = async () => {
    try {
      const res = await axios.get(`${API}/routes`, authHeader);
      setRoutes(res.data);
    } catch { setError("Failed to fetch routes."); }
  };

  useEffect(() => { const load = async () => { await fetchRoutes(); }; load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/routes/${editId}`, form, authHeader);
        setEditId(null);
      } else {
        await axios.post(`${API}/routes`, form, authHeader);
      }
      setForm({ origin: "", destination: "", distance: "", duration: "", price: "", status: "active" });
      fetchRoutes();
    } catch { setError("Failed to save route."); }
  };

  const handleEdit = (route) => {
    setForm({ origin: route.origin, destination: route.destination, distance: route.distance, duration: route.duration, price: route.price, status: route.status });
    setEditId(route._id);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`${API}/routes/${id}`, authHeader); fetchRoutes(); }
    catch { setError("Failed to delete route."); }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6"> Routes</h2>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {/* FORM */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
          {editId ? "Edit Route" : "Add New Route"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Origin</label>
            <input name="origin" placeholder="Finfinnee" value={form.origin} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Destination</label>
            <input name="destination" placeholder="Adaamaa" value={form.destination} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Distance (km)</label>
            <input name="distance" type="number" placeholder="99" value={form.distance} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Duration (minutes)</label>
            <input name="duration" type="number" placeholder="90" value={form.duration} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Price (ETB)</label>
            <input name="price" type="number" placeholder="150" value={form.price} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
          <div className="flex items-end">
            <button type="submit"
              className={`w-full p-3 rounded-lg text-white font-semibold transition text-sm ${editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"}`}>
              {editId ? "Update Route" : "Add Route"}
            </button>
          </div>
        </form>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 sm:hidden">
        {routes.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-400">No routes yet.</div>
        )}
        {routes.map((route) => (
          <div key={route._id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="mb-3">
              <p className="font-bold text-gray-800">{route.origin} → {route.destination}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
              <div><p className="text-gray-400 text-xs">Distance</p><p className="font-medium">{route.distance} km</p></div>
              <div><p className="text-gray-400 text-xs">Duration</p><p className="font-medium">{route.duration} min</p></div>
              <div><p className="text-gray-400 text-xs">Price</p><p className="font-bold text-blue-700">ETB {route.price}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(route)}
                className="flex-1 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm rounded-lg transition font-medium">Edit</button>
              <button onClick={() => handleDelete(route._id)}
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
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Origin</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Destination</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Distance</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Duration</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Price</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 && (
              <tr><td colSpan="6" className="text-center p-6 text-gray-400">No routes yet.</td></tr>
            )}
            {routes.map((route) => (
              <tr key={route._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">{route.origin}</td>
                <td className="p-4 text-gray-600">{route.destination}</td>
                <td className="p-4 text-gray-600">{route.distance} km</td>
                <td className="p-4 text-gray-600">{route.duration} min</td>
                <td className="p-4 text-gray-600">ETB {route.price}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(route)} className="px-3 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-sm rounded-lg transition">Edit</button>
                  <button onClick={() => handleDelete(route._id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Routes;
