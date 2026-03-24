import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromFavoritesOperation,
  clearAllFavoritesOperation
} from '../redux/pokemon/operations';
import {
  selectFavoritesList,
  selectFavoritesCount,
  selectFavoritesStatistics,
  selectFavoritesError
} from '../redux/pokemon/selectors';

/**
 * TELA 3: FAVORITES SCREEN
 * Demonstra fluxo Redux para gerenciamento de estado local (localStorage)
 * Fluxo: Local Storage ↔ Redux State ↔ UI
 */
const FavoritesScreen = () => {
  const dispatch = useDispatch();
  
  // Selectors para acessar o estado Redux
  const favorites = useSelector(selectFavoritesList);
  const favoritesCount = useSelector(selectFavoritesCount);
  const statistics = useSelector(selectFavoritesStatistics);
  const error = useSelector(selectFavoritesError);

  // Handler para remover favorito
  const handleRemoveFavorite = (pokemonId) => {
    dispatch(removeFromFavoritesOperation(pokemonId));
  };

  // Handler para limpar todos os favoritos
  const handleClearAllFavorites = () => {
    if (window.confirm('Tem certeza que deseja remover todos os favoritos?')) {
      dispatch(clearAllFavoritesOperation());
    }
  };

  // Componente de card de favorito
  const FavoriteCard = ({ pokemon }) => (
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
      {pokemon.addedAt && (
        <div style={{ fontSize: '0.8rem', color: '#666', margin: '10px 0' }}>
          Adicionado: {new Date(pokemon.addedAt).toLocaleDateString('pt-BR')}
        </div>
      )}
      <button
        onClick={() => handleRemoveFavorite(pokemon.id)}
        className="btn btn-danger"
        style={{ width: '100%' }}
      >
        💔 Remover dos Favoritos
      </button>
    </div>
  );

  return (
    <div className="favorites-screen">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1>❤️ Meus Favoritos</h1>
          <p>Gerencie sua coleção pessoal de Pokémon favoritos.</p>
        </div>
        {favoritesCount > 0 && (
          <button
            onClick={handleClearAllFavorites}
            className="btn btn-danger"
          >
            🗑️ Limpar Todos ({favoritesCount})
          </button>
        )}
      </div>

      {/* Estado de erro */}
      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      {/* Estatísticas dos favoritos */}
      {statistics && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>📊 Estatísticas da Coleção</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-name">Total</div>
              <div className="stat-value">{statistics.totalFavorites}</div>
            </div>
            <div className="stat-item">
              <div className="stat-name">Tipo Mais Comum</div>
              <div className="stat-value">{statistics.mostCommonType}</div>
            </div>
            <div className="stat-item">
              <div className="stat-name">Mais Recente</div>
              <div className="stat-value">{statistics.newestFavorite?.name}</div>
            </div>
            <div className="stat-item">
              <div className="stat-name">Primeiro</div>
              <div className="stat-value">{statistics.oldestFavorite?.name}</div>
            </div>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <h4>Distribuição por Tipo:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
              {Object.entries(statistics.typeDistribution).map(([type, count]) => (
                <span key={type} className="pokemon-type">
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lista de favoritos */}
      {favoritesCount > 0 ? (
        <div className="grid">
          {favorites.map((pokemon) => (
            <FavoriteCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      ) : (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3>💔 Nenhum Favorito Ainda</h3>
            <p>Você ainda não adicionou nenhum Pokémon aos seus favoritos.</p>
            <div style={{ margin: '20px 0' }}>
              <strong>Como adicionar favoritos:</strong>
              <ul style={{ textAlign: 'left', display: 'inline-block', margin: '10px 0' }}>
                <li>Use a tela de <strong>Buscar</strong> para encontrar um Pokémon específico</li>
                <li>Navegue pela <strong>Lista</strong> para explorar vários Pokémon</li>
                <li>Clique no botão "🤍 Adicionar aos favoritos" em qualquer Pokémon</li>
                <li>Eles aparecerão aqui automaticamente!</li>
              </ul>
            </div>
            <div style={{ marginTop: '30px' }}>
              <a href="/" className="btn btn-primary" style={{ textDecoration: 'none', marginRight: '10px' }}>
                🔍 Ir para Busca
              </a>
              <a href="/list" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                📋 Ver Lista
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Informações sobre Redux Flow */}
      <div className="card" style={{ marginTop: '30px', backgroundColor: '#f8f9fa' }}>
        <h3>🔧 Fluxo Redux Demonstrado</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Local Storage:</strong> favoritesService gerencia persistência local</li>
          <li><strong>Add Favorite:</strong> FAVORITES_ADD action atualiza estado e localStorage</li>
          <li><strong>Remove Favorite:</strong> FAVORITES_REMOVE action remove do estado e localStorage</li>
          <li><strong>Selectors:</strong> selectFavoritesStatistics calcula estatísticas em tempo real</li>
          <li><strong>Sincronização:</strong> Estado Redux sincronizado com localStorage</li>
          <li><strong>Reatividade:</strong> UI atualiza automaticamente quando estado muda</li>
        </ul>
      </div>
    </div>
  );
};

export default FavoritesScreen;
