import { useState } from "react";
import api from "./api";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post(isRegister ? "/register" : "/login", form);
      localStorage.setItem("token", data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>{isRegister ? "Create Account" : "Login"}</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        {isRegister && <input name="name" placeholder="Name" value={form.name} onChange={change} />}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} />
        {isRegister && (
          <input name="password_confirmation" type="password" placeholder="Confirm password"
            value={form.password_confirmation} onChange={change} />
        )}
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ cursor: "pointer", color: "#0d6efd" }} onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Have an account? Login" : "No account? Register"}
      </p>
    </div>
  );
}