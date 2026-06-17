const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Initialisation
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

console.log('🚀 Démarrage du serveur MiniShop API...');
console.log(`📂 Répertoire: ${__dirname}`);

// Chemins des fichiers JSON
const DATA_DIR = path.join(__dirname, 'data');
const produitsPath = path.join(DATA_DIR, 'produits.json');
const panierPath = path.join(DATA_DIR, 'panier.json');
const commandesPath = path.join(DATA_DIR, 'commandes.json');

// Vérifier que le dossier data existe
if (!fs.existsSync(DATA_DIR)) {
    console.log('📁 Création du dossier data...');
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Fonctions utilitaires
const lireJSON = (fichier) => {
    try {
        if (fs.existsSync(fichier)) {
            const data = fs.readFileSync(fichier, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error(`Erreur lecture ${fichier}:`, error.message);
        return [];
    }
};

const ecrireJSON = (fichier, data) => {
    try {
        fs.writeFileSync(fichier, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Erreur écriture ${fichier}:`, error.message);
        return false;
    }
};

const genererID = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// =============================================
// ROUTES PRINCIPALES (pour tester)
// =============================================

// Route racine - IMPORTANT pour Render
app.get('/', (req, res) => {
    res.json({
        name: 'MiniShop API',
        version: '1.0.0',
        status: 'online',
        endpoints: {
            health: '/api/health',
            products: '/api/products',
            product: '/api/products/:id',
            cart: '/api/cart',
            orders: '/api/orders'
        },
        documentation: 'https://github.com/votre-username/minishop-ecommerce'
    });
});

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'MiniShop API est en ligne ! 🚀',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// =============================================
// ROUTES PRODUITS
// =============================================

app.get('/api/products', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        res.json(produits);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

app.get('/api/products/:id', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        const produit = produits.find(p => p.id === req.params.id);
        if (!produit) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(produit);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

app.post('/api/products', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        const nouveauProduit = {
            id: genererID(),
            nom: req.body.nom,
            prix: parseFloat(req.body.prix) || 0,
            description: req.body.description || '',
            image: req.body.image || 'https://via.placeholder.com/400',
            stock: parseInt(req.body.stock) || 0
        };
        produits.push(nouveauProduit);
        ecrireJSON(produitsPath, produits);
        res.status(201).json(nouveauProduit);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

app.put('/api/products/:id', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        const index = produits.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        produits[index] = { ...produits[index], ...req.body };
        ecrireJSON(produitsPath, produits);
        res.json(produits[index]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

app.delete('/api/products/:id', (req, res) => {
    try {
        const produits = lireJSON(produitsPath);
        const filtered = produits.filter(p => p.id !== req.params.id);
        if (filtered.length === produits.length) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        ecrireJSON(produitsPath, filtered);
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// =============================================
// ROUTES PANIER
// =============================================

app.get('/api/cart', (req, res) => {
    try {
        const panier = lireJSON(panierPath);
        const produits = lireJSON(produitsPath);
        const result = panier.map(item => {
            const produit = produits.find(p => p.id === item.idProduit);
            return { ...item, produit: produit || null };
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

app.post('/api/cart', (req, res) => {
    try {
        const { idProduit, quantite = 1 } = req.body;
        if (!idProduit) {
            return res.status(400).json({ error: 'idProduit requis' });
        }
        const panier = lireJSON(panierPath);
        const existing = panier.find(item => item.idProduit === idProduit);
        if (existing) {
            existing.quantite += quantite;
        } else {
            panier.push({ idProduit, quantite });
        }
        ecrireJSON(panierPath, panier);
        res.status(201).json({ message: 'Produit ajouté au panier' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

app.put('/api/cart/:id', (req, res) => {
    try {
        const { quantite } = req.body;
        const panier = lireJSON(panierPath);
        const item = panier.find(item => item.idProduit === req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Produit non trouvé dans le panier' });
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
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

app.delete('/api/cart/:id', (req, res) => {
    try {
        const panier = lireJSON(panierPath);
        const newPanier = panier.filter(item => item.idProduit !== req.params.id);
        ecrireJSON(panierPath, newPanier);
        res.json({ message: 'Produit supprimé du panier' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// =============================================
// ROUTES COMMANDES
// =============================================

app.get('/api/orders', (req, res) => {
    try {
        const commandes = lireJSON(commandesPath);
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

app.post('/api/orders', (req, res) => {
    try {
        const commandes = lireJSON(commandesPath);
        const nouvelleCommande = {
            idCommande: genererID(),
            produits: req.body.produits || [],
            total: parseFloat(req.body.total) || 0,
            date: new Date().toISOString()
        };
        commandes.push(nouvelleCommande);
        ecrireJSON(commandesPath, commandes);
        ecrireJSON(panierPath, []);
        res.status(201).json(nouvelleCommande);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// =============================================
// GESTION DES ERREURS 404
// =============================================

app.use((req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        path: req.path,
        available: [
            '/',
            '/api/health',
            '/api/products',
            '/api/products/:id',
            '/api/cart',
            '/api/orders'
        ]
    });
});

// =============================================
// DÉMARRAGE DU SERVEUR
// =============================================

// Créer les fichiers data s'ils n'existent pas
if (!fs.existsSync(produitsPath)) {
    console.log('📦 Création du fichier produits.json...');
    const produitsInit = [
        {
            id: "1",
            nom: "Smartphone Pro Max",
            prix: 899.99,
            description: "Le smartphone le plus puissant avec un écran OLED 6.7\"",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            stock: 15
        },
        {
            id: "2",
            nom: "Casque Audio Premium",
            prix: 149.99,
            description: "Casque audio sans fil avec réduction de bruit active",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            stock: 30
        }
    ];
    ecrireJSON(produitsPath, produitsInit);
}

if (!fs.existsSync(panierPath)) {
    ecrireJSON(panierPath, []);
}

if (!fs.existsSync(commandesPath)) {
    ecrireJSON(commandesPath, []);
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Serveur démarré avec succès !`);
    console.log(`🚀 http://localhost:${PORT}`);
    console.log(`🌐 Environnement: ${process.env.NODE_ENV || 'development'}`);
});
