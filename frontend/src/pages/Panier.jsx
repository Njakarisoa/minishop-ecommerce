import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getPanier, 
  modifierQuantitePanier, 
  supprimerDuPanier, 
  passerCommande 
} from '../services/apiService';
import '../styles/Panier.css';

function Panier() {
  const navigate = useNavigate();
  const [panierItems, setPanierItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    chargerPanier();
  }, []);

  const chargerPanier = async () => {
    try {
      setLoading(true);
      const data = await getPanier();
      setPanierItems(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du panier');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModifierQuantite = async (idProduit, nouvelleQuantite) => {
    try {
      await modifierQuantitePanier(idProduit, nouvelleQuantite);
      await chargerPanier();
    } catch (error) {
      alert('❌ Erreur lors de la mise à jour');
      console.error(error);
    }
  };

  const handleSupprimer = async (idProduit) => {
    if (!window.confirm('Voulez-vous supprimer cet article du panier ?')) return;
    
    try {
      await supprimerDuPanier(idProduit);
      await chargerPanier();
    } catch (error) {
      alert('❌ Erreur lors de la suppression');
      console.error(error);
    }
  };

  const handleCommander = async () => {
    if (panierItems.length === 0) {
      alert('Votre panier est vide !');
      return;
    }

    if (!window.confirm('Confirmer votre commande ?')) return;

    try {
      const produits = panierItems.map(item => ({
        idProduit: item.idProduit,
        nom: item.produit.nom,
        quantite: item.quantite,
        prix: item.produit.prix
      }));

      const total = produits.reduce((sum, p) => sum + (p.prix * p.quantite), 0);

      await passerCommande({
        produits,
        total
      });

      alert('✅ Commande passée avec succès !');
      navigate('/');
    } catch (error) {
      alert('❌ Erreur lors de la commande');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du panier...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={chargerPanier} className="btn-primary">
          Réessayer
        </button>
      </div>
    );
  }

  const totalPrix = panierItems.reduce((sum, item) => {
    return sum + (item.produit ? item.produit.prix * item.quantite : 0);
  }, 0);

  return (
    <div className="panier">
      <h1>🛒 Mon Panier</h1>

      {panierItems.length === 0 ? (
        <div className="panier-vide">
          <p>Votre panier est vide</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Découvrir nos produits
          </button>
        </div>
      ) : (
        <>
          <div className="panier-items">
            {panierItems.map((item) => (
              <div key={item.idProduit} className="panier-item">
                {item.produit ? (
                  <>
                    <div className="item-image">
                      <img src={item.produit.image} alt={item.produit.nom} />
                    </div>
                    <div className="item-details">
                      <h3>{item.produit.nom}</h3>
                      <p className="item-price">{item.produit.prix.toFixed(2)} €</p>
                      
                      <div className="item-actions">
                        <div className="quantite-control">
                          <button 
                            onClick={() => handleModifierQuantite(item.idProduit, item.quantite - 1)}
                            className="btn-quantite"
                          >
                            -
                          </button>
                          <span className="quantite">{item.quantite}</span>
                          <button 
                            onClick={() => handleModifierQuantite(item.idProduit, item.quantite + 1)}
                            className="btn-quantite"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => handleSupprimer(item.idProduit)}
                          className="btn-danger"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="item-error">
                    <p>Produit non disponible</p>
                    <button 
                      onClick={() => handleSupprimer(item.idProduit)}
                      className="btn-danger"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="panier-resume">
            <div className="resume-details">
              <h3>Résumé de la commande</h3>
              <div className="resume-line">
                <span>Total</span>
                <span className="total-price">{totalPrix.toFixed(2)} €</span>
              </div>
              <button onClick={handleCommander} className="btn-primary commander-btn">
                Passer la commande
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Panier;