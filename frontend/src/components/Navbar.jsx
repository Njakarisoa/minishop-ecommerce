import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  const toggleMenu = () => {
    setMenuOuvert(!menuOuvert);
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
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;