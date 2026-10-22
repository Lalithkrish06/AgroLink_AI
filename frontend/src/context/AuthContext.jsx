import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

const normalizeUser = (u) => {
  if (!u) return null;
  const mobileVal = u.mobile || u.phone || u.mobileNumber || '';
  return {
    ...u,
    phone: mobileVal,
    mobile: mobileVal,
    mobileNumber: mobileVal
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('agrolink_token');
      const savedUser = localStorage.getItem('agrolink_user');

      if (token && savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.id === 'usr_demo_farmer' || parsed.name === 'Ramasamy Gounder' || parsed.name === 'Kamalesh Farmer' || parsed.name === 'Kamaleshwaran135') {
            localStorage.removeItem('agrolink_token');
            localStorage.removeItem('agrolink_user');
            setUser(null);
          } else {
            const normalizedSaved = normalizeUser(parsed);
            setUser(normalizedSaved);
            localStorage.setItem('agrolink_user', JSON.stringify(normalizedSaved));

            try {
              const res = await API.get('/auth/me');
              const meData = res?.data?.user || res?.data;
              if (meData && typeof meData === 'object' && meData.role) {
                const refreshed = normalizeUser(meData);
                localStorage.setItem('agrolink_user', JSON.stringify(refreshed));
                setUser(refreshed);
              }
            } catch (e) {}
          }
        } catch (e) {
          localStorage.removeItem('agrolink_token');
          localStorage.removeItem('agrolink_user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      const res = await API.post('/auth/login', { email, password, role });
      const payload = res.data;

      if (payload && typeof payload === 'string' && (payload.trim().startsWith('<!') || payload.trim().startsWith('<html'))) {
        return { success: false, message: 'Backend service returned HTML instead of JSON. Please verify backend API status.' };
      }

      const token = payload?.token || payload?.data?.token;
      const userData = payload?.user || payload?.data?.user || (payload?.id ? payload : null);

      if (userData) {
        if (role && userData.role && userData.role.toLowerCase() !== role.toLowerCase()) {
          const roleTitle = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
          return { success: false, message: `This account is registered as a ${roleTitle}. Please use ${roleTitle} Login.` };
        }
        if (token) localStorage.setItem('agrolink_token', token);
        const normalized = normalizeUser(userData);
        localStorage.setItem('agrolink_user', JSON.stringify(normalized));
        setUser(normalized);
        return { success: true, user: normalized };
      }

      return { success: false, message: payload?.message || 'Server did not return valid user account details.' };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      return { success: false, message: errMsg || 'Unable to connect to the authentication service.' };
    }
  };

  const register = async (userData) => {
    try {
      const rawMobile = userData.phone || userData.mobile || userData.mobileNumber;
      const res = await API.post('/auth/register', {
        ...userData,
        phone: rawMobile,
        mobile: rawMobile,
        mobileNumber: rawMobile
      });
      const payload = res.data;

      if (payload && typeof payload === 'string' && (payload.trim().startsWith('<!') || payload.trim().startsWith('<html'))) {
        return { success: false, message: 'Backend service returned HTML instead of JSON. Please verify backend API status.' };
      }

      const token = payload?.token || payload?.data?.token;
      const newUser = payload?.user || payload?.data?.user || (payload?.id ? payload : null);

      if (token) localStorage.setItem('agrolink_token', token);
      if (newUser) {
        const normalized = normalizeUser(newUser);
        localStorage.setItem('agrolink_user', JSON.stringify(normalized));
        setUser(normalized);
        return { success: true, user: normalized };
      }
      return { success: false, message: payload?.message || 'Server did not return valid user account details.' };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      return { success: false, message: errMsg || 'Unable to connect to registration service.' };
    }
  };

  const switchRole = (newRole) => {
    let name = 'Farmer';
    let email = 'farmer@agrolink.com';

    if (newRole === 'buyer') {
      name = 'Buyer Trader';
      email = 'buyer@agrolink.com';
    } else if (newRole === 'driver') {
      name = 'Delivery Driver';
      email = 'driver@agrolink.com';
    } else if (newRole === 'admin') {
      name = 'System Admin';
      email = 'admin@agrolink.com';
    }

    const updatedUser = {
      id: 'usr_' + newRole + '_' + Date.now(),
      name,
      email,
      phone: '+919876543210',
      role: newRole,
      location: 'Tamil Nadu',
      verified: true
    };

    localStorage.setItem('agrolink_user', JSON.stringify(updatedUser));
    localStorage.setItem('agrolink_token', 'token_' + newRole);
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('agrolink_token');
    localStorage.removeItem('agrolink_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
