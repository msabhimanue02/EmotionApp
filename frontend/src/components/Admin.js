import React from "react";

function Admin({ form, onChange, onSubmit, goBack }) {
  return (
    <div className="page-container">
      <div className="card">
        <div className="logout-row">
          <button className="link" onClick={goBack}>Back to user login</button>
        </div>
        <h2>Admin Login</h2>
        <div className="form-group">
          <label>Username</label>
          <input name="username" value={form.username || ""} placeholder="Admin username" onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password || ""} placeholder="Admin password" onChange={onChange} />
        </div>
        <button className="btn" onClick={onSubmit}>Login as Admin</button>
      </div>
    </div>
  );
}

export default Admin;
