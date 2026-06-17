import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🛍️ MiniShop</h3>
          <p>Votre boutique en ligne moderne</p>
          <p className="footer-credit">© 2024 MiniShop. Tous droits réservés.</p>
        </div>

        <div className="footer-section">
          <h4>Liens rapides</h4>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/admin">Administration</Link></li>
            <li><Link to="/panier">Panier</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 contact@minishop.com</p>
          <p>📞 +33 1 23 45 67 89</p>
          <p>📍 Paris, France</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;