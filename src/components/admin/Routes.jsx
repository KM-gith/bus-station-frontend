import { useState, useEffect } from "react";
import axios from "axios";

function Routes() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    distance: "",
    duration: "",
    price: "",
    status: "active",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchRoutes = async () => {
    try {
      const res = await axios.get("https://bus-station-backend-265a.onrender.com/routes", authHeader);
      setRoutes(res.data);
    } catch {
      setError("Failed to fetch routes.");
    }
  };

  useEffect(() => { fetchRoutes(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`https://bus-station-backend-265a.onrender.com/routes/${editId}`, form, authHeader);
        setEditId(null);
      } else {
        await axios.post("https://bus-station-backend-265a.onrender.com/routes", form, authHeader);
      }
      setForm({ origin: "", destination: "", distance: "", duration: "", price: "", status: "active" });
      fetchRoutes();
    } catch {
      setError("Failed to save route.");
    }
  };

  const handleEdit = (route) => {
    setForm({
      origin: route.origin,
      destination: route.destination,
      distance: route.distance,
      duration: route.duration,
      price: route.price,
      status: route.status,
    });
    setEditId(route._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://bus-station-backend-265a.onrender.com/routes/${id}`, authHeader);
      fetchRoutes();
    } catch {
      setError("Failed to delete route.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6"> Routes</h2>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {editId ? "Edit Route" : "Add New Route"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Origin</label>
            <input
              name="origin" placeholder="Finfinnee"
              value={form.origin} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Destination</label>
            <input
              name="destination" placeholder="Adaamaa"
              value={form.destination} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Distance (km)</label>
            <input
              name="distance" type="number" placeholder="99"
              value={form.distance} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Duration (minutes)</label>
            <input
              name="duration" type="number" placeholder="90"
              value={form.duration} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Price (ETB)</label>
            <input
              name="price" type="number" placeholder="150"
              value={form.price} onChange={handleChange} required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className={`w-full p-3 rounded-lg text-white font-semibold transition ${
                editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editId ? "Update Route" : "Add Route"}
            </button>
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
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
                  <button
                    onClick={() => handleEdit(route)}
                    className="px-3 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-sm rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(route._id)}
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

export default Routes;