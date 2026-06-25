import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="min-h-screen flex">
      {/* Left Panel — Blue */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-blue-600 rounded-full opacity-40" />
        <div className="absolute bottom-[-60px] right-[-60px] w-56 h-56 bg-blue-800 rounded-full opacity-40" />

        <div className="relative z-10 text-center text-white">
          <div className="text-7xl mb-6"></div>
          <h1 className="text-4xl font-black tracking-tight mb-3">Bus Station Scheduling</h1>
          <p className="text-blue-200 text-lg font-medium">System</p>
          <div className="mt-10 space-y-3 text-left">
            <div className="flex items-center gap-3 bg-blue-600 bg-opacity-50 rounded-xl px-5 py-3">
              <span className="text-2xl"></span>
              <span className="text-blue-100 text-sm font-medium">Free to register</span>
            </div>
            <div className="flex items-center gap-3 bg-blue-600 bg-opacity-50 rounded-xl px-5 py-3">
              <span className="text-2xl"></span>
              <span className="text-blue-100 text-sm font-medium">Secure & private</span>
            </div>
            <div className="flex items-center gap-3 bg-blue-600 bg-opacity-50 rounded-xl px-5 py-3">
              <span className="text-2xl"></span>
              <span className="text-blue-100 text-sm font-medium">Instant access</span>
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
            <h2 className="text-3xl font-black text-gray-900">Create account</h2>
            <p className="text-gray-500 mt-1 text-sm">Join Bus Station System today</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm p-3 rounded-xl mb-4">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="Abebe Kebede"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition text-gray-800 placeholder-gray-400"
              />
            </div>
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
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Confirm Password</label>
              <input
                name="confirm"
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                required
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition text-gray-800"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Register as</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition text-gray-800 bg-white"
              >
                <option value="passenger"> Passenger</option>
                <option value="driver"> Driver</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full p-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition text-base mt-1 shadow-lg shadow-blue-200"
            >
              Create Account →
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
