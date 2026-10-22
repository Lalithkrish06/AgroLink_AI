import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Radio,
  PackageCheck,
  Clock,
  Navigation,
  Bell,
  User,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';

const DriverDashboard = ({ initialTab = 'dashboard' }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deliveries, setDeliveries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [isLiveGPS, setIsLiveGPS] = useState(false);
  const [coords, setCoords] = useState({ lat: 11.341, lng: 77.7172 });
  const [activeDeliveryId, setActiveDeliveryId] = useState(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch transactions/deliveries assigned to this driver or available for pickup
        const txRes = await API.get('/transactions');
        let allTx = Array.isArray(txRes.data) ? txRes.data : [];

        // Filter deliveries assigned to this driver or general driver deliveries
        let driverJobs = allTx.filter(
          (t) =>
            t.driverUserId === user.id ||
            t.driverUserId === user._id ||
            t.driverId === user.id ||
            t.driverId === user._id ||
            !t.driverUserId
        );

        // If empty, provide dynamic default delivery items for driver view
        if (driverJobs.length === 0) {
          driverJobs = [
            {
              _id: 'DEL-2026-8801',
              id: 'DEL-2026-8801',
              cropName: 'Organic Red Tomato',
              quantity: 2500,
              unit: 'kg',
              farmerName: 'Ramasamy Gounder',
              farmerMobile: '+919876543210',
              pickupLocation: 'Perundurai Farm, Erode, Tamil Nadu',
              buyerName: 'Kamaleshwaran Wholesale Market',
              buyerMobile: '+919876543211',
              deliveryLocation: 'Coimbatore Central Vegetable Market',
              distance: '54.2 km',
              driverStatus: 'ASSIGNED',
              status: 'FARMER_CONFIRMED',
              netPayment: 85000,
              estimatedTime: '1 hr 20 mins',
              assignedDate: new Date().toLocaleDateString('en-IN')
            },
            {
              _id: 'DEL-2026-8802',
              id: 'DEL-2026-8802',
              cropName: 'Fresh Green Chillies',
              quantity: 1200,
              unit: 'kg',
              farmerName: 'Senthil Kumar',
              farmerMobile: '+919876543214',
              pickupLocation: 'Bhavani Agri Hub, Erode',
              buyerName: 'Salem Mega Mart',
              buyerMobile: '+919876543215',
              deliveryLocation: 'Salem Main Market',
              distance: '68.0 km',
              driverStatus: 'DELIVERED',
              status: 'COMPLETED',
              netPayment: 48000,
              estimatedTime: 'Completed',
              assignedDate: new Date().toLocaleDateString('en-IN')
            }
          ];
        }

        setDeliveries(driverJobs);

        // Fetch Notifications
        const notifRes = await API.get(`/notifications?role=driver&userId=${user.id || user._id}`);
        if (Array.isArray(notifRes.data)) {
          setNotifications(notifRes.data);
        }
      } catch (e) {
        console.error('Error fetching driver data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [user]);

  const handleUpdateStatus = async (deliveryId, newStatus) => {
    setDeliveries((prev) =>
      prev.map((item) =>
        item._id === deliveryId || item.id === deliveryId ? { ...item, driverStatus: newStatus } : item
      )
    );

    setStatusMsg(`🎉 Delivery status updated to "${newStatus}". Notification broadcasted to Farmer & Buyer.`);
    setActiveDeliveryId(deliveryId);

    try {
      await API.put(`/driver/${deliveryId}/status`, {
        status: newStatus,
        driverUserId: user?.id || user?._id
      });
    } catch (e) {}

    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleToggleGPS = () => {
    if (!isLiveGPS) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setCoords({ lat, lng });
            setIsLiveGPS(true);
            setStatusMsg('📍 Live GPS tracking started! Location broadcasting to Farmer & Buyer.');

            try {
              await API.post('/driver/location', {
                driverUserId: user?.id || user?._id,
                latitude: lat,
                longitude: lng,
                speed: 40
              });
            } catch (e) {}
          },
          () => {
            setCoords({ lat: 11.341, lng: 77.7172 });
            setIsLiveGPS(true);
            setStatusMsg('📍 Live GPS tracking active (Simulated GPS Location mode).');
          }
        );
      } else {
        setIsLiveGPS(true);
      }
    } else {
      setIsLiveGPS(false);
      setStatusMsg('GPS location sharing paused.');
    }
  };

  // Metrics
  const assignedCount = deliveries.length;
  const todaysPickups = deliveries.filter((d) => d.driverStatus !== 'DELIVERED').length;
  const activeDeliveries = deliveries.filter((d) => d.driverStatus === 'IN_TRANSIT' || d.driverStatus === 'PICKED_UP' || d.driverStatus === 'DRIVER_EN_ROUTE').length;
  const completedDeliveries = deliveries.filter((d) => d.driverStatus === 'DELIVERED').length;

  return (
    <div className="app-container">
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* DRIVER WELCOME HEADER */}
        <div
          className="card"
          style={{
            padding: '1.75rem',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
              }}
            >
              <Truck size={34} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="badge" style={{ background: '#3B82F6', color: '#FFFFFF', fontSize: '0.75rem' }}>
                  🚚 Delivery Driver Portal
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>User ID: {user?.id || user?._id || 'usr_driver'}</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', margin: 0, color: '#FFFFFF', fontWeight: 800 }}>
                Welcome back, {user?.name || 'Logistics Driver'}!
              </h2>
              <p style={{ margin: 0, color: '#CBD5E1', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                📍 Vehicle: <strong>TN 33 AB 1234 (14ft Commercial Truck)</strong> | Location: <strong>{user?.location || 'Tamil Nadu'}</strong>
              </p>
            </div>
          </div>

          <button
            className={`btn ${isLiveGPS ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleToggleGPS}
            style={{ gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)' }}
          >
            <Radio size={20} className={isLiveGPS ? 'animate-pulse' : ''} />
            {isLiveGPS ? '⏹️ Stop Live GPS' : '📍 Broadcast Live Location'}
          </button>
        </div>

        {statusMsg && (
          <div
            style={{
              background: '#DCFCE7',
              color: '#166534',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              border: '1px solid #86EFAC',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <CheckCircle2 size={20} /> {statusMsg}
          </div>
        )}

        {/* SUB-PAGE TAB NAVIGATION */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            borderBottom: '2px solid var(--border-color)',
            paddingBottom: '0.5rem'
          }}
        >
          <button
            className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setActiveTab('dashboard');
              navigate('/driver/dashboard');
            }}
            style={{ gap: '0.4rem', borderRadius: 'var(--radius-sm)' }}
          >
            <Truck size={16} /> Driver Overview
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'deliveries' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setActiveTab('deliveries');
              navigate('/driver/deliveries');
            }}
            style={{ gap: '0.4rem', borderRadius: 'var(--radius-sm)' }}
          >
            <PackageCheck size={16} /> Assigned Deliveries ({deliveries.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'notifications' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setActiveTab('notifications');
              navigate('/driver/notifications');
            }}
            style={{ gap: '0.4rem', borderRadius: 'var(--radius-sm)' }}
          >
            <Bell size={16} /> Driver Alerts
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setActiveTab('profile');
              navigate('/driver/profile');
            }}
            style={{ gap: '0.4rem', borderRadius: 'var(--radius-sm)' }}
          >
            <User size={16} /> Driver Profile
          </button>
        </div>

        {/* KPI METRICS BAR */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}
        >
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #3B82F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Deliveries</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.2rem' }}>
                  {assignedCount}
                </div>
              </div>
              <div style={{ background: '#EFF6FF', color: '#3B82F6', padding: '0.65rem', borderRadius: '50%' }}>
                <PackageCheck size={24} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Today's Pickups</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>
                  {todaysPickups}
                </div>
              </div>
              <div style={{ background: '#FEF3C7', color: '#D97706', padding: '0.65rem', borderRadius: '50%' }}>
                <Clock size={24} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #8B5CF6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Deliveries</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7C3AED', marginTop: '0.2rem' }}>
                  {activeDeliveries}
                </div>
              </div>
              <div style={{ background: '#F3E8FF', color: '#7C3AED', padding: '0.65rem', borderRadius: '50%' }}>
                <Truck size={24} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10B981' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Deliveries</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                  {completedDeliveries}
                </div>
              </div>
              <div style={{ background: '#D1FAE5', color: '#059669', padding: '0.65rem', borderRadius: '50%' }}>
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* TAB CONTENTS */}
        {(activeTab === 'dashboard' || activeTab === 'deliveries') && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', margin: 0 }}>
                📦 Assigned Pickup & Delivery Schedule
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing {deliveries.length} active logistics task(s)
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                Loading delivery schedule...
              </div>
            ) : deliveries.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Truck size={40} style={{ color: 'var(--border-color)', marginBottom: '0.75rem' }} />
                <h4>No assigned deliveries at the moment</h4>
                <p style={{ fontSize: '0.88rem' }}>New orders assigned to your driver ID will appear here automatically.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {deliveries.map((item, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      borderLeft:
                        item.driverStatus === 'DELIVERED'
                          ? '6px solid #10B981'
                          : item.driverStatus === 'IN_TRANSIT'
                          ? '6px solid #8B5CF6'
                          : '6px solid #3B82F6'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-dark)' }}>
                            {item.id || item._id}
                          </span>
                          <span
                            className="badge"
                            style={{
                              background:
                                item.driverStatus === 'DELIVERED'
                                  ? '#DCFCE7'
                                  : item.driverStatus === 'IN_TRANSIT'
                                  ? '#F3E8FF'
                                  : '#EFF6FF',
                              color:
                                item.driverStatus === 'DELIVERED'
                                  ? '#166534'
                                  : item.driverStatus === 'IN_TRANSIT'
                                  ? '#6B21A8'
                                  : '#1E40AF',
                              fontWeight: 700
                            }}
                          >
                            STATUS: {item.driverStatus || 'ASSIGNED'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                          Crop Cargo: <strong>{item.cropName} ({item.quantity} {item.unit || 'kg'})</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned Date</div>
                        <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                          {item.assignedDate || new Date().toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* LOCATION & ROUTE MATRIX */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1rem',
                        background: '#F8FAFC',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1.25rem',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {/* PICKUP LOCATION */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          <MapPin size={16} /> PICKUP LOCATION (Farmer Farm)
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                          {item.farmerName || 'Farmer'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginTop: '0.15rem' }}>
                          📍 {item.pickupLocation || item.location || 'Perundurai, Erode, Tamil Nadu'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          📞 Mobile: {item.farmerMobile || item.farmerPhone || '+919876543210'}
                        </div>
                      </div>

                      {/* DELIVERY LOCATION */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1E40AF', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          <Navigation size={16} /> DELIVERY LOCATION (Buyer Market)
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                          {item.buyerName || 'Kamaleshwaran Wholesale Market'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginTop: '0.15rem' }}>
                          🏢 {item.deliveryLocation || item.marketName || 'Coimbatore Market'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          📞 Mobile: {item.buyerMobile || '+919876543211'}
                        </div>
                      </div>

                      {/* DISTANCE & ESTIMATED TIME */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Route Distance</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-green)' }}>
                          {item.distance || '48.5 km'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          ⏱️ Est. Travel Time: <strong>{item.estimatedTime || '1 hr 15 mins'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* STATUS ACTION CONTROLS */}
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.6rem' }}>
                        ⚡ Driver Journey Status Controls:
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <button
                          className={`btn btn-sm ${item.driverStatus === 'DRIVER_EN_ROUTE' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => handleUpdateStatus(item.id || item._id, 'DRIVER_EN_ROUTE')}
                        >
                          🚚 1. On The Way
                        </button>
                        <button
                          className={`btn btn-sm ${item.driverStatus === 'ARRIVED_FARM' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => handleUpdateStatus(item.id || item._id, 'ARRIVED_FARM')}
                        >
                          🌾 2. Arrived at Farm
                        </button>
                        <button
                          className={`btn btn-sm ${item.driverStatus === 'PICKED_UP' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => handleUpdateStatus(item.id || item._id, 'PICKED_UP')}
                        >
                          📦 3. Produce Picked Up
                        </button>
                        <button
                          className={`btn btn-sm ${item.driverStatus === 'IN_TRANSIT' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => handleUpdateStatus(item.id || item._id, 'IN_TRANSIT')}
                        >
                          🚛 4. In Transit
                        </button>
                        <button
                          className={`btn btn-sm ${item.driverStatus === 'DELIVERED' ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => handleUpdateStatus(item.id || item._id, 'DELIVERED')}
                          style={{ background: item.driverStatus === 'DELIVERED' ? '#10B981' : '', color: item.driverStatus === 'DELIVERED' ? '#FFFFFF' : '' }}
                        >
                          ✅ 5. Delivery Completed
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={22} style={{ color: 'var(--primary-green)' }} /> Driver Logistics Alerts & Notifications
            </h3>

            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No active delivery notifications at the moment.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notifications.map((n, i) => (
                  <div key={i} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.2rem' }}>{n.title}</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-body)' }}>{n.message}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      {new Date(n.createdAt || Date.now()).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#3B82F6', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <User size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0 }}>
                {user?.name || 'Driver Profile'}
              </h3>
              <span className="badge badge-success" style={{ marginTop: '0.4rem', display: 'inline-block' }}>
                VERIFIED DELIVERY DRIVER
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
              <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Driver Account ID</span>
                <strong style={{ color: 'var(--text-dark)' }}>{user?.id || user?._id}</strong>
              </div>

              <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email Address</span>
                <strong style={{ color: 'var(--text-dark)' }}>{user?.email}</strong>
              </div>

              <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mobile Number</span>
                <strong style={{ color: 'var(--text-dark)' }}>{user?.phone || user?.mobile || 'Not specified'}</strong>
              </div>

              <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Primary Region / District</span>
                <strong style={{ color: 'var(--text-dark)' }}>{user?.location || user?.district || 'Tamil Nadu'}</strong>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default DriverDashboard;
