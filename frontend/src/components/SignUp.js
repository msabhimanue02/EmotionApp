import React from "react";

function SignUp({ form, onChange, onSubmit, goToSignIn }) {
  return (
    <div className="page-container">
      <div className="card">
        <h2>Sign Up</h2>
        <div className="form-group">
          <label>Username</label>
          <input name="username" value={form.username || ""} placeholder="Enter username" onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email || ""} placeholder="Enter email" onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password || ""} placeholder="Enter password" onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input name="confirm_password" type="password" value={form.confirm_password || ""} placeholder="Re-enter password" onChange={onChange} />
        </div>
        <button className="btn" onClick={onSubmit}>Register</button>
        <button className="link" onClick={goToSignIn}>Already have an account? Sign In</button>
      </div>
    </div>
  );
}

export default SignUp;
