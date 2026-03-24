/**
 * operations.js
 * Função: lidar com lógica assíncrona (geralmente usando redux-thunk).
 * Como funciona: aqui você combina service.js (requisições) com actions.js (disparo de ações).
 */

import {
  // Services
  pokemonSearchService,
  pokemonListService,
  battleService,
  favoritesService,
  pokemonUtils
} from './service';

import {
  // Pokemon Search Actions
  pokemonSearchRequest,
  pokemonSearchSuccess,
  pokemonSearchFailure,
  pokemonSearchClear,
  
  // Pokemon List Actions
  pokemonListRequest,
  pokemonListSuccess,
  pokemonListFailure,
  pokemonListLoadMore,
  pokemonListReset,
  
  // Battle Comparison Actions
  battleCompareRequest,
  battleCompareSuccess,
  battleCompareFailure,
  battleCompareClear,
  battleSetPokemon1,
  battleSetPokemon2,
  
  // Favorites Actions
  favoritesLoad,
  favoritesAdd,
  favoritesRemove,
  favoritesClearAll,
  
  // UI Actions
  setLoading,
  setError,
  clearError
} from './actions';

// =============================================================================
// POKEMON SEARCH OPERATIONS
// =============================================================================

/**
 * Operação para buscar um Pokémon específico
 */
export const searchPokemonOperation = (query) => {
  return async (dispatch) => {
    if (!query || query.trim() === '') {
      dispatch(pokemonSearchFailure(new Error('Query de busca não pode estar vazia')));
      return;
    }

    dispatch(pokemonSearchRequest(query));

    try {
      // Buscar dados básicos do Pokémon
      const pokemon = await pokemonSearchService.searchPokemon(query);
      
      // Buscar informações da espécie para descrição
      let species = null;
      try {
        species = await pokemonSearchService.getPokemonSpecies(pokemon.id);
      } catch (speciesError) {
        console.warn('Não foi possível carregar informações da espécie:', speciesError);
      }

      // Processar dados do Pokémon
      const processedPokemon = pokemonUtils.extractPokemonData(pokemon);
      
      dispatch(pokemonSearchSuccess(processedPokemon, species));
      
    } catch (error) {
      dispatch(pokemonSearchFailure(error));
    }
  };
};

/**
 * Operação para limpar resultados de busca
 */
export const clearSearchOperation = () => {
  return (dispatch) => {
    dispatch(pokemonSearchClear());
  };
};

// =============================================================================
// POKEMON LIST OPERATIONS
// =============================================================================

/**
 * Operação para carregar lista inicial de Pokémon
 */
export const loadPokemonListOperation = (limit = 20) => {
  return async (dispatch) => {
    dispatch(pokemonListRequest(0, limit));

    try {
      // Buscar lista básica
      const listData = await pokemonListService.getPokemonList(0, limit);
      
      // Buscar detalhes dos primeiros Pokémon
      const pokemonUrls = listData.results.map(pokemon => pokemon.url);
      const pokemonDetails = await pokemonListService.getPokemonDetails(pokemonUrls);
      
      // Processar dados
      const processedPokemon = pokemonDetails.map(pokemon => 
        pokemonUtils.extractPokemonData(pokemon)
      );
      
      const hasMore = listData.next !== null;
      
      dispatch(pokemonListSuccess(processedPokemon, hasMore, limit));
      
    } catch (error) {
      dispatch(pokemonListFailure(error));
    }
  };
};

/**
 * Operação para carregar mais Pokémon (paginação)
 */
export const loadMorePokemonOperation = () => {
  return async (dispatch, getState) => {
    const { list } = getState().pokemon;
    
    if (list.isLoading || !list.hasMore) {
      return;
    }

    const newOffset = list.offset;
    
    dispatch(setLoading('loadMore', true));

    try {
      // Buscar próxima página
      const listData = await pokemonListService.getPokemonList(newOffset, list.limit);
      
      // Buscar detalhes
      const pokemonUrls = listData.results.map(pokemon => pokemon.url);
      const pokemonDetails = await pokemonListService.getPokemonDetails(pokemonUrls);
      
      // Processar dados
      const processedPokemon = pokemonDetails.map(pokemon => 
        pokemonUtils.extractPokemonData(pokemon)
      );
      
      dispatch(pokemonListLoadMore(processedPokemon, newOffset + list.limit));
      dispatch(setLoading('loadMore', false));
      
    } catch (error) {
      dispatch(pokemonListFailure(error));
      dispatch(setLoading('loadMore', false));
    }
  };
};

/**
 * Operação para resetar lista de Pokémon
 */
export const resetPokemonListOperation = () => {
  return (dispatch) => {
    dispatch(pokemonListReset());
  };
};

// =============================================================================
// BATTLE COMPARISON OPERATIONS
// =============================================================================

/**
 * Operação para comparar dois Pokémon
 */
export const comparePokemonOperation = (pokemon1Name, pokemon2Name) => {
  return async (dispatch) => {
    if (!pokemon1Name || !pokemon2Name) {
      dispatch(battleCompareFailure(new Error('Dois Pokémon são necessários para comparação')));
      return;
    }

    if (pokemon1Name.toLowerCase() === pokemon2Name.toLowerCase()) {
      dispatch(battleCompareFailure(new Error('Selecione Pokémon diferentes para comparação')));
      return;
    }

    dispatch(battleCompareRequest(pokemon1Name, pokemon2Name));

    try {
      // Buscar dados dos dois Pokémon
      const comparisonData = await battleService.comparePokemon(pokemon1Name, pokemon2Name);
      
      // Processar dados
      const processedPokemon1 = pokemonUtils.extractPokemonData(comparisonData.pokemon1);
      const processedPokemon2 = pokemonUtils.extractPokemonData(comparisonData.pokemon2);
      
      // Calcular comparação
      const comparison = calculatePokemonComparison(processedPokemon1, processedPokemon2);
      
      dispatch(battleCompareSuccess(processedPokemon1, processedPokemon2, comparison));
      
    } catch (error) {
      dispatch(battleCompareFailure(error));
    }
  };
};

