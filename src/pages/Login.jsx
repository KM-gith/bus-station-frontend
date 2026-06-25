import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


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
      const res = await axios.post("http://localhost:5000/auth/login", form);
      login({ name: res.data.name, role: res.data.role }, res.data.token);
      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "driver") navigate("/driver");
      else navigate("/passenger");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Blue */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-blue-600 rounded-full opacity-40" />
        <div className="absolute bottom-[-60px] right-[-60px] w-56 h-56 bg-blue-800 rounded-full opacity-40" />

        <div className="relative z-10 text-center text-white">
          <div className="text-7xl mb-6"></div>
          
          <h1 className="text-4xl font-black tracking-tight mb-3">Bus Station Scheduling</h1>
          <p className="text-blue-200 text-lg font-medium">System</p>
          <div className="mt-10 space-y-3 text-left">
            <div className="flex items-center gap-3 bg-blue-600 bg-opacity-50 rounded-xl px-5 py-3">
              <span className="text-2xl"></span>
              <span className="text-blue-100 text-sm font-medium">Book tickets instantly</span>
            </div>
            <div className="flex items-center gap-3 bg-blue-600 bg-opacity-50 rounded-xl px-5 py-3">
              <span className="text-2xl"></span>
              <span className="text-blue-100 text-sm font-medium">View live schedules</span>
            </div>
            <div className="flex items-center gap-3 bg-blue-600 bg-opacity-50 rounded-xl px-5 py-3">
              <span className="text-2xl"></span>
              <span className="text-blue-100 text-sm font-medium">Track your routes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — White */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl"></span>
            <h1 className="text-2xl font-black text-blue-700 mt-2">Bus Station Scheduling System</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1 text-sm">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-5">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition text-gray-800"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition text-base mt-1 shadow-lg shadow-blue-200"
            >
              Sign In →
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-700 font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
