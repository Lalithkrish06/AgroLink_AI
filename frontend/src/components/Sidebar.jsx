import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Home,
  LayoutDashboard,
  PlusCircle,
  BarChart2,
  Tag,
  Building2,
  Truck,
  CheckSquare,
  SlidersHorizontal
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const getLinks = () => {
    if (user?.role === 'admin') {
      return [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/dashboard?tab=farmers', icon: Home, label: 'Farmers' },
        { to: '/admin/dashboard?tab=buyers', icon: Building2, label: 'Buyers' },
        { to: '/admin/dashboard?tab=crop-lots', icon: Tag, label: 'Crop Lots' },
        { to: '/admin/dashboard?tab=markets', icon: Building2, label: 'Markets' },
        { to: '/admin/dashboard?tab=requirements', icon: SlidersHorizontal, label: 'Requirements' },
        { to: '/admin/dashboard?tab=requests', icon: Tag, label: 'Farmer Requests' },
        { to: '/admin/dashboard?tab=transactions', icon: CheckSquare, label: 'Transactions' },
        { to: '/admin/dashboard?tab=payments', icon: CheckSquare, label: 'Payments' },
        { to: '/admin/dashboard?tab=logistics', icon: Truck, label: 'Logistics' },
        { to: '/admin/dashboard?tab=grievances', icon: CheckSquare, label: 'Grievances' },
        { to: '/admin/dashboard?tab=analytics', icon: BarChart2, label: 'Analytics' },
      ];
    }

    if (user?.role === 'buyer') {
      return [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/buyer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/buyer/markets', icon: Building2, label: 'My Wholesale Markets' },
        { to: '/buyer-requirements', icon: SlidersHorizontal, label: 'Crop Requirements' },
        { to: '/buyer-offers', icon: Tag, label: 'Matching Lots' },
        { to: '/transactions', icon: CheckSquare, label: 'Transactions' },
      ];
    }

    return [
      { to: '/', icon: Home, label: 'Home' },
      { to: '/farmer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/create-lot', icon: PlusCircle, label: 'Create Crop Lot' },
      { to: '/farmer/market-analysis', icon: BarChart2, label: 'Market Analysis' },
      { to: '/buyer/markets', icon: Building2, label: 'Buyer Markets' },
      { to: '/transactions', icon: CheckSquare, label: 'Transactions' },
    ];
  };

  const links = getLinks();

  return (
    <aside className="sidebar">
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
        {user?.role ? `${user.role.toUpperCase()} WORKFLOW` : 'SIH DEMO WORKFLOW'}
      </div>

      {links.map((link, idx) => {
        const IconComponent = link.icon;
        return (
          <NavLink key={idx} to={link.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <IconComponent size={18} />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;
