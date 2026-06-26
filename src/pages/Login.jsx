import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import bgImage from "../assets/bus-station.png";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("${import.meta.env.VITE_API_URL}/auth/login", form);
      login({ name: res.data.name, role: res.data.role }, res.data.token);
      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "driver") navigate("/driver");
      else navigate("/passenger");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white">Bus Station Scheduling System</h2>
          <p className="text-blue-200 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-80 text-white text-sm p-3 rounded-xl mb-5">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-white mb-1.5 block">
              Email Address
            </label>
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
            <label className="text-sm font-semibold text-white mb-1.5 block">
              Password
            </label>
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
          <button
            type="submit"
            className="w-full p-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-base mt-1 shadow-lg"
          >
            Sign In →
          </button>
        </form>

        <p className="text-center text-sm text-blue-200 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-white font-bold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
