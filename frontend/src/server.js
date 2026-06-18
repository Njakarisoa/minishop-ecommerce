
// =============================================
// ROUTES UTILISATEURS
// =============================================

const usersPath = path.join(__dirname, 'data', 'users.json');

// GET - Récupérer tous les utilisateurs
app.get('/api/users', (req, res) => {
    try {
        const users = lireJSON(usersPath);
        // Ne pas renvoyer les mots de passe en production
        const safeUsers = users.map(u => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
        });
        res.json(safeUsers);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});

// POST - Sauvegarder tous les utilisateurs
app.post('/api/users', (req, res) => {
    try {
        const { users } = req.body;
        if (!users || !Array.isArray(users)) {
            return res.status(400).json({ error: 'Données invalides' });
        }
        ecrireJSON(usersPath, users);
        res.json({ message: 'Utilisateurs sauvegardés' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la sauvegarde des utilisateurs' });
    }
});
