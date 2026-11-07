import { useEffect, useState } from "react";
import api from "./api";

const empty = { name: "", email: "", grade: "", subject_id: "" };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const [st, su] = await Promise.all([api.get("/students"), api.get("/subjects")]);
    setStudents(st.data);
    setSubjects(su.data);
  };

  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        grade: form.grade === "" ? null : Number(form.grade),
        subject_id: form.subject_id === "" ? null : Number(form.subject_id),
      };
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
    setForm({ name: s.name, email: s.email, grade: s.grade ?? "", subject_id: s.subject_id ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    await api.delete(`/students/${id}`);
    load();
  };

  const filtered = students.filter((s) =>
    `${s.name} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const exportCsv = () => {
    const rows = [
      ["Name", "Email", "Grade", "Subject"],
      ...filtered.map((s) => [s.name, s.email, s.grade ?? "", s.subject?.name ?? ""]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="stat">
        <div className="card">
          <div className="num">{students.length}</div>
          <div className="label">Total students</div>
        </div>
        <div className="card">
          <div className="num">{subjects.length}</div>
          <div className="label">Subjects available</div>
        </div>
      </div>

      <div className="card no-print">
        <h2>{editId ? "Edit student" : "Add new student"}</h2>
        <form onSubmit={submit} className="form-row" style={{ gridTemplateColumns: "2fr 2fr 1fr 1.5fr auto" }}>
          <input name="name" placeholder="Full name" value={form.name} onChange={change} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
          <input name="grade" type="number" min="1" max="12" placeholder="Grade" value={form.grade} onChange={change} />
          <select name="subject_id" value={form.subject_id} onChange={change}>
            <option value="">No subject</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>Students</h2>
          <div className="no-print" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input style={{ width: 200 }} placeholder="🔍 Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="ghost sm" onClick={exportCsv}>⬇ CSV</button>
            <button className="ghost sm" onClick={() => window.print()}>🖨 Print</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Grade</th><th>Subject</th><th className="no-print">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan="5" className="empty">No students found</td></tr>}
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.grade ? <span className="badge">Grade {s.grade}</span> : "-"}</td>
                  <td>{s.subject?.name || "-"}</td>
                  <td className="actions no-print">
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