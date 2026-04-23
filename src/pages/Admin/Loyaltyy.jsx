import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Loyalty.scss';

export default function Loyaltyy() {
  const { isAdmin, loading } = useAuth();
  const [stats] = useState({ totalPoints: 125000, activeMembers: 3420, pointsRedeemed: 45000 });
  const [tiers] = useState([
    { name: 'Bronze', minPoints: 0, benefits: '5% off all purchases', icon: '🥉', members: 2100 },
    { name: 'Silver', minPoints: 1000, benefits: '10% off + Free shipping', icon: '🥈', members: 850 },
    { name: 'Gold', minPoints: 5000, benefits: '15% off + Free shipping + Early access', icon: '🥇', members: 320 },
    { name: 'Platinum', minPoints: 10000, benefits: '20% off + Free shipping + VIP support', icon: '💎', members: 150 },
  ]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="loyalty-page">
      <div className="page-header"><h1>Loyalty Program</h1></div>
      <div className="stats-grid">
        <div className="stat-card"><h3>{stats.totalPoints.toLocaleString()}</h3><p>Total Points Issued</p></div>
        <div className="stat-card"><h3>{stats.activeMembers.toLocaleString()}</h3><p>Active Members</p></div>
        <div className="stat-card"><h3>{stats.pointsRedeemed.toLocaleString()}</h3><p>Points Redeemed</p></div>
      </div>
      <div className="tiers-list">{tiers.map(tier => (<div key={tier.name} className="tier-card"><div className="tier-info"><div className="tier-icon">{tier.icon}</div><div><h3>{tier.name}</h3><p>{tier.benefits}</p></div></div><div className="tier-points">{tier.minPoints.toLocaleString()}+ points<br /><small>{tier.members} members</small></div></div>))}</div>
    </div>
  );
}