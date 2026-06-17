const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS pour accepter les requêtes de Vercel
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://minishop-ecommerce.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Chemins vers les fichiers JSON
const produitsPath = path.join(__dirname, 'data', 'produits.json');
const panierPath = path.join(__dirname, 'data', 'panier.json');
const commandesPath = path.join(__dirname, 'data', 'commandes.json');

// Fonctions utilitaires
const lireJSON = (fichier) => {
    try {
        const data = fs.readFileSync(fichier, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const ecrireJSON = (fichier, data) => {
    fs.writeFileSync(fichier, JSON.stringify(data, null, 2));
};

const genererID = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// ====================
// ROUTES PRODUITS
// ====================

app.get('/api/products', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        res.json(produits);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
    }
});

app.get('/api/products/:id', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        const produit = produits.find(p => p.id === req.params.id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(produit);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du produit' });
    }
});

app.post('/api/products', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        const nouveauProduit = {
            id: genererID(),
            ...req.body
        };
        produits.push(nouveauProduit);
        ecrireJSON(produitsPath, produits);
        res.status(201).json(nouveauProduit);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
    }
});

app.put('/api/products/:id', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        const index = produits.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        produits[index] = { ...produits[index], ...req.body };
        ecrireJSON(produitsPath, produits);
        res.json(produits[index]);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification du produit' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        const filteredProduits = produits.filter(p => p.id !== req.params.id);
        if (filteredProduits.length === produits.length) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        ecrireJSON(produitsPath, filteredProduits);
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
    }
});

// ====================
// ROUTES PANIER
// ====================

app.get('/api/cart', (req, res) => {
    try {
        const panier = lireJSON(panierPath);
        const produits = lireJSON(produitsPath);
        const panierComplet = panier.map(item => {
            const produit = produits.find(p => p.id === item.idProduit);
            return {
                ...item,
                produit: produit || null
            };
        });
        res.json(panierComplet);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
    }
});

app.post('/api/cart', (req, res) => {
    try {
        const { idProduit, quantite = 1 } = req.body;
        const panier = lireJSON(panierPath);
        const existingItem = panier.find(item => item.idProduit === idProduit);
        if (existingItem) {
            existingItem.quantite += quantite;
        } else {
            panier.push({ idProduit, quantite });
        }
        ecrireJSON(panierPath, panier);
        res.status(201).json({ message: 'Produit ajouté au panier' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout au panier' });
    }
});

app.put('/api/cart/:id', (req, res) => {
    try {
        const { quantite } = req.body;
        const panier = lireJSON(panierPath);
        const item = panier.find(item => item.idProduit === req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
        }
        if (quantite <= 0) {
            const newPanier = panier.filter(item => item.idProduit !== req.params.id);
            ecrireJSON(panierPath, newPanier);
            return res.json({ message: 'Produit supprimé du panier' });
        }
        item.quantite = quantite;
        ecrireJSON(panierPath, panier);
        res.json({ message: 'Quantité mise à jour' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du panier' });
    }
});

app.delete('/api/cart/:id', (req, res) => {
    try {
        const panier = lireJSON(panierPath);
        const newPanier = panier.filter(item => item.idProduit !== req.params.id);
        ecrireJSON(panierPath, newPanier);
        res.json({ message: 'Produit supprimé du panier' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du panier' });
    }
});

// ====================
// ROUTES COMMANDES
// ====================

app.get('/api/orders', (req, res) => {
    try {
        const commandes = lireJSON(commandesPath);
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
});

app.post('/api/orders', (req, res) => {
    try {
        const commandes = lireJSON(commandesPath);
        const nouvelleCommande = {
            idCommande: genererID(),
            ...req.body,
            date: new Date().toISOString()
        };
        commandes.push(nouvelleCommande);
        ecrireJSON(commandesPath, commandes);
        ecrireJSON(panierPath, []);
        res.status(201).json(nouvelleCommande);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la commande' });
    }
});

// Route de santé pour vérifier que l'API fonctionne
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'MiniShop API est en ligne !' });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
});
