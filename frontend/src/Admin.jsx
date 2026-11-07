import { useEffect, useState } from "react";
import api from "./api";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load accounts");
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.email} and ALL of their data?`)) return;
    try {
      await api.delete(`/admin/users/${u.id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete account");
    }
  };

  return (
    <>
      <div className="stat">
        <div className="card">
          <div className="num">{users.length}</div>
          <div className="label">Registered accounts</div>
        </div>
        <div className="card">
          <div className="num">{users.reduce((n, u) => n + u.students_count, 0)}</div>
          <div className="label">Students across all accounts</div>
        </div>
      </div>

      <div className="card">
        <h2>Accounts (admin)</h2>
        {error && <div className="error">{error}</div>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Students</th><th>Teachers</th><th>Subjects</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name} {u.is_admin && <span className="badge">Admin</span>}</td>
                  <td>{u.email}</td>
                  <td>{u.students_count}</td>
                  <td>{u.teachers_count}</td>
                  <td>{u.subjects_count}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    {!u.is_admin && <button className="danger sm" onClick={() => remove(u)}>Delete</button>}
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