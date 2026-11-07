import { useEffect, useState } from "react";
import api from "./api";

const empty = { name: "", email: "", grade: "" };

export default function Students({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    await api.delete(`/students/${id}`);
    load();
  };

  const logout = async () => {
    try { await api.post("/logout"); } catch { /* ignore */ }
    localStorage.removeItem("token");
    onLogout();
  };

  const filtered = students.filter((s) =>
    `${s.name} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="navbar">
        <h1>🎓 YSA School Portal</h1>
        <button className="light sm" onClick={logout}>Logout</button>
      </div>

      <div className="container">
        <div className="stat">
          <div className="card">
            <div className="num">{students.length}</div>
            <div className="label">Total students</div>
          </div>
          <div className="card">
            <div className="num">{new Set(students.map((s) => s.grade).filter(Boolean)).size}</div>
            <div className="label">Different grades</div>
          </div>
        </div>

        <div className="card">
          <h2>{editId ? "Edit student" : "Add new student"}</h2>
          <form onSubmit={submit} className="form-row">
            <input name="name" placeholder="Full name" value={form.name} onChange={change} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
            <input name="grade" type="number" min="1" max="12" placeholder="Grade" value={form.grade} onChange={change} />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">{editId ? "Update" : "Add"}</button>
              {editId && (
                <button type="button" className="ghost" onClick={() => { setEditId(null); setForm(empty); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
          {error && <div className="error">{error}</div>}
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <h2 style={{ margin: 0 }}>Students</h2>
            <input style={{ maxWidth: 240 }} placeholder="🔍 Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Grade</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan="4" className="empty">No students found</td></tr>
                )}
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.grade ? <span className="badge">Grade {s.grade}</span> : "-"}</td>
                    <td className="actions">
                      <button className="ghost sm" onClick={() => edit(s)}>Edit</button>
                      <button className="danger sm" onClick={() => remove(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}