import { useState } from "react";
import Login from "./Login";
import Layout from "./Layout";
import Students from "./Students";
import Teachers from "./Teachers";
import Subjects from "./Subjects";
import Attendance from "./Attendance";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [page, setPage] = useState("students");

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <Layout page={page} setPage={setPage} onLogout={() => setLoggedIn(false)}>
      {page === "students" && <Students />}
      {page === "teachers" && <Teachers />}
      {page === "subjects" && <Subjects />}
      {page === "attendance" && <Attendance />}
    </Layout>
  );
}