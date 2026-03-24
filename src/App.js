import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navigation from './components/Navigation';
import PokemonSearch from './components/PokemonSearch';
import PokemonList from './components/PokemonList';
import FavoritesScreen from './components/FavoritesScreen';
import BattleComparison from './components/BattleComparison';
import { loadFavoritesOperation } from './redux/pokemon/operations';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Carregar favoritos do localStorage na inicialização
    dispatch(loadFavoritesOperation());
  }, [dispatch]);

  return (
    <div className="App">
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<PokemonSearch />} />
          <Route path="/search" element={<PokemonSearch />} />
          <Route path="/list" element={<PokemonList />} />
          <Route path="/favorites" element={<FavoritesScreen />} />
          <Route path="/battle" element={<BattleComparison />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
