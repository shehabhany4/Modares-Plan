import api from "./api";

export default function Layout({ page, setPage, user, onLogout, children }) {
  const tabs = [
    ["students", "Students"],
    ["teachers", "Teachers"],
    ["subjects", "Subjects"],
    ["attendance", "Attendance"],
    ...(user.is_admin ? [["admin", "Accounts"]] : []),
  ];

  const logout = async () => {
    try { await api.post("/logout"); } catch { /* ignore */ }
    onLogout();
  };

  return (
    <>
      <div className="navbar no-print">
        <h1>🎓 YSA School Portal</h1>
        <div className="tabs">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              className={`tab ${page === key ? "active" : ""}`}
              onClick={() => setPage(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="user-box">
          <span>{user.name}{user.is_admin ? " (Admin)" : ""}</span>
          <button className="light sm" onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="container">{children}</div>
    </>
  );
}