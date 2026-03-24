/**
 * actions.js
 * Função: definir as ações do Redux.
 * O que são ações: objetos que descrevem o que aconteceu na aplicação 
 * (não dizem como mudar o estado, só descrevem o evento).
 */

// Action Types - Pokemon Search
export const POKEMON_SEARCH_REQUEST = 'POKEMON_SEARCH_REQUEST';
export const POKEMON_SEARCH_SUCCESS = 'POKEMON_SEARCH_SUCCESS';
export const POKEMON_SEARCH_FAILURE = 'POKEMON_SEARCH_FAILURE';
export const POKEMON_SEARCH_CLEAR = 'POKEMON_SEARCH_CLEAR';

// Action Types - Pokemon List
export const POKEMON_LIST_REQUEST = 'POKEMON_LIST_REQUEST';
export const POKEMON_LIST_SUCCESS = 'POKEMON_LIST_SUCCESS';
export const POKEMON_LIST_FAILURE = 'POKEMON_LIST_FAILURE';
export const POKEMON_LIST_LOAD_MORE = 'POKEMON_LIST_LOAD_MORE';
export const POKEMON_LIST_RESET = 'POKEMON_LIST_RESET';

// Action Types - Battle Comparison
export const BATTLE_COMPARE_REQUEST = 'BATTLE_COMPARE_REQUEST';
export const BATTLE_COMPARE_SUCCESS = 'BATTLE_COMPARE_SUCCESS';
export const BATTLE_COMPARE_FAILURE = 'BATTLE_COMPARE_FAILURE';
export const BATTLE_COMPARE_CLEAR = 'BATTLE_COMPARE_CLEAR';
export const BATTLE_SET_POKEMON_1 = 'BATTLE_SET_POKEMON_1';
export const BATTLE_SET_POKEMON_2 = 'BATTLE_SET_POKEMON_2';

// Action Types - Favorites
export const FAVORITES_LOAD = 'FAVORITES_LOAD';
export const FAVORITES_ADD = 'FAVORITES_ADD';
export const FAVORITES_REMOVE = 'FAVORITES_REMOVE';
export const FAVORITES_CLEAR_ALL = 'FAVORITES_CLEAR_ALL';

// Action Types - UI State
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

// =============================================================================
// POKEMON SEARCH ACTIONS
// =============================================================================

export const pokemonSearchRequest = (query) => ({
  type: POKEMON_SEARCH_REQUEST,
  payload: { query }
});

export const pokemonSearchSuccess = (pokemon, species) => ({
  type: POKEMON_SEARCH_SUCCESS,
  payload: { 
    pokemon,
    species,
    timestamp: Date.now()
  }
});

export const pokemonSearchFailure = (error) => ({
  type: POKEMON_SEARCH_FAILURE,
  payload: { 
    error: error.message || 'Erro desconhecido',
    timestamp: Date.now()
  }
});

export const pokemonSearchClear = () => ({
  type: POKEMON_SEARCH_CLEAR
});

// =============================================================================
// POKEMON LIST ACTIONS
// =============================================================================

export const pokemonListRequest = (offset, limit) => ({
  type: POKEMON_LIST_REQUEST,
  payload: { offset, limit }
});

export const pokemonListSuccess = (pokemonList, hasMore, offset) => ({
  type: POKEMON_LIST_SUCCESS,
  payload: { 
    pokemonList,
    hasMore,
    offset,
    timestamp: Date.now()
  }
});

export const pokemonListFailure = (error) => ({
  type: POKEMON_LIST_FAILURE,
  payload: { 
    error: error.message || 'Erro ao carregar lista',
    timestamp: Date.now()
  }
});

export const pokemonListLoadMore = (pokemonList, offset) => ({
  type: POKEMON_LIST_LOAD_MORE,
  payload: { 
    pokemonList,
    offset,
    timestamp: Date.now()
  }
});

export const pokemonListReset = () => ({
  type: POKEMON_LIST_RESET
});

// =============================================================================
// BATTLE COMPARISON ACTIONS
// =============================================================================

export const battleCompareRequest = (pokemon1Name, pokemon2Name) => ({
  type: BATTLE_COMPARE_REQUEST,
  payload: { pokemon1Name, pokemon2Name }
});

export const battleCompareSuccess = (pokemon1, pokemon2, comparison) => ({
  type: BATTLE_COMPARE_SUCCESS,
  payload: { 
    pokemon1,
    pokemon2,
    comparison,
    timestamp: Date.now()
  }
});

export const battleCompareFailure = (error) => ({
  type: BATTLE_COMPARE_FAILURE,
  payload: { 
    error: error.message || 'Erro na comparação',
    timestamp: Date.now()
  }
});

export const battleCompareClear = () => ({
  type: BATTLE_COMPARE_CLEAR
});

export const battleSetPokemon1 = (pokemon) => ({
  type: BATTLE_SET_POKEMON_1,
  payload: { pokemon }
});

export const battleSetPokemon2 = (pokemon) => ({
  type: BATTLE_SET_POKEMON_2,
  payload: { pokemon }
});

// =============================================================================
// FAVORITES ACTIONS
// =============================================================================

export const favoritesLoad = (favorites) => ({
  type: FAVORITES_LOAD,
  payload: { 
    favorites,
    timestamp: Date.now()
  }
});

export const favoritesAdd = (pokemon) => ({
  type: FAVORITES_ADD,
  payload: { 
    pokemon,
    timestamp: Date.now()
  }
});

export const favoritesRemove = (pokemonId) => ({
  type: FAVORITES_REMOVE,
  payload: { 
    pokemonId,
    timestamp: Date.now()
  }
});

export const favoritesClearAll = () => ({
  type: FAVORITES_CLEAR_ALL,
  payload: {
    timestamp: Date.now()
  }
});

// =============================================================================
// UI STATE ACTIONS
// =============================================================================

export const setLoading = (section, isLoading) => ({
  type: SET_LOADING,
  payload: { section, isLoading }
});

export const setError = (section, error) => ({
  type: SET_ERROR,
  payload: { 
    section, 
    error: error.message || error,
    timestamp: Date.now()
  }
});

export const clearError = (section) => ({
  type: CLEAR_ERROR,
  payload: { section }
});

// =============================================================================
// ACTION CREATORS WITH VALIDATION
// =============================================================================

/**
 * Action creator with input validation for search
 */
export const createSearchAction = (query) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return pokemonSearchFailure(new Error('Query de busca inválida'));
  }
  
  return pokemonSearchRequest(query.trim());
};

/**
 * Action creator with validation for battle comparison
 */
export const createBattleComparisonAction = (pokemon1Name, pokemon2Name) => {
  if (!pokemon1Name || !pokemon2Name) {
    return battleCompareFailure(new Error('Dois Pokémon são necessários para comparação'));
  }
  
  if (pokemon1Name.toLowerCase() === pokemon2Name.toLowerCase()) {
    return battleCompareFailure(new Error('Selecione Pokémon diferentes para comparação'));
  }
  
  return battleCompareRequest(pokemon1Name.trim(), pokemon2Name.trim());
};

/**
 * Action creator with validation for pagination
 */
export const createPaginationAction = (offset, limit = 20) => {
  if (offset < 0 || limit <= 0) {
    return pokemonListFailure(new Error('Parâmetros de paginação inválidos'));
  }
  
  return pokemonListRequest(offset, limit);
};
