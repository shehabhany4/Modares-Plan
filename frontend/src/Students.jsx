import { useEffect, useState } from "react";
import api from "./api";

const empty = { name: "", email: "", grade: "" };

export default function Students({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await api.get("/students");
    setStudents(data);
  };

  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, grade: form.grade === "" ? null : Number(form.grade) };
      if (editId) await api.put(`/students/${editId}`, payload);
      else await api.post("/students", payload);
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const edit = (s) => {
    setEditId(s.id);
    setForm({ name: s.name, email: s.email, grade: s.grade ?? "" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this student?")) return;
    await api.delete(`/students/${id}`);
    load();
  };

  const logout = async () => {
    try { await api.post("/logout"); } catch {}
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Students</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <form onSubmit={submit} style={{ display: "flex", gap: 8, margin: "16px 0" }}>
        <input name="name" placeholder="Name" value={form.name} onChange={change} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
        <input name="grade" type="number" placeholder="Grade" value={form.grade} onChange={change} style={{ width: 80 }} />
        <button type="submit">{editId ? "Update" : "Add"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Grade</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.grade}</td>
              <td>
                <button onClick={() => edit(s)}>Edit</button>{" "}
                <button onClick={() => remove(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}