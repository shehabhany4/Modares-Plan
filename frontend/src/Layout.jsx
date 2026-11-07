import api from "./api";

const tabs = [
  ["students", "Students"],
  ["teachers", "Teachers"],
  ["subjects", "Subjects"],
  ["attendance", "Attendance"],
  ["attendance", "Attendance"],
];

export default function Layout({ page, setPage, onLogout, children }) {
  const logout = async () => {
    try { await api.post("/logout"); } catch { /* ignore */ }
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <>
      <div className="navbar">
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
        <button className="light sm" onClick={logout}>Logout</button>
      </div>
      <div className="container">{children}</div>
    </>
  );
}