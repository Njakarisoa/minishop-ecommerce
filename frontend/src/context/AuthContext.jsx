import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      try {
        setUtilisateur(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('utilisateur');
      }
    }
    setLoading(false);
  }, []);

  const register = async (email, password, confirmPassword, nom, prenom) => {
    setError(null);
    
    if (!email || !password || !confirmPassword || !nom || !prenom) {
      setError('Tous les champs sont obligatoires');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    try {
      const response = await fetch('https://minishop-api-u8nx.onrender.com/api/users');
      let users = [];
      if (response.ok) {
        users = await response.json();
      }

      if (users.find(u => u.email === email)) {
        setError('Cet email est déjà utilisé');
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        nom,
        prenom,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);

      await fetch('https://minishop-api-u8nx.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users })
      });

      const userData = {
        id: newUser.id,
        email: newUser.email,
        nom: newUser.nom,
        prenom: newUser.prenom
      };
      
      setUtilisateur(userData);
      localStorage.setItem('utilisateur', JSON.stringify(userData));
      setError(null);
      return true;

    } catch (err) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      console.error(err);
      return false;
    }
  };

  const login = async (email, password) => {
    setError(null);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return false;
    }

    try {
      const response = await fetch('https://minishop-api-u8nx.onrender.com/api/users');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      const users = await response.json();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        setError('Email ou mot de passe incorrect');
        return false;
      }

      const userData = {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom
      };

      setUtilisateur(userData);
      localStorage.setItem('utilisateur', JSON.stringify(userData));
      setError(null);
      return true;

    } catch (err) {
      setError('Erreur lors de la connexion. Veuillez réessayer.');
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    setUtilisateur(null);
    localStorage.removeItem('utilisateur');
    setError(null);
  };

  const value = {
    utilisateur,
    loading,
    error,
    register,
    login,
    logout,
    setError,
    isAuthenticated: !!utilisateur
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
