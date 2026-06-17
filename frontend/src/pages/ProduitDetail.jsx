import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduit, ajouterAuPanier } from '../services/apiService';
import '../styles/ProduitDetail.css';

function ProduitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    chargerProduit();
  }, [id]);

  const chargerProduit = async () => {
    try {
      setLoading(true);
      const data = await getProduit(id);
      setProduit(data);
      setError(null);
    } catch (err) {
      setError('Produit non trouvé');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAjouterPanier = async () => {
    try {
      await ajouterAuPanier(id);
      alert('✅ Produit ajouté au panier !');
    } catch (error) {
      alert('❌ Erreur lors de l\'ajout au panier');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (error || !produit) {
    return (
      <div className="error-container">
        <p>{error || 'Produit non trouvé'}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="produit-detail">
      <button onClick={() => navigate('/')} className="btn-secondary back-btn">
        ← Retour
      </button>

      <div className="detail-container">
        <div className="detail-image">
          <img src={produit.image} alt={produit.nom} />
        </div>

        <div className="detail-info">
          <h1>{produit.nom}</h1>
          <p className="detail-price">{produit.prix.toFixed(2)} €</p>
          
          <div className="detail-stock">
            <span className={produit.stock > 0 ? 'in-stock' : 'out-of-stock'}>
              {produit.stock > 0 ? '✅ En stock' : '❌ Rupture de stock'}
            </span>
            {produit.stock > 0 && <span> ({produit.stock} disponibles)</span>}
          </div>

          <div className="detail-description">
            <h3>Description</h3>
            <p>{produit.description}</p>
          </div>

          <button 
            onClick={handleAjouterPanier}
            className="btn-primary add-to-cart-btn"
            disabled={produit.stock === 0}
          >
            {produit.stock > 0 ? '🛒 Ajouter au panier' : 'Rupture de stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProduitDetail;