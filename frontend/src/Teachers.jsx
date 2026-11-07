import { useEffect, useState } from "react";
import api from "./api";

const empty = { name: "", email: "", phone: "" };

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await api.get("/teachers");
    setTeachers(data);
  };

  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, phone: form.phone === "" ? null : form.phone };
      if (editId) await api.put(`/teachers/${editId}`, payload);
      else await api.post("/teachers", payload);
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const edit = (t) => {
    setEditId(t.id);
    setForm({ name: t.name, email: t.email, phone: t.phone ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    await api.delete(`/teachers/${id}`);
    load();
  };

  return (
    <>
      <div className="card">
        <h2>{editId ? "Edit teacher" : "Add new teacher"}</h2>
        <form onSubmit={submit} className="form-row" style={{ gridTemplateColumns: "2fr 2fr 1.5fr auto" }}>
          <input name="name" placeholder="Full name" value={form.name} onChange={change} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={change} />
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
        <h2>Teachers ({teachers.length})</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Subjects</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {teachers.length === 0 && <tr><td colSpan="5" className="empty">No teachers yet</td></tr>}
              {teachers.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.phone || "-"}</td>
                  <td>
                    {t.subjects?.length
                      ? t.subjects.map((s) => <span key={s.id} className="badge" style={{ marginRight: 4 }}>{s.name}</span>)
                      : "-"}
                  </td>
                  <td className="actions">
                    <button className="ghost sm" onClick={() => edit(t)}>Edit</button>
                    <button className="danger sm" onClick={() => remove(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}