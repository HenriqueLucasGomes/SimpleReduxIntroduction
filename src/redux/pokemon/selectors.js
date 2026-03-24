/**
 * selectors.js
 * Função: facilitar a leitura de dados do estado global.
 * Por que usar: evita espalhar lógica de acesso ao estado pela aplicação.
 */

import { createSelector } from 'reselect';

// =============================================================================
// BASE SELECTORS
// =============================================================================

/**
 * Selectors básicos para acessar partes do estado
 */
export const selectPokemonState = (state) => state.pokemon;
export const selectSearchState = (state) => state.pokemon.search;
export const selectListState = (state) => state.pokemon.list;
export const selectBattleState = (state) => state.pokemon.battle;
export const selectFavoritesState = (state) => state.pokemon.favorites;
export const selectUIState = (state) => state.pokemon.ui;

// =============================================================================
// POKEMON SEARCH SELECTORS
// =============================================================================

/**
 * Selectors para o estado de busca
 */
export const selectSearchIsLoading = createSelector(
  [selectSearchState],
  (search) => search.isLoading
);

export const selectSearchPokemon = createSelector(
  [selectSearchState],
  (search) => search.pokemon
);

export const selectSearchSpecies = createSelector(
  [selectSearchState],
  (search) => search.species
);

export const selectSearchError = createSelector(
  [selectSearchState],
  (search) => search.error
);

export const selectLastSearchQuery = createSelector(
  [selectSearchState],
  (search) => search.lastQuery
);

/**
 * Selector complexo que combina dados do Pokémon com informações da espécie
 */
export const selectSearchPokemonWithDetails = createSelector(
  [selectSearchPokemon, selectSearchSpecies],
  (pokemon, species) => {
    if (!pokemon) return null;
    
    let description = 'Descrição não disponível';
    if (species && species.flavor_text_entries) {
      const portugueseEntry = species.flavor_text_entries.find(
        entry => entry.language.name === 'en' // Usando inglês pois nem sempre há português
      );
      if (portugueseEntry) {
        description = portugueseEntry.flavor_text.replace(/\f/g, ' ');
      }
    }
    
    return {
      ...pokemon,
      description,
      genus: species?.genera?.find(g => g.language.name === 'en')?.genus || 'Pokémon',
      captureRate: species?.capture_rate || 0,
      baseHappiness: species?.base_happiness || 0
    };
  }
);

// =============================================================================
// POKEMON LIST SELECTORS
// =============================================================================

/**
 * Selectors para lista de Pokémon
 */
export const selectListIsLoading = createSelector(
  [selectListState],
  (list) => list.isLoading
);

export const selectPokemonList = createSelector(
  [selectListState],
  (list) => list.pokemon
);

export const selectListHasMore = createSelector(
  [selectListState],
  (list) => list.hasMore
);

export const selectListError = createSelector(
  [selectListState],
  (list) => list.error
);

export const selectListPagination = createSelector(
  [selectListState],
  (list) => ({
    offset: list.offset,
    limit: list.limit,
    hasMore: list.hasMore,
    currentPage: Math.floor(list.offset / list.limit) + 1,
    totalLoaded: list.pokemon.length
  })
);

/**
 * Selector para Pokémon filtrados por tipo
 */
export const selectPokemonByType = createSelector(
  [selectPokemonList, (state, type) => type],
  (pokemonList, type) => {
    if (!type) return pokemonList;
    return pokemonList.filter(pokemon => 
      pokemon.types.includes(type.toLowerCase())
    );
  }
);

/**
 * Selector para estatísticas da lista
 */
