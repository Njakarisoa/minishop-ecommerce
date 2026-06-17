import React, { useState } from 'react';
import '../styles/SearchBar.css';

function SearchBar({ onRecherche }) {
  const [terme, setTerme] = useState('');

  const handleChangement = (e) => {
    const valeur = e.target.value;
    setTerme(valeur);
    onRecherche(valeur);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Rechercher un produit..."
        value={terme}
        onChange={handleChangement}
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;