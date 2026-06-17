import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

function ProductCard({ produit, onAjouterPanier }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={produit.image} alt={produit.nom} />
        {produit.stock < 5 && (
          <span className="stock-badge">Stock limité</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{produit.nom}</h3>
        <p className="product-price">{produit.prix.toFixed(2)} €</p>
        <p className="product-description">
          {produit.description.substring(0, 80)}...
        </p>
        
        <div className="product-actions">
          <Link to={`/produit/${produit.id}`} className="btn-secondary">
            Voir détails
          </Link>
          <button 
            onClick={() => onAjouterPanier(produit.id)}
            className="btn-primary"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;