import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { CreditCard, CheckCircle2, Clock, Truck, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';

const PaymentTracking = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get('/transactions');
        setTransactions(res.data || []);
      } catch (err) {
        console.log('Error fetching transactions');
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--dark-navy)' }}>
              Transparent Payment Tracking 💳
            </h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Real-time audit trail of deal payouts, bank transfer dispatch status, and transaction milestones.
            </p>
          </div>

          {/* Payment Status Summary Cards */}
          <div className="metrics-grid">
            <div className="card metric-card">
              <div className="metric-icon-box" style={{ background: '#DCFCE7', color: '#15803D' }}>
                <CheckCircle2 size={26} />
              </div>
              <div>
                <div className="metric-value">₹1,57,500</div>
                <div className="metric-label">Completed Direct Payouts</div>
              </div>
            </div>

            <div className="card metric-card">
              <div className="metric-icon-box" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
                <Clock size={26} />
              </div>
              <div>
                <div className="metric-value">₹3,66,000</div>
                <div className="metric-label">Processing Escrow Funds</div>
              </div>
            </div>

            <div className="card metric-card">
              <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
                <CreditCard size={26} />
              </div>
              <div>
                <div className="metric-value">24 Hours</div>
                <div className="metric-label">Average Payout Speed</div>
              </div>
            </div>
          </div>

          {/* Payment Milestone Visual Timeline */}
          <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--dark-navy)' }}>
              Standard 4-Step Escrow Payout Timeline
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'center' }}>
              <div style={{ padding: '1rem', background: '#DCFCE7', borderRadius: 'var(--radius-md)', border: '1px solid #86EFAC' }}>
                <div style={{ fontWeight: 800, color: '#15803D', fontSize: '1.1rem' }}>Step 1</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534', marginTop: '0.2rem' }}>Digital Agreement</div>
                <div style={{ fontSize: '0.75rem', color: '#15803D' }}>Offer accepted on portal</div>
              </div>

              <div style={{ padding: '1rem', background: '#DCFCE7', borderRadius: 'var(--radius-md)', border: '1px solid #86EFAC' }}>
                <div style={{ fontWeight: 800, color: '#15803D', fontSize: '1.1rem' }}>Step 2</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534', marginTop: '0.2rem' }}>Quality Inspection</div>
                <div style={{ fontSize: '0.75rem', color: '#15803D' }}>Verified at mandi/farm</div>
              </div>

              <div style={{ padding: '1rem', background: '#DBEAFE', borderRadius: 'var(--radius-md)', border: '1px solid #93C5FD' }}>
                <div style={{ fontWeight: 800, color: '#1E40AF', fontSize: '1.1rem' }}>Step 3</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E3A8A', marginTop: '0.2rem' }}>Logistics Transit</div>
                <div style={{ fontSize: '0.75rem', color: '#1E40AF' }}>Truck dispatch initiated</div>
              </div>

              <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: 'var(--radius-md)', border: '1px solid #FDE047' }}>
                <div style={{ fontWeight: 800, color: '#B45309', fontSize: '1.1rem' }}>Step 4</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#78350F', marginTop: '0.2rem' }}>Direct Bank Credit</div>
                <div style={{ fontSize: '0.75rem', color: '#B45309' }}>Funds sent to UPI/NEFT</div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
              Transaction Payment Ledger
            </h3>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date & Ref ID</th>
                    <th>Crop</th>
                    <th>Buyer Partner</th>
                    <th>Agreed Rate & Qty</th>
                    <th>Total Payout Amount</th>
                    <th>Payment Status</th>
                    <th>Transport Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>TXN-{10082 + idx}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)' }}>{tx.transactionDate || '2026-08-30'}</div>
                      </td>
                      <td>
                        <span className="badge badge-info">{tx.cropName}</span>
                      </td>
                      <td>
                        <strong>{tx.buyerName}</strong>
                      </td>
                      <td>
                        ₹{tx.agreedPrice?.toLocaleString()} / Qtl × {tx.quantity} Qtl
                      </td>
                      <td style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                        ₹{tx.totalAmount?.toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            tx.paymentStatus === 'completed'
                              ? 'badge-success'
                              : tx.paymentStatus === 'processing'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {tx.paymentStatus?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info">{tx.transportStatus || 'In Transit'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentTracking;
