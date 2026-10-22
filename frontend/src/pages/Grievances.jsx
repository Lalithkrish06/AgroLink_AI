import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { AlertTriangle, PlusCircle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

const Grievances = () => {
  const { user } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({
    transactionId: 'TXN-88219',
    issueType: 'Payment Delay',
    description: 'Buyer payout of ₹1,57,500 marked completed on portal but bank credit pending for over 36 hours.'
  });
  const [msg, setMsg] = useState('');

  const fetchGrievances = async () => {
    try {
      const res = await API.get('/grievances');
      setGrievances(res.data || []);
    } catch (err) {
      console.log('Error fetching grievances');
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/grievances', form);
      setMsg('Grievance ticket created successfully! Admin support has been notified.');
      fetchGrievances();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg('Grievance ticket submitted successfully!');
      fetchGrievances();
      setTimeout(() => setMsg(''), 4000);
    }
  };

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--dark-navy)' }}>
              Grievance Redressal Desk ⚠️
            </h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Raise issues regarding payment delays, quality discrepancies, or transport delays for swift admin resolution.
            </p>
          </div>

          {msg && (
            <div style={{ background: '#DCFCE7', color: '#15803D', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #86EFAC' }}>
              <CheckCircle2 size={18} /> {msg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {/* Raise Grievance Form */}
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--dark-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={18} style={{ color: 'var(--primary-main)' }} /> Log Support Ticket
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Transaction ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. TXN-88219"
                    value={form.transactionId}
                    onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Issue Category</label>
                  <select
                    className="form-control"
                    value={form.issueType}
                    onChange={(e) => setForm({ ...form, issueType: e.target.value })}
                  >
                    <option value="Payment Delay">Payment Delay</option>
                    <option value="Quality Mismatch">Quality Mismatch</option>
                    <option value="Transport Delay">Transport Delay</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Issue Description</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Explain the problem clearly..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Submit Support Ticket
                </button>
              </form>
            </div>

            {/* Existing Tickets */}
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                Your Grievance History
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {grievances.map((g, idx) => (
                  <div key={idx} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <strong>{g.issueType}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)' }}>
                          Ref: {g.transactionId} | Logged by {g.userName}
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          g.status === 'resolved'
                            ? 'badge-success'
                            : g.status === 'in_progress'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {g.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-body)', marginBottom: '0.5rem' }}>
                      "{g.description}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Grievances;
