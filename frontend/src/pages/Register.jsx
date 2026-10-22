import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { validateIndianPhone } from '../utils/phoneValidation';
import { Sprout, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = ({ initialRole }) => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine starting role from prop, path, or query string
  const getStartingRole = () => {
    if (initialRole && ['farmer', 'buyer'].includes(initialRole)) return initialRole;
    const path = location.pathname.toLowerCase();
    if (path.includes('/buyer')) return 'buyer';
    const roleParam = searchParams.get('role');
    if (roleParam && ['farmer', 'buyer'].includes(roleParam.toLowerCase())) {
      return roleParam.toLowerCase();
    }
    return 'farmer';
  };

  const [role, setRole] = useState(getStartingRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: 'Tamil Nadu',
    district: 'Erode',
    village: 'Perundurai',
    businessName: '',
    marketName: '',
    marketLocation: 'Erode Central Market'
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(getStartingRole());
  }, [initialRole, location.pathname, searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setError('Confirm Password does not match Password.');
      return;
    }

    // Validate phone number format
    const phoneVal = validateIndianPhone(formData.phone);
    if (!phoneVal.valid) {
      setError(phoneVal.message);
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    let locationStr = `${formData.village || formData.district}, ${formData.district}, ${formData.state}`;
    if (role === 'buyer') {
      locationStr = `${formData.marketLocation || formData.district}, ${formData.state}`;
    }

    const res = await register({
      name: formData.name,
      email: formData.email,
      phone: phoneVal.formatted,
      password: formData.password,
      role,
      location: locationStr,
      district: formData.district,
      state: formData.state,
      village: formData.village,
      businessName: formData.businessName,
      marketName: formData.marketName
    });

    setLoading(false);

    if (res.success) {
      const msg = `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully. Please log in.`;
      setSuccessMsg(msg);

      setTimeout(() => {
        navigate(`/login/${role}`);
      }, 1500);
    } else {
      setError(res.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main style={{ flex: 1, padding: '3rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '540px', width: '100%' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Sprout size={36} style={{ color: 'var(--primary-green)', marginBottom: '0.4rem' }} />
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-dark)' }}>Create Agro Link Market Account</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Connecting Farmers Directly with the Right Markets
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '1.5rem', background: '#F1F5F9', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}>
              <button
                type="button"
                className={`btn btn-sm ${role === 'farmer' ? 'btn-primary' : ''}`}
                style={{ fontSize: '0.9rem', border: 'none', padding: '0.6rem 0.5rem', fontWeight: 700 }}
                onClick={() => handleRoleChange('farmer')}
              >
                🌾 Register as Farmer
              </button>
              <button
                type="button"
                className={`btn btn-sm ${role === 'buyer' ? 'btn-primary' : ''}`}
                style={{ fontSize: '0.9rem', border: 'none', padding: '0.6rem 0.5rem', fontWeight: 700 }}
                onClick={() => handleRoleChange('buyer')}
              >
                🏢 Register as Buyer Market
              </button>
            </div>

            {error && (
              <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {successMsg && (
              <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Kamalesh"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Format: 10-digit mobile number or +91.
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* FARMER SPECIFIC FIELDS */}
              {role === 'farmer' && (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">District</label>
                      <input type="text" name="district" className="form-control" value={formData.district} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Village / City</label>
                    <input type="text" name="village" className="form-control" value={formData.village} onChange={handleChange} required />
                  </div>
                </>
              )}

              {/* BUYER SPECIFIC FIELDS */}
              {role === 'buyer' && (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Business Name</label>
                      <input type="text" name="businessName" className="form-control" placeholder="e.g. AgroLink Trading Co" value={formData.businessName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Market Name</label>
                      <input type="text" name="marketName" className="form-control" placeholder="e.g. Erode APMC Yard" value={formData.marketName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">District / Market Location</label>
                      <input type="text" name="district" className="form-control" value={formData.district} onChange={handleChange} required />
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
                <UserPlus size={18} /> {loading ? 'Creating Account...' : `Register as ${role === 'farmer' ? 'Farmer' : 'Buyer Market'}`}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Already have an account? <Link to={`/login/${role}`} style={{ color: 'var(--primary-green)', fontWeight: 600 }}>Sign in as {role}</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;

