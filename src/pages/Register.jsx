import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/bus-station.png";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "passenger",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setSuccess("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Glass Form Card */}
      <div
        className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-6">
          
          <h2 className="text-3xl font-black text-white">Create Account</h2>
          <p className="text-blue-200 text-sm mt-1">Join Bus Station Scheduling System</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-80 text-white text-sm p-3 rounded-xl mb-4">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 bg-opacity-80 text-white text-sm p-3 rounded-xl mb-4">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-white mb-1.5 block">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Abebe Kebede"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3.5 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-white mb-1.5 block">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3.5 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-white mb-1.5 block">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3.5 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-white mb-1.5 block">Confirm Password</label>
            <input
              name="confirm"
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={handleChange}
              required
              className="w-full p-3.5 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-white mb-1.5 block">Register as</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <option value="passenger" style={{ color: "#111827" }}>Passenger</option>
              <option value="driver" style={{ color: "#111827" }}> Driver</option>
              <option value="admin" style={{ color: "#111827" }}>Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-base mt-1 shadow-lg"
          >
            Create Account →
          </button>
        </form>

        <p className="text-center text-sm text-blue-200 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
