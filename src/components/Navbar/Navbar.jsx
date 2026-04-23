import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Menu, Close, Person, AdminPanelSettings, ShoppingCart, Store, Dashboard } from '@mui/icons-material';
import './Navbar.scss';

export default function Navbar() {
  const { currentUser, userData, isAdmin, isPremium, loading } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && navRef.current && !navRef.current.contains(event.target) &&
          menuBtnRef.current && !menuBtnRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) document.body.classList.add('menu-open');
    else document.body.classList.remove('menu-open');
    return () => document.body.classList.remove('menu-open');
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const username = currentUser?.email?.split('@')[0] || userData?.username;
  const cartItemCount = cart?.items?.length || 0;

  const handleProfileClick = () => {
    const email = currentUser?.email;
    if (email) {
      navigate(`/profile/${encodeURIComponent(email)}`);
      closeMobileMenu();
    }
  };

  return (
    <header className={`${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="header-container">
        <NavLink to="/" className="logo" onClick={closeMobileMenu}>
          <img src="/logo192.png" alt="Ndonyo" />
          <span className="logo-text">Ndonyo Store</span>
        </NavLink>
        
        <button ref={menuBtnRef} className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Menu" aria-expanded={mobileMenuOpen}>
          {mobileMenuOpen ? <Close /> : <Menu />}
        </button>
        
        <nav ref={navRef} className={mobileMenuOpen ? "active" : ""}>
          <NavLink to="/" className="nav-link" onClick={closeMobileMenu}>Home</NavLink>
          <NavLink to="/marketplace" className="nav-link" onClick={closeMobileMenu}>
            <Store className="nav-icon" /> Shop
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={closeMobileMenu}>About</NavLink>
          
          <div className="btn-wrapper">
            {currentUser ? (
              <>
                <div className="user-greeting" onClick={handleProfileClick} role="button" tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleProfileClick(); }}>
                  <Person className="user-icon" />
                  <span>Hi, {username}</span>
                  {isPremium && !loading && <span className="vip-badge">⭐</span>}
                </div>
                
                <NavLink to="/cart" className="cart-link" onClick={closeMobileMenu}>
                  <ShoppingCart className="cart-icon" />
                  <span>Cart ({cartItemCount})</span>
                </NavLink>
                
                {isAdmin && (
                  <>
                    <NavLink to="/admin/dashboard" className="btn admin-btn" onClick={closeMobileMenu}>
                      <Dashboard className="admin-icon" /> Dashboard
                    </NavLink>
                    <NavLink to="/admin/users" className="btn admin-btn" onClick={closeMobileMenu}>
                      <AdminPanelSettings className="admin-icon" /> Admin
                    </NavLink>
                  </>
                )}
                
                <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <NavLink className="btn login-btn" to="/login" onClick={closeMobileMenu}>Log In</NavLink>
                <NavLink className="btn login-btn" to="/register" onClick={closeMobileMenu}>Register</NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
      {mobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu} />}
    </header>
  );
}