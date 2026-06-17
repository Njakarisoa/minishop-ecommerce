import React, { useState, useEffect } from 'react';
import { 
  getProduits, 
  ajouterProduit, 
  modifierProduit, 
  supprimerProduit,
  getCommandes 
} from '../services/apiService';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [produits, setProduits] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    description: '',
    image: '',
    stock: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('produits');

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      const [produitsData, commandesData] = await Promise.all([
        getProduits(),
        getCommandes()
      ]);
      setProduits(produitsData);
      setCommandes(commandesData);
    } catch (error) {
      alert('❌ Erreur lors du chargement des données');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangement = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSoumettre = async (e) => {
    e.preventDefault();
    
    const produitData = {
      ...formData,
      prix: parseFloat(formData.prix),
      stock: parseInt(formData.stock)
    };

    try {
      if (isEditing && editId) {
        await modifierProduit(editId, produitData);
        alert('✅ Produit modifié avec succès');
      } else {
        await ajouterProduit(produitData);
        alert('✅ Produit ajouté avec succès');
      }
      
      setFormData({ nom: '', prix: '', description: '', image: '', stock: '' });
      setIsEditing(false);
      setEditId(null);
      await chargerDonnees();
    } catch (error) {
      alert('❌ Erreur lors de l\'enregistrement');
      console.error(error);
    }
  };

  const handleModifier = (produit) => {
    setFormData({
      nom: produit.nom,
      prix: produit.prix.toString(),
      description: produit.description,
      image: produit.image,
      stock: produit.stock.toString()
    });
    setIsEditing(true);
    setEditId(produit.id);
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    
    try {
      await supprimerProduit(id);
      alert('✅ Produit supprimé');
      await chargerDonnees();
    } catch (error) {
      alert('❌ Erreur lors de la suppression');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>👨‍💼 Administration</h1>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'produits' ? 'active' : ''}`}
          onClick={() => setActiveTab('produits')}
        >
          Gestion des produits
        </button>
        <button 
          className={`tab-btn ${activeTab === 'commandes' ? 'active' : ''}`}
          onClick={() => setActiveTab('commandes')}
        >
          Commandes ({commandes.length})
        </button>
      </div>

      {activeTab === 'produits' && (
        <div className="admin-section">
          <div className="admin-form">
            <h2>{isEditing ? 'Modifier' : 'Ajouter'} un produit</h2>
            <form onSubmit={handleSoumettre}>
              <input
                type="text"
                name="nom"
                placeholder="Nom du produit"
                value={formData.nom}
                onChange={handleChangement}
                required
              />
              <input
                type="number"
                name="prix"
                placeholder="Prix"
                value={formData.prix}
                onChange={handleChangement}
                required
                step="0.01"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChangement}
                required
              />
              <input
                type="text"
                name="image"
                placeholder="URL de l'image"
                value={formData.image}
                onChange={handleChangement}
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChangement}
                required
                min="0"
              />
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {isEditing ? 'Modifier' : 'Ajouter'}
                </button>
                {isEditing && (
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setFormData({ nom: '', prix: '', description: '', image: '', stock: '' });
                      setIsEditing(false);
                      setEditId(null);
                    }}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-list">
            <h2>Liste des produits ({produits.length})</h2>
            <div className="produits-admin-grid">
              {produits.map((produit) => (
                <div key={produit.id} className="admin-product-item">
                  <div className="admin-product-info">
                    <span className="admin-product-name">{produit.nom}</span>
                    <span className="admin-product-price">{produit.prix.toFixed(2)} €</span>
                    <span className="admin-product-stock">Stock: {produit.stock}</span>
                  </div>
                  <div className="admin-product-actions">
                    <button 
                      onClick={() => handleModifier(produit)}
                      className="btn-secondary"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleSupprimer(produit.id)}
                      className="btn-danger"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'commandes' && (
        <div className="admin-section">
          <div className="admin-list">
            <h2>Historique des commandes</h2>
            {commandes.length === 0 ? (
              <p>Aucune commande pour le moment</p>
            ) : (
              <div className="commandes-list">
                {commandes.map((commande) => (
                  <div key={commande.idCommande} className="commande-item">
                    <div className="commande-header">
                      <span className="commande-id">#{commande.idCommande}</span>
                      <span className="commande-date">
                        {new Date(commande.date).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div className="commande-produits">
                      {commande.produits.map((p, index) => (
                        <span key={index}>
                          {p.nom} x {p.quantite}
                        </span>
                      ))}
                    </div>
                    <div className="commande-total">
                      Total: <strong>{commande.total.toFixed(2)} €</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;