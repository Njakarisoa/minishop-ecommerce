// Importation des modules nécessaires
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Initialisation de l'application Express
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Chemins vers les fichiers JSON
const produitsPath = path.join(__dirname, 'data', 'produits.json');
const panierPath = path.join(__dirname, 'data', 'panier.json');
const commandesPath = path.join(__dirname, 'data', 'commandes.json');

// ====================
// FONCTIONS UTILITAIRES
// ====================

// Lire un fichier JSON
const lireJSON = (fichier) => {
    const data = fs.readFileSync(fichier, 'utf8');
    return JSON.parse(data);
};

// Écrire dans un fichier JSON
const ecrireJSON = (fichier, data) => {
    fs.writeFileSync(fichier, JSON.stringify(data, null, 2));
};

// Générer un ID unique
const genererID = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// ====================
// ROUTES PRODUITS
// ====================

// GET - Récupérer tous les produits
app.get('/api/products', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        res.json(produits);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
    }
});

// GET - Récupérer un produit par son ID
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

// POST - Ajouter un nouveau produit
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

// PUT - Modifier un produit
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

// DELETE - Supprimer un produit
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

// GET - Récupérer le panier avec les détails des produits
app.get('/api/cart', (req, res) => {
    try {
        const panier = lireJSON(panierPath);
        const produits = lireJSON(produitsPath);
        
        // Ajouter les détails des produits au panier
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

// POST - Ajouter un produit au panier
app.post('/api/cart', (req, res) => {
    try {
        const { idProduit, quantite = 1 } = req.body;
        const panier = lireJSON(panierPath);
        
        // Vérifier si le produit existe déjà dans le panier
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

// PUT - Modifier la quantité d'un produit dans le panier
app.put('/api/cart/:id', (req, res) => {
    try {
        const { quantite } = req.body;
        const panier = lireJSON(panierPath);
        const item = panier.find(item => item.idProduit === req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
        }
        
        if (quantite <= 0) {
            // Supprimer le produit si la quantité est 0
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

// DELETE - Supprimer un produit du panier
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

// GET - Récupérer toutes les commandes
app.get('/api/orders', (req, res) => {
    try {
        const commandes = lireJSON(commandesPath);
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
});

// POST - Créer une nouvelle commande
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
        
        // Vider le panier après la commande
        ecrireJSON(panierPath, []);
        
        res.status(201).json(nouvelleCommande);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la commande' });
    }
});

// ====================
// DÉMARRAGE DU SERVEUR
// ====================

app.listen(PORT, () => {
    console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
    console.log(`📦 API Produits: http://localhost:${PORT}/api/products`);
    console.log(`🛒 API Panier: http://localhost:${PORT}/api/cart`);
    console.log(`📑 API Commandes: http://localhost:${PORT}/api/orders`);
});