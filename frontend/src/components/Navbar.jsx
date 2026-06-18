import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { utilisateur, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOuvert(!menuOuvert);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOuvert(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛍️ MiniShop
        </Link>

        <div className="navbar-menu" onClick={toggleMenu}>
          <span className="hamburger-icon">☰</span>
        </div>

        <ul className={`navbar-links ${menuOuvert ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={() => setMenuOuvert(false)}>
              Accueil
            </Link>
          </li>
          
          {isAuthenticated && (
            <>
              <li>
                <Link to="/admin" onClick={() => setMenuOuvert(false)}>
                  Admin
                </Link>
              </li>
              <li>
                <Link to="/panier" className="cart-link" onClick={() => setMenuOuvert(false)}>
                  🛒 Panier
                </Link>
              </li>
            </>
          )}
          
          <li className="user-section">
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-name">
                  👤 {utilisateur?.prenom} {utilisateur?.nom}
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-login-nav" onClick={() => setMenuOuvert(false)}>
                🔑 Se connecter
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
