import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProduits, ajouterAuPanier } from '../services/apiService';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import '../styles/Accueil.css';

function Accueil() {
  const [produits, setProduits] = useState([]);
  const [produitsFiltres, setProduitsFiltres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    chargerProduits();
  }, []);

  const chargerProduits = async () => {
    try {
      setLoading(true);
      const data = await getProduits();
      setProduits(data);
      setProduitsFiltres(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecherche = (terme) => {
    const filtre = produits.filter(produit =>
      produit.nom.toLowerCase().includes(terme.toLowerCase()) ||
      produit.description.toLowerCase().includes(terme.toLowerCase())
    );
    setProduitsFiltres(filtre);
  };

  const handleAjouterPanier = async (idProduit) => {
    try {
      await ajouterAuPanier(idProduit);
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
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={chargerProduits} className="btn-primary">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="accueil">
      <div className="hero-section">
        <h1>Bienvenue sur MiniShop</h1>
        <p>Découvrez notre sélection de produits premium</p>
        <SearchBar onRecherche={handleRecherche} />
      </div>

      <div className="produits-grid">
        {produitsFiltres.length === 0 ? (
          <div className="no-products">
            <p>Aucun produit trouvé</p>
          </div>
        ) : (
          produitsFiltres.map((produit) => (
            <ProductCard
              key={produit.id}
              produit={produit}
              onAjouterPanier={handleAjouterPanier}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Accueil;