/**
 * Operação para definir Pokémon 1 na batalha
 */
export const setPokemon1Operation = (pokemon) => {
  return (dispatch, getState) => {
    dispatch(battleSetPokemon1(pokemon));
    
    // Se já temos pokemon2, fazer comparação automática
    const { battle } = getState().pokemon;
    if (battle.pokemon2) {
      dispatch(comparePokemonOperation(pokemon.name, battle.pokemon2.name));
    }
  };
};

/**
 * Operação para definir Pokémon 2 na batalha
 */
export const setPokemon2Operation = (pokemon) => {
  return (dispatch, getState) => {
    dispatch(battleSetPokemon2(pokemon));
    
    // Se já temos pokemon1, fazer comparação automática
    const { battle } = getState().pokemon;
    if (battle.pokemon1) {
      dispatch(comparePokemonOperation(battle.pokemon1.name, pokemon.name));
    }
  };
};

/**
 * Operação para limpar comparação de batalha
 */
export const clearBattleComparisonOperation = () => {
  return (dispatch) => {
    dispatch(battleCompareClear());
  };
};

// =============================================================================
// FAVORITES OPERATIONS
// =============================================================================

/**
 * Operação para carregar favoritos do localStorage
 */
export const loadFavoritesOperation = () => {
  return (dispatch) => {
    try {
      const favorites = favoritesService.loadFavorites();
      dispatch(favoritesLoad(favorites));
    } catch (error) {
      dispatch(setError('favorites', 'Erro ao carregar favoritos'));
    }
  };
};

/**
 * Operação para adicionar Pokémon aos favoritos
 */
export const addToFavoritesOperation = (newFavoritePokemon) => {
  return (dispatch, getState) => {
    try {
      const { favorites } = getState().pokemon;

      // Verificar se já está nos favoritos
      const isAlreadyFavorite = favorites?.items.some(fav => fav?.id === newFavoritePokemon?.id);

      if (isAlreadyFavorite) {
        dispatch(setError('favorites', 'Pokémon já está nos favoritos'));
        return;
      }
      
      // Adicionar aos favoritos
      const favoriteData = {
        id: newFavoritePokemon?.id,
        name: newFavoritePokemon?.name,
        image: newFavoritePokemon?.image,
        types: newFavoritePokemon?.types,
        addedAt: new Date().toISOString()
      };

      console.log(favorites);
      console.log(newFavoritePokemon);
      
      favoritesService.addToFavorites(favoriteData);
      dispatch(favoritesAdd(favoriteData));
      
    } catch (error) {
      console.log(error);
      dispatch(setError('favorites', 'Erro ao adicionar aos favoritos'));
    }
  };
};

/**
 * Operação para remover Pokémon dos favoritos
 */
export const removeFromFavoritesOperation = (pokemonId) => {
  return (dispatch) => {
    try {
      favoritesService.removeFromFavorites(pokemonId);
      dispatch(favoritesRemove(pokemonId));
    } catch (error) {
      dispatch(setError('favorites', 'Erro ao remover dos favoritos'));
    }
  };
};

/**
 * Operação para limpar todos os favoritos
 */
export const clearAllFavoritesOperation = () => {
  return (dispatch) => {
    try {
      favoritesService.saveFavorites([]);
      dispatch(favoritesClearAll());
    } catch (error) {
      dispatch(setError('favorites', 'Erro ao limpar favoritos'));
    }
  };
};

// =============================================================================
// UTILITY OPERATIONS
// =============================================================================

/**
 * Operação para limpar todos os erros
 */
export const clearAllErrorsOperation = () => {
  return (dispatch) => {
    dispatch(clearError('search'));
    dispatch(clearError('list'));
    dispatch(clearError('battle'));
    dispatch(clearError('favorites'));
  };
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calcula comparação detalhada entre dois Pokémon
 */
function calculatePokemonComparison(pokemon1, pokemon2) {
  const stats1 = pokemon1.stats;
  const stats2 = pokemon2.stats;
  
  const totalPower1 = pokemonUtils.calculateTotalPower(stats1);
  const totalPower2 = pokemonUtils.calculateTotalPower(stats2);
  
  const statComparisons = {};
  Object.keys(stats1).forEach(statName => {
    const value1 = stats1[statName];
    const value2 = stats2[statName];
    
    statComparisons[statName] = {
      pokemon1: value1,
      pokemon2: value2,
      winner: value1 > value2 ? 'pokemon1' : value1 < value2 ? 'pokemon2' : 'tie',
      difference: Math.abs(value1 - value2)
    };
  });
  
  return {
    totalPower: {
      pokemon1: totalPower1,
      pokemon2: totalPower2,
      winner: totalPower1 > totalPower2 ? 'pokemon1' : totalPower1 < totalPower2 ? 'pokemon2' : 'tie',
      difference: Math.abs(totalPower1 - totalPower2)
    },
    statComparisons,
    advantages: {
      pokemon1: Object.values(statComparisons).filter(comp => comp.winner === 'pokemon1').length,
      pokemon2: Object.values(statComparisons).filter(comp => comp.winner === 'pokemon2').length,
      ties: Object.values(statComparisons).filter(comp => comp.winner === 'tie').length
    }
  };
}
