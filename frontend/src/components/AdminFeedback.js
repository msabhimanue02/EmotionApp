import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminFeedback({ api, goBack, onLogout }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(api + "/feedback")
      .then((res) => setItems(res.data.feedback || []))
      .catch((e) => setError(e?.response?.data?.error || "Failed to load feedback"));
  }, [api]);

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: 1200, width: '100%' }}>
        <div className="logout-row" style={{ gap: 12 }}>
          <button className="link" onClick={onLogout}>Logout Admin</button>
        </div>
        <h2>Admin Dashboard</h2>
        {/* Summary header */}
        {items.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
            margin: '10px 0 16px'
          }}>
            {(() => {
              const total = items.length;
              const avg = (items.reduce((s, x) => s + (Number(x.rating) || 0), 0) / total).toFixed(2);
              const counts = items.reduce((acc, x) => {
                const key = (x.sentiment || 'Unknown');
                acc[key] = (acc[key] || 0) + 1;
                return acc;
              }, {});
              return (
                <>
                  <div className="card" style={{ padding: 12 }}>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Total Reviews</div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>{total}</div>
                  </div>
                  <div className="card" style={{ padding: 12 }}>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Average Rating</div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>{avg}</div>
                  </div>
                  {Object.entries(counts).map(([label, count]) => (
                    <div key={label} className="card" style={{ padding: 12 }}>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
                      <div style={{ fontSize: 20, fontWeight: 600 }}>{count}</div>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        )}
        {error && <div className="error" style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}
        <div className="table-wrap">
          <h3>All Feedback</h3>
          {items.length === 0 ? (
            <p>No feedback yet.</p>
          ) : (
            <table className="table" style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ width: '6%' }}>ID</th>
                  <th style={{ width: '8%' }}>User ID</th>
                  <th style={{ width: '68%' }}>Comment</th>
                  <th style={{ width: '8%' }}>Rating</th>
                  <th style={{ width: '10%' }}>Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {items.map((f) => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.user_id}</td>
                    <td>
                      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5 }}>
                        {f.comment}
                      </div>
                    </td>
                    <td>{f.rating}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{f.sentiment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminFeedback;
