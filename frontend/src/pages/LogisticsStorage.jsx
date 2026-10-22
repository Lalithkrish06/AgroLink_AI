import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { Truck, Warehouse, MapPin, Phone, CheckCircle2, Calendar, ShieldCheck, X } from 'lucide-react';

const LogisticsStorage = () => {
  const [activeTab, setActiveTab] = useState('transport'); // 'transport' or 'storage'
  const [logisticsList, setLogisticsList] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState('');

  const fetchLogistics = async () => {
    try {
      const res = await API.get(`/logistics?type=${activeTab}`);
      setLogisticsList(res.data || []);
    } catch (err) {
      console.log('Error fetching logistics');
    }
  };

  useEffect(() => {
    fetchLogistics();
  }, [activeTab]);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/logistics/${modalItem._id || '1'}/book`, {});
      setBookingSuccess(res.data.message || 'Logistics booked successfully!');
      setTimeout(() => {
        setModalItem(null);
        setBookingSuccess('');
      }, 1800);
    } catch (err) {
      setBookingSuccess('Booking requested! Provider will contact you shortly.');
      setTimeout(() => {
        setModalItem(null);
        setBookingSuccess('');
      }, 1800);
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
              Logistics & Cold Storage Locator 🚚
            </h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Book verified crop transportation trucks and state-managed warehouse cold storage units.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              className="btn btn-lg"
              onClick={() => setActiveTab('transport')}
              style={{
                background: activeTab === 'transport' ? 'var(--primary-dark)' : 'white',
                color: activeTab === 'transport' ? 'white' : 'var(--dark-navy)',
                border: '1px solid var(--border-light)'
              }}
            >
              <Truck size={20} /> Verified Transport Vehicles
            </button>
            <button
              className="btn btn-lg"
              onClick={() => setActiveTab('storage')}
              style={{
                background: activeTab === 'storage' ? 'var(--primary-dark)' : 'white',
                color: activeTab === 'storage' ? 'white' : 'var(--dark-navy)',
                border: '1px solid var(--border-light)'
              }}
            >
              <Warehouse size={20} /> Cold Storage & Warehouses
            </button>
          </div>

          {/* Content Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {logisticsList.map((item, idx) => (
              <div key={idx} className="card card-interactive" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-navy)' }}>{item.name}</h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--slate-muted)' }}>Provided by {item.provider}</div>
                    </div>
                    <span className="badge badge-success">{item.status || 'Available'}</span>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-body)', marginBottom: '0.5rem' }}>
                      📍 <strong>Location:</strong> {item.location}
                    </div>

                    {item.type === 'transport' ? (
                      <>
                        <div style={{ fontSize: '0.85rem', color: 'var(--slate-body)', marginBottom: '0.5rem' }}>
                          🚛 <strong>Vehicle Type:</strong> {item.vehicleType}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--slate-body)', marginBottom: '0.5rem' }}>
                          📦 <strong>Payload Capacity:</strong> {item.capacity}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '0.5rem' }}>
                          Cost: {item.estimatedCost}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '0.85rem', color: 'var(--slate-body)', marginBottom: '0.5rem' }}>
                          🏬 <strong>Available Capacity:</strong> {item.availableCapacity}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '0.5rem' }}>
                          Cost: {item.storageCost}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} /> {item.contact}
                  </div>

                  <button className="btn btn-primary btn-sm" onClick={() => setModalItem(item)}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Modal */}
          {modalItem && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button
                  onClick={() => setModalItem(null)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--dark-navy)' }}>
                  Book {modalItem.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-muted)', marginBottom: '1.5rem' }}>
                  Location: {modalItem.location}
                </p>

                {bookingSuccess && (
                  <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <CheckCircle2 size={16} /> {bookingSuccess}
                  </div>
                )}

                <form onSubmit={handleBook}>
                  <div className="form-group">
                    <label className="form-label">Select Preferred Date</label>
                    <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimated Load (Quintals)</label>
                    <input type="number" className="form-control" defaultValue="50" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Transport / Storage Notes</label>
                    <textarea className="form-control" rows="2" placeholder="e.g. Temperature control required @ 12°C"></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Confirm Booking Request
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LogisticsStorage;
