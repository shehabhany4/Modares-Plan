import { useEffect, useState } from "react";
import api from "./api";

const today = () => new Date().toISOString().slice(0, 10);

const options = [
  ["present", "Present", "#16a34a"],
  ["late", "Late", "#d97706"],
  ["absent", "Absent", "#dc2626"],
];

export default function Attendance() {
  const [date, setDate] = useState(today());
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const loadDay = async (d) => {
    const { data } = await api.get("/attendance", { params: { date: d } });
    setRows(data);
  };
  const loadSummary = async () => {
    const { data } = await api.get("/attendance/summary");
    setSummary(data);
  };

  useEffect(() => { loadDay(date); }, [date]);
  useEffect(() => { loadSummary(); }, []);

  const setStatus = (id, status) =>
    setRows(rows.map((r) => (r.student_id === id ? { ...r, status } : r)));

  const markAll = (status) => setRows(rows.map((r) => ({ ...r, status })));

  const save = async () => {
    setMsg("");
    setError("");
    const records = rows
      .filter((r) => r.status)
      .map((r) => ({ student_id: r.student_id, status: r.status }));
    if (records.length === 0) {
      setError("Mark at least one student first");
      return;
    }
    try {
      await api.post("/attendance", { date, records });
      setMsg(`Saved ${records.length} records for ${date}`);
      loadSummary();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const present = rows.filter((r) => r.status === "present").length;
  const late = rows.filter((r) => r.status === "late").length;
  const absent = rows.filter((r) => r.status === "absent").length;

  return (
    <>
      <div className="stat">
        <div className="card"><div className="num" style={{ color: "#16a34a" }}>{present}</div><div className="label">Present</div></div>
        <div className="card"><div className="num" style={{ color: "#d97706" }}>{late}</div><div className="label">Late</div></div>
        <div className="card"><div className="num" style={{ color: "#dc2626" }}>{absent}</div><div className="label">Absent</div></div>
      </div>

      <div className="card">
        <div className="toolbar">
          <h2>Daily attendance</h2>
          <div className="group">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: 170 }} />
            <button className="ghost sm" onClick={() => markAll("present")}>All present</button>
            <button className="sm" onClick={save}>Save</button>
          </div>
        </div>
        {msg && <div className="success">{msg}</div>}
        {error && <div className="error">{error}</div>}

        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Grade</th><th>Status</th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan="3" className="empty">Add students first</td></tr>}
              {rows.map((r) => (
                <tr key={r.student_id}>
                  <td>{r.name}</td>
                  <td>{r.grade ? <span className="badge">Grade {r.grade}</span> : "-"}</td>
                  <td>
                    <div className="btn-group">
                      {options.map(([key, label, color]) => (
                        <button
                          key={key}
                          className="sm"
                          onClick={() => setStatus(r.student_id, key)}
                          style={{
                            background: r.status === key ? color : "#e2e8f0",
                            color: r.status === key ? "#fff" : "#475569",
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Attendance summary</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Student</th><th>Days recorded</th><th>Present/Late</th><th>Absent</th><th>Rate</th></tr>
            </thead>
            <tbody>
              {summary.length === 0 && <tr><td colSpan="5" className="empty">No data yet</td></tr>}
              {summary.map((s) => (
                <tr key={s.student_id}>
                  <td>{s.name}</td>
                  <td>{s.total}</td>
                  <td>{s.present}</td>
                  <td>{s.absent}</td>
                  <td>
                    {s.rate === null ? "-" : (
                      <span
                        className="badge"
                        style={{
                          background: s.rate >= 85 ? "#dcfce7" : s.rate >= 70 ? "#fef3c7" : "#fee2e2",
                          color: s.rate >= 85 ? "#166534" : s.rate >= 70 ? "#92400e" : "#991b1b",
                        }}
                      >
                        {s.rate}%
                      </span>
                    )}
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