import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadPokemonListOperation,
  loadMorePokemonOperation,
  addToFavoritesOperation
} from '../redux/pokemon/operations';
import {
  selectListIsLoading,
  selectPokemonList,
  selectListHasMore,
  selectListError,
  selectListPagination,
  selectFavoritesList,
  selectIsLoadingSection
} from '../redux/pokemon/selectors';

/**
 * TELA 2: POKEMON LIST
 * Demonstra fluxo Redux para listagem paginada de Pokémon
 * Fluxo: Mount component -> action -> service (API) -> reducer -> UI lista
 */
const PokemonList = () => {
  const dispatch = useDispatch();
  
  // Selectors para acessar o estado Redux
  const isLoading = useSelector(selectListIsLoading);
  const pokemonList = useSelector(selectPokemonList);
  const hasMore = useSelector(selectListHasMore);
  const error = useSelector(selectListError);
  const pagination = useSelector(selectListPagination);
  const favorites = useSelector(selectFavoritesList);
  const isLoadingMore = useSelector(state => selectIsLoadingSection(state, 'loadMore'));

  // Carregar lista inicial na montagem do componente
  useEffect(() => {
    if (pokemonList.length === 0) {
      dispatch(loadPokemonListOperation(20));
    }
  }, [dispatch, pokemonList.length]);

  // Handler para carregar mais Pokémon
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      dispatch(loadMorePokemonOperation());
    }
  };

  // Handler para adicionar aos favoritos
  const handleAddToFavorites = (pokemon) => {
    dispatch(addToFavoritesOperation(pokemon));
  };

  // Verificar se um Pokémon é favorito
  const isPokemonFavorite = (pokemonId) => {
    return favorites.some(fav => fav.id === pokemonId);
  };

  // Componente de card do Pokémon
  const PokemonCard = ({ pokemon }) => (
    <div className="card pokemon-card">
      <img 
        src={pokemon.image} 
        alt={pokemon.name}
        className="pokemon-image"
      />
      <h3 className="pokemon-name">
        #{pokemon.id.toString().padStart(3, '0')} {pokemon.name}
      </h3>
      <div className="pokemon-types">
        {pokemon.types.map(type => (
          <span key={type} className="pokemon-type">
            {type}
          </span>
        ))}
      </div>
      <div className="stats-grid" style={{ marginTop: '10px' }}>
        <div className="stat-item">
          <div className="stat-name">HP</div>
          <div className="stat-value">{pokemon.stats.hp}</div>
        </div>
        <div className="stat-item">
          <div className="stat-name">Attack</div>
          <div className="stat-value">{pokemon.stats.attack}</div>
        </div>
        <div className="stat-item">
          <div className="stat-name">Defense</div>
          <div className="stat-value">{pokemon.stats.defense}</div>
        </div>
        <div className="stat-item">
          <div className="stat-name">Speed</div>
          <div className="stat-value">{pokemon.stats.speed}</div>
        </div>
      </div>
      <button
        onClick={() => handleAddToFavorites(pokemon)}
        className={`btn ${isPokemonFavorite(pokemon.id) ? 'btn-secondary' : 'btn-primary'}`}
        disabled={isPokemonFavorite(pokemon.id)}
        style={{ marginTop: '10px', width: '100%' }}
      >
        {isPokemonFavorite(pokemon.id) ? '❤️ Favorito' : '🤍 Favoritar'}
      </button>
    </div>
  );

  return (
    <div className="pokemon-list">
      <h1>📋 Lista de Pokémon</h1>
      <p>Explore a lista completa de Pokémon da primeira geração e adicione seus favoritos!</p>

      {/* Informações de paginação */}
      <div className="pagination-info" style={{ margin: '20px 0', textAlign: 'center' }}>
        <span className="page-info">
          Página {pagination.currentPage} • {pagination.totalLoaded} Pokémon carregados
          {hasMore && ' • Mais disponíveis'}
        </span>
      </div>

      {/* Estado de loading inicial */}
      {isLoading && pokemonList.length === 0 && (
        <div className="loading">
          🔄 Carregando lista de Pokémon...
        </div>
      )}

      {/* Estado de erro */}
      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      {/* Lista de Pokémon */}
      {pokemonList.length > 0 && (
        <>
          <div className="grid">
            {pokemonList.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          {/* Botão para carregar mais */}
          <div className="pagination">
            {hasMore && (
              <button
                onClick={handleLoadMore}
                className="btn btn-primary"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? '🔄 Carregando...' : '📄 Carregar Mais'}
              </button>
            )}
            
            {!hasMore && pokemonList.length > 0 && (
              <div className="page-info">
                🎉 Todos os Pokémon foram carregados!
              </div>
            )}
          </div>
        </>
      )}

      {/* Estado vazio (não deveria acontecer com a API do Pokémon) */}
      {!isLoading && pokemonList.length === 0 && !error && (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>📋 Lista Vazia</h3>
            <p>Não foi possível carregar a lista de Pokémon.</p>
            <button 
              onClick={() => dispatch(loadPokemonListOperation(20))}
              className="btn btn-primary"
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Informações sobre Redux Flow */}
      <div className="card" style={{ marginTop: '30px', backgroundColor: '#f8f9fa' }}>
        <h3>🔧 Fluxo Redux Demonstrado</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Mount do Componente:</strong> useEffect dispara loadPokemonListOperation</li>
          <li><strong>Service:</strong> pokemonListService.getPokemonList() busca dados da API</li>
          <li><strong>Actions:</strong> POKEMON_LIST_REQUEST → SUCCESS/FAILURE</li>
          <li><strong>Reducer:</strong> Atualiza estado com lista de Pokémon</li>
          <li><strong>Selectors:</strong> Componente reage às mudanças de estado</li>
          <li><strong>Paginação:</strong> loadMorePokemonOperation adiciona mais itens ao estado</li>
        </ul>
      </div>
    </div>
  );
};

export default PokemonList;
