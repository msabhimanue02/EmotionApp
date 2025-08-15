import React from "react";

function Feedback({ form, onChange, onSubmit, onLogout }) {
  return (
    <div className="page-container">
      <div className="card">
        <div className="logout-row">
          <button className="link" onClick={onLogout}>Logout</button>
        </div>
        <h2>Feedback</h2>
        <div className="form-group">
          <label>Your Comment</label>
          <textarea name="comment" value={form.comment || ""} placeholder="Write your thoughts here..." onChange={onChange} rows={4} />
        </div>
        <div className="form-group">
          <label>Rating (1-5)</label>
          <input name="rating" type="number" min="1" max="5" value={form.rating || ""} placeholder="1 to 5" onChange={onChange} />
        </div>
        <button className="btn" onClick={onSubmit}>Submit Feedback</button>
      </div>
    </div>
  );
}

export default Feedback;
