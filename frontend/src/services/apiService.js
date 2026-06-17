import axios from 'axios';

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// SERVICES PRODUITS
// ============================================

// Récupérer tous les produits
export const getProduits = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Erreur getProduits:', error);
    throw error;
  }
};

// Récupérer un produit par son ID
export const getProduit = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur getProduit:', error);
    throw error;
  }
};

// Ajouter un produit
export const ajouterProduit = async (produit) => {
  try {
    const response = await api.post('/products', produit);
    return response.data;
  } catch (error) {
    console.error('Erreur ajouterProduit:', error);
    throw error;
  }
};

// Modifier un produit
export const modifierProduit = async (id, produit) => {
  try {
    const response = await api.put(`/products/${id}`, produit);
    return response.data;
  } catch (error) {
    console.error('Erreur modifierProduit:', error);
    throw error;
  }
};

// Supprimer un produit
export const supprimerProduit = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur supprimerProduit:', error);
    throw error;
  }
};

// ============================================
// SERVICES PANIER
// ============================================

// Récupérer le panier
export const getPanier = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Erreur getPanier:', error);
    throw error;
  }
};

// Ajouter au panier
export const ajouterAuPanier = async (idProduit, quantite = 1) => {
  try {
    const response = await api.post('/cart', { idProduit, quantite });
    return response.data;
  } catch (error) {
    console.error('Erreur ajouterAuPanier:', error);
    throw error;
  }
};

// Modifier quantité dans le panier
export const modifierQuantitePanier = async (idProduit, quantite) => {
  try {
    const response = await api.put(`/cart/${idProduit}`, { quantite });
    return response.data;
  } catch (error) {
    console.error('Erreur modifierQuantitePanier:', error);
    throw error;
  }
};

// Supprimer du panier
export const supprimerDuPanier = async (idProduit) => {
  try {
    const response = await api.delete(`/cart/${idProduit}`);
    return response.data;
  } catch (error) {
    console.error('Erreur supprimerDuPanier:', error);
    throw error;
  }
};

// ============================================
// SERVICES COMMANDES
// ============================================

// Récupérer toutes les commandes
export const getCommandes = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Erreur getCommandes:', error);
    throw error;
  }
};

// Passer une commande
export const passerCommande = async (commande) => {
  try {
    const response = await api.post('/orders', commande);
    return response.data;
  } catch (error) {
    console.error('Erreur passerCommande:', error);
    throw error;
  }
};