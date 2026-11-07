import { useEffect, useState } from "react";
import api from "./api";

const empty = { name: "", code: "", teacher_id: "" };

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const [su, te] = await Promise.all([api.get("/subjects"), api.get("/teachers")]);
    setSubjects(su.data);
    setTeachers(te.data);
  };

  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, teacher_id: form.teacher_id === "" ? null : Number(form.teacher_id) };
      if (editId) await api.put(`/subjects/${editId}`, payload);
      else await api.post("/subjects", payload);
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const edit = (s) => {
    setEditId(s.id);
    setForm({ name: s.name, code: s.code, teacher_id: s.teacher_id ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    await api.delete(`/subjects/${id}`);
    load();
  };

  return (
    <>
      <div className="card">
        <h2>{editId ? "Edit subject" : "Add new subject"}</h2>
        <form onSubmit={submit} className="form-row" style={{ gridTemplateColumns: "2fr 1fr 2fr auto" }}>
          <input name="name" placeholder="Subject name" value={form.name} onChange={change} required />
          <input name="code" placeholder="Code (e.g. MATH101)" value={form.code} onChange={change} required />
          <select name="teacher_id" value={form.teacher_id} onChange={change}>
            <option value="">No teacher</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <div className="btn-group">
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
        <h2>Subjects ({subjects.length})</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Code</th><th>Teacher</th><th>Students</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {subjects.length === 0 && <tr><td colSpan="5" className="empty">No subjects yet</td></tr>}
              {subjects.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td><span className="badge">{s.code}</span></td>
                  <td>{s.teacher?.name || "-"}</td>
                  <td>{s.students?.length ?? 0}</td>
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
    </>
  );
}