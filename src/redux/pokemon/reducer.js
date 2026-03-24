/**
 * reducer.js
 * Função: dizer como o estado muda em resposta às ações.
 * Papel principal: receber o estado atual + ação e devolver o novo estado.
 */

import {
  // Pokemon Search
  POKEMON_SEARCH_REQUEST,
  POKEMON_SEARCH_SUCCESS,
  POKEMON_SEARCH_FAILURE,
  POKEMON_SEARCH_CLEAR,
  
  // Pokemon List
  POKEMON_LIST_REQUEST,
  POKEMON_LIST_SUCCESS,
  POKEMON_LIST_FAILURE,
  POKEMON_LIST_LOAD_MORE,
  POKEMON_LIST_RESET,
  
  // Battle Comparison
  BATTLE_COMPARE_REQUEST,
  BATTLE_COMPARE_SUCCESS,
  BATTLE_COMPARE_FAILURE,
  BATTLE_COMPARE_CLEAR,
  BATTLE_SET_POKEMON_1,
  BATTLE_SET_POKEMON_2,
  
  // Favorites
  FAVORITES_LOAD,
  FAVORITES_ADD,
  FAVORITES_REMOVE,
  FAVORITES_CLEAR_ALL,
  
  // UI State
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR
} from './actions';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  // Pokemon Search State
  search: {
    isLoading: false,
    pokemon: null,
    species: null,
    error: null,
    lastQuery: null,
    lastSearchTime: null
  },
  
  // Pokemon List State
  list: {
    isLoading: false,
    pokemon: [],
    hasMore: true,
    offset: 0,
    limit: 20,
    error: null,
    lastLoadTime: null
  },
  
  // Battle Comparison State
  battle: {
    isLoading: false,
    pokemon1: null,
    pokemon2: null,
    comparison: null,
    error: null,
    lastComparisonTime: null
  },
  
  // Favorites State
  favorites: {
    items: [],
    lastModified: null,
    error: null
  },
  
  // UI State
  ui: {
    loading: {},
    errors: {}
  }
};

// =============================================================================
// REDUCER FUNCTIONS
// =============================================================================

/**
 * Pokemon Search Reducer
 */
const searchReducer = (state = initialState.search, action) => {
  switch (action.type) {
    case POKEMON_SEARCH_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        lastQuery: action.payload.query
      };
      
    case POKEMON_SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pokemon: action.payload.pokemon,
        species: action.payload.species,
        error: null,
        lastSearchTime: action.payload.timestamp
      };
      
    case POKEMON_SEARCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        pokemon: null,
        species: null,
        error: action.payload.error,
        lastSearchTime: action.payload.timestamp
      };
      
    case POKEMON_SEARCH_CLEAR:
      return {
        ...initialState.search
      };
      
    default:
      return state;
  }
};

/**
 * Pokemon List Reducer
 */
const listReducer = (state = initialState.list, action) => {
  switch (action.type) {
    case POKEMON_LIST_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case POKEMON_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pokemon: action.payload.pokemonList,
        hasMore: action.payload.hasMore,
        offset: action.payload.offset,
        error: null,
        lastLoadTime: action.payload.timestamp
      };
      
    case POKEMON_LIST_LOAD_MORE:
      return {
        ...state,
        isLoading: false,
        pokemon: [...state.pokemon, ...action.payload.pokemonList],
        offset: action.payload.offset,
        error: null,
        lastLoadTime: action.payload.timestamp
      };
      
    case POKEMON_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        lastLoadTime: action.payload.timestamp
      };
      
    case POKEMON_LIST_RESET:
      return {
        ...initialState.list
      };
      
    default:
      return state;
  }
};

/**
 * Battle Comparison Reducer
 */
const battleReducer = (state = initialState.battle, action) => {
  switch (action.type) {
    case BATTLE_COMPARE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case BATTLE_COMPARE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pokemon1: action.payload.pokemon1,
        pokemon2: action.payload.pokemon2,
        comparison: action.payload.comparison,
        error: null,
        lastComparisonTime: action.payload.timestamp
      };
      
    case BATTLE_COMPARE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        lastComparisonTime: action.payload.timestamp
      };
      
    case BATTLE_COMPARE_CLEAR:
      return {
        ...initialState.battle
      };
      
    case BATTLE_SET_POKEMON_1:
      return {
        ...state,
        pokemon1: action.payload.pokemon,
        comparison: null // Clear comparison when changing pokemon
      };
      
    case BATTLE_SET_POKEMON_2:
      return {
        ...state,
        pokemon2: action.payload.pokemon,
        comparison: null // Clear comparison when changing pokemon
      };
      
    default:
      return state;
  }
};

/**
 * Favorites Reducer
 */
const favoritesReducer = (state = initialState.favorites, action) => {
  switch (action.type) {
    case FAVORITES_LOAD:
      return {
        ...state,
        items: action.payload.favorites,
        lastModified: action.payload.timestamp,
        error: null
      };
      
    case FAVORITES_ADD:
      const existingIndex = state.items.findIndex(
        item => item.id === action.payload.pokemon.id
      );
      
      // Se já existe, não adicionar novamente
      if (existingIndex !== -1) {
        return state;
      }
      
      return {
        ...state,
        items: [...state.items, action.payload.pokemon],
        lastModified: action.payload.timestamp,
        error: null
      };
      
    case FAVORITES_REMOVE:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.pokemonId),
        lastModified: action.payload.timestamp,
        error: null
      };
      
    case FAVORITES_CLEAR_ALL:
      return {
        ...state,
        items: [],
        lastModified: action.payload.timestamp,
        error: null
      };
      
    default:
      return state;
  }
};

/**
 * UI State Reducer
 */
const uiReducer = (state = initialState.ui, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.section]: action.payload.isLoading
        }
      };
      
    case SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.section]: {
            message: action.payload.error,
            timestamp: action.payload.timestamp
          }
        }
      };
      
    case CLEAR_ERROR:
      const newErrors = { ...state.errors };
      delete newErrors[action.payload.section];
      return {
        ...state,
        errors: newErrors
      };
      
    default:
      return state;
  }
};

// =============================================================================
// ROOT REDUCER
// =============================================================================

/**
 * Root reducer that combines all feature reducers
 */
const pokemonReducer = (state = initialState, action) => {
  return {
    search: searchReducer(state.search, action),
    list: listReducer(state.list, action),
    battle: battleReducer(state.battle, action),
    favorites: favoritesReducer(state.favorites, action),
    ui: uiReducer(state.ui, action)
  };
};

export default pokemonReducer;

// =============================================================================
// REDUCER UTILITIES
// =============================================================================

/**
 * Utility function to reset all state
 */
export const resetAllState = () => ({
  type: '@@RESET_ALL_STATE'
});

/**
 * Enhanced reducer that handles global reset
 */
export const enhancedPokemonReducer = (state = initialState, action) => {
  if (action.type === '@@RESET_ALL_STATE') {
    return initialState;
  }
  
  return pokemonReducer(state, action);
};
