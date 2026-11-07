import { useEffect, useState } from "react";
import api from "./api";
import Login from "./Login";
import Layout from "./Layout";
import Students from "./Students";
import Teachers from "./Teachers";
import Subjects from "./Subjects";
import Attendance from "./Attendance";
import Admin from "./Admin";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("students");

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoggedIn(false);
  };

  useEffect(() => {
    if (!loggedIn) return;
    api.get("/me").then(({ data }) => setUser(data)).catch(() => {});
  }, [loggedIn]);

  if (!loggedIn) {
    return <Login onLogin={() => { setPage("students"); setLoggedIn(true); }} />;
  }
  if (!user) return <div className="container">Loading...</div>;

  return (
    <Layout page={page} setPage={setPage} user={user} onLogout={logout}>
      {page === "students" && <Students />}
      {page === "teachers" && <Teachers />}
      {page === "subjects" && <Subjects />}
      {page === "attendance" && <Attendance />}
      {page === "admin" && user.is_admin && <Admin />}
    </Layout>
  );
}