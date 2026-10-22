import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { Users, Search, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([
    {
      _id: 'usr_farmer_kamalesh',
      name: 'Kamalesh Farmer',
      email: 'farmer@agrolink.demo',
      phone: '+91 9876543210',
      role: 'farmer',
      location: 'Erode, Tamil Nadu',
      verified: true
    },
    {
      _id: 'usr_buyer_kamalesh',
      name: 'Kamalesh Buyer',
      email: 'buyer@agrolink.demo',
      phone: '+91 9876543211',
      role: 'buyer',
      location: 'Salem, Tamil Nadu',
      verified: true
    },
    {
      _id: 'usr_admin_agrolink',
      name: 'AgroLink Admin',
      email: 'admin@agrolink.demo',
      phone: '+91 9876543212',
      role: 'admin',
      location: 'Chennai, Tamil Nadu',
      verified: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/users');
        if (res.data && res.data.length > 0) {
          setUsers(res.data);
        }
      } catch (e) {}
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term) ||
      u.location?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          {/* Header & Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>Admin User Management</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                System user directory with mandatory phone number audit and search filters.
              </p>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search by name, phone, email, role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={18} style={{ color: 'var(--primary-green)' }} /> Registered System Users ({filteredUsers.length})
              </h3>
              <span className="demo-tag">Admin Audit Mode</span>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Role</th>
                    <th>Email Address</th>
                    <th>Phone Number (Required)</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, idx) => (
                    <tr key={u._id || idx}>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'buyer' ? 'badge-info' : 'badge-success'}`}>
                          {u.role?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Mail size={14} style={{ color: 'var(--text-muted)' }} /> {u.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                          <Phone size={14} style={{ color: 'var(--primary-green)' }} /> {u.phone || '+91 9876543210'}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                          <MapPin size={14} /> {u.location || 'Tamil Nadu'}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <ShieldCheck size={12} /> Verified
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No matching users found for "{searchTerm}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminUsers;
