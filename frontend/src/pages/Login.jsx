import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSelector from '../components/LanguageSelector';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, LogIn, AlertCircle, ArrowLeft, ShieldCheck, User, Building2 } from 'lucide-react';

const Login = ({ initialRole }) => {
  const { login } = useContext(AuthContext);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine starting role from prop, path, or query string
  const getStartingRole = () => {
    if (initialRole && ['farmer', 'buyer', 'admin'].includes(initialRole.toLowerCase())) {
      return initialRole.toLowerCase();
    }
    const path = location.pathname.toLowerCase();
    if (path.includes('/farmer')) return 'farmer';
    if (path.includes('/buyer')) return 'buyer';
    if (path.includes('/admin')) return 'admin';
    const roleParam = searchParams.get('role');
    if (roleParam && ['farmer', 'buyer', 'admin'].includes(roleParam.toLowerCase())) {
      return roleParam.toLowerCase();
    }
    return null; // On first /login page, no role selected yet
  };

  const [activeRoleTab, setActiveRoleTab] = useState(getStartingRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveRoleTab(getStartingRole());
  }, [initialRole, location.pathname, searchParams]);

  const handleSelectRole = (role) => {
    setActiveRoleTab(role);
    setError('');
    navigate(`/login/${role}`);
  };

  const handleBackToSelection = () => {
    setActiveRoleTab(null);
    setError('');
    setEmail('');
    setPassword('');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const currentRole = activeRoleTab || 'farmer';

    if (!email.trim()) {
      setLoading(false);
      setError(t('please_enter_email'));
      return;
    }

    if (!password.trim()) {
      setLoading(false);
      setError(t('please_enter_password'));
      return;
    }

    const res = await login(email, password, currentRole);
    setLoading(false);

    if (res.success) {
      const userRole = (res.user?.role || '').toLowerCase();
      if (userRole === 'buyer') {
        navigate('/buyer/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/farmer/dashboard');
      }
    } else {
      setError(res.message || t('invalid_credentials'));
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '560px', width: '100%' }}>

          <div className="card" style={{ padding: '2rem', position: 'relative' }}>
            
            {/* TOP BAR WITH BRAND & LANGUAGE SELECTOR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                <Sprout size={28} style={{ color: 'var(--primary-green)' }} />
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-dark)' }}>
                  {t('app_title')}
                </span>
              </Link>

              {/* Language Button at Top */}
              <LanguageSelector />
            </div>

            {/* HEADER WELCOME BANNER */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
                {t('welcome_to_app')}
              </h2>
              <p style={{ color: 'var(--primary-green)', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                {t('select_login_type')}
              </p>
            </div>

            {/* CASE 1: FIRST LOGIN PAGE - ROLE SELECTION BUTTONS */}
            {!activeRoleTab && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  
                  {/* 🛡️ Admin Login Button Card */}
                  <button
                    type="button"
                    onClick={() => handleSelectRole('admin')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.1rem 1.25rem',
                      borderRadius: '12px',
                      border: '2px solid #1E293B',
                      background: '#1E293B',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: '0 4px 12px rgba(30,41,59,0.15)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ShieldCheck size={24} style={{ color: '#60A5FA' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.2px' }}>
                        🛡️ {t('admin_login')}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                        Platform Monitoring, Users & Grievance Desk
                      </div>
                    </div>
                  </button>

                  {/* 🌾 Farmer Login Button Card */}
                  <button
                    type="button"
                    onClick={() => handleSelectRole('farmer')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.1rem 1.25rem',
                      borderRadius: '12px',
                      border: '2px solid #166534',
                      background: '#F0FDF4',
                      color: '#166534',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: '0 4px 12px rgba(22,101,52,0.1)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sprout size={24} style={{ color: '#166534' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.2px' }}>
                        🌾 {t('farmer_login')}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#15803D', marginTop: '0.15rem' }}>
                        Price Discovery, Crop Lots & Buyer Requests
                      </div>
                    </div>
                  </button>

                  {/* 🏢 Buyer Login Button Card */}
                  <button
                    type="button"
                    onClick={() => handleSelectRole('buyer')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.1rem 1.25rem',
                      borderRadius: '12px',
                      border: '2px solid #1E40AF',
                      background: '#EFF6FF',
                      color: '#1E40AF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: '0 4px 12px rgba(30,64,175,0.1)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Building2 size={24} style={{ color: '#1E40AF' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.2px' }}>
                        🏢 {t('buyer_login')}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#1D4ED8', marginTop: '0.15rem' }}>
                        Wholesale Markets, Procurement & Payment Bills
                      </div>
                    </div>
                  </button>

                </div>

                {/* Quick 1-Click Demo Login Shortcuts */}
                <div style={{ background: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    {t('quick_demo_login')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ background: '#FFFFFF', borderColor: '#86EFAC', color: '#15803D', fontWeight: 700, fontSize: '0.78rem' }}
                      onClick={async () => {
                        handleSelectRole('farmer');
                        setEmail('farmer@agrolink.com');
                        setPassword('farmer123');
                        const res = await login('farmer@agrolink.com', 'farmer123', 'farmer');
                        if (res.success) navigate('/farmer/dashboard');
                      }}
                    >
                      🌾 {t('farmer')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ background: '#FFFFFF', borderColor: '#93C5FD', color: '#1D4ED8', fontWeight: 700, fontSize: '0.78rem' }}
                      onClick={async () => {
                        handleSelectRole('buyer');
                        setEmail('lalikrish2006@gmail.com');
                        setPassword('123456');
                        const res = await login('lalikrish2006@gmail.com', '123456', 'buyer');
                        if (res.success) navigate('/buyer/dashboard');
                      }}
                    >
                      🏢 {t('buyer')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ background: '#FFFFFF', borderColor: '#475569', color: '#1E293B', fontWeight: 700, fontSize: '0.78rem' }}
                      onClick={async () => {
                        handleSelectRole('admin');
                        setEmail('admin@agrolink.com');
                        setPassword('admin123');
                        const res = await login('admin@agrolink.com', 'admin123', 'admin');
                        if (res.success) navigate('/admin/dashboard');
                      }}
                    >
                      🛡️ {t('admin')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: ROLE SELECTED - SHOW ROLE LOGIN FORM */}
            {activeRoleTab && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={handleBackToSelection}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-green)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: 0 }}
                  >
                    <ArrowLeft size={16} /> {t('back_to_login_selection')}
                  </button>

                  <span className="badge badge-success" style={{ fontWeight: 800, padding: '0.35rem 0.65rem' }}>
                    {activeRoleTab === 'admin' ? `🛡️ ${t('admin_login')}` : activeRoleTab === 'buyer' ? `🏢 ${t('buyer_login')}` : `🌾 ${t('farmer_login')}`}
                  </span>
                </div>

                {error && (
                  <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', lineHeight: '1.4', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, border: '1px solid #FCA5A5' }}>
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">
                      {t(activeRoleTab)} {t('email_address')}
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder={t('enter_email')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('password')}</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder={t('enter_password')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '0.75rem', background: activeRoleTab === 'admin' ? '#1E293B' : undefined, borderColor: activeRoleTab === 'admin' ? '#1E293B' : undefined }}
                    disabled={loading}
                  >
                    <LogIn size={18} /> {loading ? t('signing_in') : `${t('sign_in_btn')} (${t(activeRoleTab)})`}
                  </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {t('dont_have_account')}{' '}
                  <Link to={`/register/${activeRoleTab}`} style={{ color: 'var(--primary-green)', fontWeight: 700 }}>
                    {t('register_as')} {t(activeRoleTab)}
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
