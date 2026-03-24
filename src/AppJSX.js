import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navigation from './components/Navigation';
import PokemonSearch from './components/PokemonSearch';
import PokemonList from './components/PokemonList';
import FavoritesScreen from './components/FavoritesScreen';
import BattleComparison from './components/BattleComparison';
import { loadFavoritesOperation } from './redux/pokemon/operations';

/**
 * Componente principal da aplicação (versão melhorada)
 * Usando React.createElement para compatibilidade total
 */
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Carregar favoritos do localStorage na inicialização
    dispatch(loadFavoritesOperation());
  }, [dispatch]);

  return React.createElement('div', { className: 'App' },
    React.createElement(Navigation, null),
    React.createElement('div', { className: 'container' },
      React.createElement(Routes, null,
        React.createElement(Route, { 
          path: '/', 
          element: React.createElement(PokemonSearch, null) 
        }),
        React.createElement(Route, { 
          path: '/search', 
          element: React.createElement(PokemonSearch, null) 
        }),
        React.createElement(Route, { 
          path: '/list', 
          element: React.createElement(PokemonList, null) 
        }),
        React.createElement(Route, { 
          path: '/favorites', 
          element: React.createElement(FavoritesScreen, null) 
        }),
        React.createElement(Route, { 
          path: '/battle', 
          element: React.createElement(BattleComparison, null) 
        })
      )
    )
  );
}

export default App;
