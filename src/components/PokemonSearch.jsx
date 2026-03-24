import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  searchPokemonOperation,
  clearSearchOperation,
  addToFavoritesOperation
} from '../redux/pokemon/operations';
import {
  selectSearchIsLoading,
  selectSearchPokemonWithDetails,
  selectSearchError,
  selectIsPokemonFavorite
} from '../redux/pokemon/selectors';

/**
 * TELA 1: POKEMON SEARCH
 * Demonstra fluxo Redux para busca de Pokémon individual
 * Fluxo: Input do usuário -> action -> service -> reducer -> UI atualizada
 */
const PokemonSearch = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selectors para acessar o estado Redux
  const isLoading = useSelector(selectSearchIsLoading);
  const pokemon = useSelector(selectSearchPokemonWithDetails);
  const error = useSelector(selectSearchError);
  const isFavorite = useSelector(state => 
    pokemon ? selectIsPokemonFavorite(state, pokemon.id) : false
  );

  // Handler para busca
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchPokemonOperation(searchQuery.trim()));
    }
  };

  // Handler para limpar busca
  const handleClear = () => {
    setSearchQuery('');
    dispatch(clearSearchOperation());
  };

  // Handler para adicionar aos favoritos
  const handleAddToFavorites = () => {
    if (pokemon) {
      dispatch(addToFavoritesOperation(pokemon));
    }
  };

  return (
    <div className="pokemon-search">
      <h1>🔍 Buscar Pokémon</h1>
      <p>Digite o nome ou número de um Pokémon para buscar suas informações detalhadas.</p>

      {/* Formulário de busca */}
      <form onSubmit={handleSearch} className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ex: pikachu, 25, charizard..."
          className="search-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading || !searchQuery.trim()}
        >
          {isLoading ? '🔄 Buscando...' : '🔍 Buscar'}
        </button>
        {pokemon && (
          <button 
            type="button" 
            onClick={handleClear}
            className="btn btn-secondary"
          >
            🗑️ Limpar
          </button>
        )}
      </form>

      {/* Estados de loading e erro */}
      {isLoading && (
        <div className="loading">
          🔄 Buscando Pokémon...
        </div>
      )}

      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      {/* Resultado da busca */}
      {pokemon && !isLoading && (
        <div className="card">
          <div className="pokemon-details">
            <div className="pokemon-header">
              <div className="pokemon-image-container">
                <img 
                  src={pokemon.image} 
                  alt={pokemon.name}
                  className="pokemon-image"
                />
              </div>
              <div className="pokemon-info">
                <h2 className="pokemon-name">
                  #{pokemon.id.toString().padStart(3, '0')} {pokemon.name}
                </h2>
                <p className="pokemon-genus">{pokemon.genus}</p>
                <div className="pokemon-types">
                  {pokemon.types.map(type => (
                    <span key={type} className="pokemon-type">
                      {type}
                    </span>
                  ))}
                </div>
                <button
                  onClick={handleAddToFavorites}
                  className={`btn ${isFavorite ? 'btn-secondary' : 'btn-primary'}`}
                  disabled={isFavorite}
                >
                  {isFavorite ? '❤️ Já é favorito' : '🤍 Adicionar aos favoritos'}
                </button>
              </div>
            </div>

            {/* Descrição */}
            <div className="pokemon-description">
              <h3>Descrição</h3>
              <p>{pokemon.description}</p>
            </div>

            {/* Estatísticas */}
            <div className="pokemon-stats">
              <h3>Estatísticas Base</h3>
              <div className="stats-grid">
                {Object.entries(pokemon.stats).map(([statName, statValue]) => (
                  <div key={statName} className="stat-item">
                    <div className="stat-name">{statName.replace('-', ' ')}</div>
                    <div className="stat-value">{statValue}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informações físicas */}
            <div className="pokemon-physical">
              <h3>Informações Físicas</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-name">Altura</div>
                  <div className="stat-value">{pokemon.height / 10} m</div>
                </div>
                <div className="stat-item">
                  <div className="stat-name">Peso</div>
                  <div className="stat-value">{pokemon.weight / 10} kg</div>
                </div>
                <div className="stat-item">
                  <div className="stat-name">Taxa de Captura</div>
                  <div className="stat-value">{pokemon.captureRate}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-name">Felicidade Base</div>
                  <div className="stat-value">{pokemon.baseHappiness}</div>
                </div>
              </div>
            </div>

            {/* Habilidades */}
            <div className="pokemon-abilities">
              <h3>Habilidades</h3>
              <div className="abilities-list">
                {pokemon.abilities.map(ability => (
                  <span key={ability} className="pokemon-type">
                    {ability.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {!pokemon && !isLoading && !error && (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>🎮 Bem-vindo à Pokédex!</h3>
            <p>Use o campo de busca acima para encontrar informações detalhadas sobre qualquer Pokémon.</p>
            <div style={{ margin: '20px 0' }}>
              <strong>Exemplos de busca:</strong>
              <ul style={{ textAlign: 'left', display: 'inline-block', margin: '10px 0' }}>
                <li>Por nome: pikachu, charizard, bulbasaur</li>
                <li>Por número: 1, 25, 150</li>
                <li>Nomes em inglês funcionam melhor</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonSearch;
