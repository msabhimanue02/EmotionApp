import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Feedback from "./components/Feedback";
import Admin from "./components/Admin";
import AdminFeedback from "./components/AdminFeedback";

function App() {
  const [page, setPage] = useState("signin"); // signin, signup, feedback, admin, adminDashboard
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);
  const [modal, setModal] = useState({ open: false, title: "", message: "" });

  const api = "http://127.0.0.1:5000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signup = () => {
    axios
      .post(api + "/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
      })
      .then((res) => {
        alert(res.data.message);
        setForm({});
        setPage("signin");
      })
      .catch((err) => alert(err?.response?.data?.error || "Signup failed"));
  };

  const signin = () => {
    axios
      .post(api + "/signin", { email: form.email, password: form.password })
      .then((res) => {
        alert(res.data.message);
        setUserId(res.data.user_id);
        setForm({});
        setPage("feedback");
      })
      .catch((err) => alert(err?.response?.data?.error || "Signin failed"));
  };

  const sendFeedback = () => {
    axios
      .post(api + "/feedback", { user_id: userId, comment: form.comment, rating: form.rating })
      .then((res) => {
        setModal({
          open: true,
          title: "Feedback submitted",
          message: `Predicted sentiment: ${res.data.sentiment}`,
        });
        setForm({});
      })
      .catch((err) => console.log(err));
  };

  const adminLogin = () => {
    axios
      .post(api + "/admin", { username: form.username, password: form.password })
      .then((res) => {
        // Admin login success: go to admin dashboard page
        setForm({});
        setPage("adminDashboard");
      })
      .catch((err) => alert(err?.response?.data?.error || "Admin login failed"));
  };

  return (
    <div>
      {modal.open && (
        <div className="modal-backdrop" onClick={() => setModal({ ...modal, open: false })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modal.title}</h3>
            <p>{modal.message}</p>
            <button className="btn" onClick={() => setModal({ ...modal, open: false })}>OK</button>
          </div>
        </div>
      )}
      {page === "signin" && (
        <SignIn
          form={form}
          onChange={handleChange}
          onSubmit={signin}
          goToSignUp={() => setPage("signup")}
          goToAdmin={() => setPage("admin")}
        />
      )}

      {page === "signup" && (
        <SignUp
          form={form}
          onChange={handleChange}
          onSubmit={signup}
          goToSignIn={() => setPage("signin")}
        />
      )}

      {page === "feedback" && (
        <Feedback
          form={form}
          onChange={handleChange}
          onSubmit={sendFeedback}
          onLogout={() => {
            setUserId(null);
            setForm({});
            setPage("signin");
          }}
        />
      )}

      {page === "admin" && (
        <Admin
          form={form}
          onChange={handleChange}
          onSubmit={adminLogin}
          goBack={() => setPage("signin")}
        />
      )}

      {page === "adminDashboard" && (
        <AdminFeedback
          goBack={() => setPage("signin")}
          onLogout={() => {
            setForm({});
            setFeedbackList([]);
            setPage("admin");
          }}
          api={api}
        />
      )}
    </div>
  );
}

export default App;
