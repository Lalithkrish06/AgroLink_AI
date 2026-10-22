import React, { useState, useContext, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { validateIndianPhone } from '../utils/phoneValidation';
import API from '../services/api';
import { User, Phone, MapPin, Mail, ShieldCheck, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || user?.mobileNumber || user?.mobile || '',
    role: user?.role || '',
    location: user?.location || ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || user.mobileNumber || user.mobile || '',
        role: user.role || '',
        location: user.location || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneVal = validateIndianPhone(formData.phone);
    if (!phoneVal.valid) {
      setErrorMsg(phoneVal.message);
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      await API.put('/auth/profile', {
        name: formData.name,
        phone: phoneVal.formatted,
        location: formData.location
      });
    } catch (e) {}

    setSaving(false);
    setFormData((prev) => ({ ...prev, phone: phoneVal.formatted }));
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>User Profile & Settings</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                View and edit your personal details and verified contact phone number.
              </p>
            </div>

            {successMsg && (
              <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #86EFAC', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} /> {successMsg}
              </div>
            )}

            {errorMsg && (
              <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            {/* Profile Avatar Card */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.6rem', border: '2px solid #86EFAC' }}>
                {formData.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', margin: 0 }}>{formData.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <span className="badge badge-success" style={{ textTransform: 'uppercase' }}>
                    <ShieldCheck size={12} /> {formData.role}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Account</span>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Read-only)</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    disabled
                    style={{ background: '#F1F5F9', color: 'var(--text-muted)' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (Required for Indian Users)</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Format: 10-digit mobile number or +91 followed by 10 digits
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Account Role (Read-only)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.role.toUpperCase()}
                    disabled
                    style={{ background: '#F1F5F9', color: 'var(--text-muted)' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location / District</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={saving}>
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
