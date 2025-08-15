import React from "react";

function SignIn({ form, onChange, onSubmit, goToSignUp, goToAdmin }) {
  return (
    <div className="page-container">
      <div className="card">
        <h2>Sign In</h2>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email || ""} placeholder="Enter email" onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password || ""} placeholder="Enter password" onChange={onChange} />
        </div>
        <button className="btn" onClick={onSubmit}>Login</button>
        <div className="links-row">
          <button className="link" onClick={goToSignUp}>Create account</button>
          <button className="link" onClick={goToAdmin}>Admin Login</button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
