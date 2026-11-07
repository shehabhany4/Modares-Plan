import { useState } from "react";
import api from "./api";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post(isRegister ? "/register" : "/login", form);
      localStorage.setItem("token", data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>🎓 YSA School</h2>
        <p className="sub">{isRegister ? "Create your account" : "Sign in to manage students"}</p>
        <form onSubmit={submit} className="form-stack">
          {isRegister && <input name="name" placeholder="Full name" value={form.name} onChange={change} required />}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
          {isRegister && (
            <input name="password_confirmation" type="password" placeholder="Confirm password"
              value={form.password_confirmation} onChange={change} required />
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create account" : "Login"}
          </button>
        </form>
        {error && <div className="error">{error}</div>}
        <div className="link" onClick={() => { setIsRegister(!isRegister); setError(""); }}>
          {isRegister ? "Already have an account? Login" : "No account? Register"}
        </div>
      </div>
    </div>
  );
}