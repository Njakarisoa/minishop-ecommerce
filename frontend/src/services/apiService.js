import axios from 'axios';

// Utiliser la variable d'environnement ou l'URL Render par défaut
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://minishop-api-u8nx.onrender.com/api';

console.log('🌐 API URL utilisée:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercepteur pour logger les requêtes
api.interceptors.request.use(
  (config) => {
    console.log('📤 Requête envoyée à:', config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erreur requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour logger les réponses
api.interceptors.response.use(
  (response) => {
    console.log('📥 Réponse reçue de:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Erreur réponse:', error.message);
    if (error.response) {
      console.error('📄 Statut:', error.response.status);
      console.error('📄 Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Services Produits
export const getProduits = async () => {
  try {
    console.log('🔍 Récupération des produits depuis:', `${API_BASE_URL}/products`);
    const response = await api.get('/products');
    console.log('✅ Produits récupérés:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getProduits:', error.message);
    throw error;
  }
};

export const getProduit = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur getProduit:', error);
    throw error;
  }
};

export const ajouterProduit = async (produit) => {
  try {
    const response = await api.post('/products', produit);
    return response.data;
  } catch (error) {
    console.error('Erreur ajouterProduit:', error);
    throw error;
  }
};

export const modifierProduit = async (id, produit) => {
  try {
    const response = await api.put(`/products/${id}`, produit);
    return response.data;
  } catch (error) {
    console.error('Erreur modifierProduit:', error);
    throw error;
  }
};

export const supprimerProduit = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur supprimerProduit:', error);
    throw error;
  }
};

// Services Panier
export const getPanier = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Erreur getPanier:', error);
    throw error;
  }
};

export const ajouterAuPanier = async (idProduit, quantite = 1) => {
  try {
    const response = await api.post('/cart', { idProduit, quantite });
    return response.data;
  } catch (error) {
    console.error('Erreur ajouterAuPanier:', error);
    throw error;
  }
};

export const modifierQuantitePanier = async (idProduit, quantite) => {
  try {
    const response = await api.put(`/cart/${idProduit}`, { quantite });
    return response.data;
  } catch (error) {
    console.error('Erreur modifierQuantitePanier:', error);
    throw error;
  }
};

export const supprimerDuPanier = async (idProduit) => {
  try {
    const response = await api.delete(`/cart/${idProduit}`);
    return response.data;
  } catch (error) {
    console.error('Erreur supprimerDuPanier:', error);
    throw error;
  }
};

// Services Commandes
export const getCommandes = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Erreur getCommandes:', error);
    throw error;
  }
};

export const passerCommande = async (commande) => {
  try {
    const response = await api.post('/orders', commande);
    return response.data;
  } catch (error) {
    console.error('Erreur passerCommande:', error);
    throw error;
  }
};
