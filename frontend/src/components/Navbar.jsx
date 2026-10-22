import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import API from '../services/api';
import { Sprout, LogOut, Bell, User, Menu, X, Home as HomeIcon, LayoutDashboard, PlusCircle, BarChart3, Building2, ShoppingBag, Receipt, SlidersHorizontal, LogIn, UserPlus, Target } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      if (!user) return;
      try {
        const res = await API.get(`/notifications?role=${user.role}&userId=${user.id || user._id}&userEmail=${encodeURIComponent(user.email || '')}`);
        if (res.data) setNotifications(res.data);
      } catch (e) {}
    };
    fetchNotifs();

    const interval = setInterval(fetchNotifs, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setShowNotifMenu(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  // Define role-specific navigation links using t() keys
  const getNavLinks = () => {
    if (!user) {
      return [
        { label: t('home'), path: '/', icon: HomeIcon },
        { label: t('our_aim'), path: '/aim', icon: Target },
        { label: t('farmer_signin'), path: '/login/farmer', icon: LogIn },
        { label: t('buyer_signin'), path: '/login/buyer', icon: LogIn },
        { label: t('farmer_register'), path: '/register/farmer', icon: UserPlus },
        { label: t('buyer_register'), path: '/register/buyer', icon: UserPlus },
      ];
    }

    if (user.role === 'buyer') {
      return [
        { label: t('home'), path: '/', icon: HomeIcon },
        { label: t('our_aim'), path: '/aim', icon: Target },
        { label: t('dashboard'), path: '/buyer/dashboard', icon: LayoutDashboard },
        { label: t('market_profile'), path: '/buyer-profile', icon: Building2 },
        { label: t('market_requirements'), path: '/buyer-requirements', icon: SlidersHorizontal },
        { label: t('matching_lots'), path: '/buyer-offers', icon: ShoppingBag },
        { label: t('transactions'), path: '/transactions', icon: Receipt },
        { label: t('profile'), path: '/profile', icon: User },
      ];
    }

    if (user.role === 'admin') {
      return [
        { label: t('home'), path: '/', icon: HomeIcon },
        { label: t('our_aim'), path: '/aim', icon: Target },
        { label: t('dashboard'), path: '/admin-users', icon: LayoutDashboard },
        { label: t('transactions'), path: '/transactions', icon: Receipt },
        { label: t('profile'), path: '/profile', icon: User },
      ];
    }

    // Default to Farmer role
    return [
      { label: t('home'), path: '/', icon: HomeIcon },
      { label: t('our_aim'), path: '/aim', icon: Target },
      { label: t('dashboard'), path: '/farmer/dashboard', icon: LayoutDashboard },
      { label: t('create_crop_lot'), path: '/create-lot', icon: PlusCircle },
      { label: t('market_analysis'), path: '/market-analysis', icon: BarChart3 },
      { label: t('buyer_markets'), path: '/buyer-markets', icon: Building2 },
      { label: t('transactions'), path: '/transactions', icon: Receipt },
      { label: t('profile'), path: '/profile', icon: User },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#FFFFFF', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Left: Brand & Hamburger Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Hamburger Menu Toggle Button */}
          <button
            id="hamburger-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'none',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '0.4rem 0.6rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-dark)'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Sprout size={26} style={{ color: 'var(--primary-green)' }} />
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-dark)', letterSpacing: '-0.5px' }}>
              {t('app_title')}
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <ul className="navbar-links" style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {navLinks.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                style={{
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isActive(item.path) ? 700 : 500,
                  color: isActive(item.path) ? 'var(--primary-green)' : 'var(--text-dark)',
                  padding: '0.4rem 0.5rem',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Language Selector, Notifications & Auth State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          
          {/* Header Language Selector Dropdown */}
          <LanguageSelector />

          {user && (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                style={{ position: 'relative', padding: '0.4rem 0.6rem' }}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#EF4444',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div
                  className="card"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '320px',
                    zIndex: 1000,
                    padding: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    marginBottom: 0
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>Notifications ({notifications.length})</strong>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} style={{ fontSize: '0.75rem', color: 'var(--primary-green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                    {notifications.map((n, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          background: n.read ? '#F8FAFC' : '#DCFCE7',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.82rem'
                        }}
                      >
                        <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '0.15rem' }}>{n.title}</strong>
                        <span style={{ color: 'var(--text-body)' }}>{n.message}</span>
                      </div>
                    ))}

                    {notifications.length === 0 && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                        {t('no_data')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/profile" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} /> {t('profile')}
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <LogOut size={14} /> {t('logout')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Link to="/login/farmer" className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}>
                🌾 {t('farmer_signin')}
              </Link>
              <Link to="/login/buyer" className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}>
                🏢 {t('buyer_signin')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Hamburger Menu Drawer Overlay & Content */}
      {isMobileMenuOpen && (
        <>
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(2px)',
              zIndex: 998
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              width: '280px',
              bottom: 0,
              background: '#FFFFFF',
              borderRight: '1px solid var(--border-color)',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
              zIndex: 999,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto'
            }}
          >
            <div>
              <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {user ? `${user.role?.toUpperCase()} NAVIGATION` : 'NAVIGATION MENU'}
                </div>
                {user && (
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                    {user.name} ({user.mobileNumber || user.mobile || 'No Mobile'})
                  </div>
                )}
              </div>

              {/* Mobile Drawer Language Selector */}
              <LanguageSelector isMobile={true} />

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {navLinks.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <li key={idx}>
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          textDecoration: 'none',
                          fontSize: '0.92rem',
                          fontWeight: isActive(item.path) ? 700 : 500,
                          background: isActive(item.path) ? '#DCFCE7' : 'transparent',
                          color: isActive(item.path) ? '#166534' : 'var(--text-dark)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <IconComp size={18} style={{ color: isActive(item.path) ? '#166534' : 'var(--text-muted)' }} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {user && (
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem',
                    background: '#FEE2E2',
                    color: '#991B1B',
                    border: '1px solid #FCA5A5',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <LogOut size={16} /> {t('logout')}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