export const selectListStatistics = createSelector(
  [selectPokemonList],
  (pokemonList) => {
    if (!pokemonList.length) return null;
    
    const typeCount = {};
    let totalStats = 0;
    let maxStat = 0;
    let strongestPokemon = null;
    
    pokemonList.forEach(pokemon => {
      // Contar tipos
      pokemon.types.forEach(type => {
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
      
      // Calcular estatísticas
      const pokemonTotal = Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0);
      totalStats += pokemonTotal;
      
      if (pokemonTotal > maxStat) {
        maxStat = pokemonTotal;
        strongestPokemon = pokemon;
      }
    });
    
    return {
      totalPokemon: pokemonList.length,
      typeDistribution: typeCount,
      averageStats: totalStats / pokemonList.length,
      strongestPokemon,
      mostCommonType: Object.keys(typeCount).reduce((a, b) => 
        typeCount[a] > typeCount[b] ? a : b
      )
    };
  }
);

// =============================================================================
// BATTLE COMPARISON SELECTORS
// =============================================================================

/**
 * Selectors para batalha/comparação
 */
export const selectBattleIsLoading = createSelector(
  [selectBattleState],
  (battle) => battle.isLoading
);

export const selectBattlePokemon1 = createSelector(
  [selectBattleState],
  (battle) => battle.pokemon1
);

export const selectBattlePokemon2 = createSelector(
  [selectBattleState],
  (battle) => battle.pokemon2
);

export const selectBattleComparison = createSelector(
  [selectBattleState],
  (battle) => battle.comparison
);

export const selectBattleError = createSelector(
  [selectBattleState],
  (battle) => battle.error
);

/**
 * Selector que determina se a batalha está pronta para ser iniciada
 */
export const selectBattleReadyToCompare = createSelector(
  [selectBattlePokemon1, selectBattlePokemon2],
  (pokemon1, pokemon2) => pokemon1 && pokemon2
);

/**
 * Selector para dados detalhados da comparação
 */
export const selectBattleComparisonDetails = createSelector(
  [selectBattleComparison, selectBattlePokemon1, selectBattlePokemon2],
  (comparison, pokemon1, pokemon2) => {
    if (!comparison || !pokemon1 || !pokemon2) return null;
    
    return {
      ...comparison,
      winner: comparison.totalPower.winner,
      pokemon1Name: pokemon1.name,
      pokemon2Name: pokemon2.name,
      battleRecommendation: getBattleRecommendation(comparison)
    };
  }
);

// =============================================================================
// FAVORITES SELECTORS
// =============================================================================

/**
 * Selectors para favoritos
 */
export const selectFavoritesList = createSelector(
  [selectFavoritesState],
  (favorites) => favorites.items
);

export const selectFavoritesCount = createSelector(
  [selectFavoritesList],
  (favoritesList) => favoritesList.length
);

export const selectFavoritesError = createSelector(
  [selectFavoritesState],
  (favorites) => favorites.error
);

/**
 * Selector para verificar se um Pokémon é favorito
 */
export const selectIsPokemonFavorite = createSelector(
  [selectFavoritesList, (state, pokemonId) => pokemonId],
  (favoritesList, pokemonId) => 
    favoritesList.some(favorite => favorite.id === pokemonId)
);

/**
 * Selector para estatísticas dos favoritos
 */
export const selectFavoritesStatistics = createSelector(
  [selectFavoritesList],
  (favoritesList) => {
    if (!favoritesList.length) return null;
    
    const typeCount = {};
    const addedDates = [];
    
    favoritesList.forEach(favorite => {
      // Contar tipos
      favorite.types.forEach(type => {
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
      
      // Guardar datas
      if (favorite.addedAt) {
        addedDates.push(new Date(favorite.addedAt));
      }
    });
    
    return {
      totalFavorites: favoritesList.length,
      typeDistribution: typeCount,
      mostCommonType: Object.keys(typeCount).reduce((a, b) => 
        typeCount[a] > typeCount[b] ? a : b, ''
      ),
      newestFavorite: favoritesList.reduce((newest, current) => 
        new Date(current.addedAt) > new Date(newest.addedAt) ? current : newest
      ),
      oldestFavorite: favoritesList.reduce((oldest, current) => 
        new Date(current.addedAt) < new Date(oldest.addedAt) ? current : oldest
      )
    };
  }
);

// =============================================================================
// UI STATE SELECTORS
// =============================================================================

/**
 * Selectors para estado da UI
 */
export const selectUILoading = createSelector(
  [selectUIState],
  (ui) => ui.loading
);

export const selectUIErrors = createSelector(
  [selectUIState],
  (ui) => ui.errors
);

export const selectIsLoadingSection = createSelector(
  [selectUILoading, (state, section) => section],
  (loading, section) => loading[section] || false
);

export const selectSectionError = createSelector(
  [selectUIErrors, (state, section) => section],
  (errors, section) => errors[section] || null
);

// =============================================================================
// COMBINED SELECTORS
// =============================================================================

/**
 * Selector que combina dados de múltiplas seções
 */
export const selectAppOverview = createSelector(
  [
    selectPokemonList,
    selectFavoritesList,
    selectSearchPokemon,
    selectBattleComparison
  ],
  (pokemonList, favoritesList, searchPokemon, battleComparison) => ({
    totalPokemonLoaded: pokemonList.length,
    totalFavorites: favoritesList.length,
    hasSearchResult: !!searchPokemon,
    hasBattleComparison: !!battleComparison,
    lastActivity: {
      search: !!searchPokemon,
      list: pokemonList.length > 0,
      favorites: favoritesList.length > 0,
      battle: !!battleComparison
    }
  })
);

/**
 * Selector para todas as informações de loading
 */
export const selectAllLoadingStates = createSelector(
  [selectSearchIsLoading, selectListIsLoading, selectBattleIsLoading, selectUILoading],
  (searchLoading, listLoading, battleLoading, uiLoading) => ({
    search: searchLoading,
    list: listLoading,
    battle: battleLoading,
    loadMore: uiLoading.loadMore || false,
    anyLoading: searchLoading || listLoading || battleLoading || Object.values(uiLoading).some(Boolean)
  })
);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Função auxiliar para gerar recomendação de batalha
 */
function getBattleRecommendation(comparison) {
  if (!comparison) return null;
  
  const { advantages, totalPower } = comparison;
  
  if (totalPower.winner === 'tie') {
    return {
      result: 'tie',
      message: 'Os Pokémon estão muito equilibrados! A batalha pode ir para qualquer lado.',
      confidence: 'baixa'
    };
  }
  
  const winnerAdvantages = advantages[totalPower.winner];
  const totalStats = advantages.pokemon1 + advantages.pokemon2 + advantages.ties;
  const winnerPercentage = (winnerAdvantages / totalStats) * 100;
  
  let confidence = 'baixa';
  if (winnerPercentage >= 70) confidence = 'alta';
  else if (winnerPercentage >= 50) confidence = 'média';
  
  return {
    result: totalPower.winner,
    message: `${totalPower.winner === 'pokemon1' ? 'Pokémon 1' : 'Pokémon 2'} tem vantagem em ${winnerAdvantages} de ${totalStats} estatísticas.`,
    confidence,
    percentage: winnerPercentage
  };
}
