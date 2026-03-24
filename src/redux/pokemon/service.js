import axios from 'axios';

/**
 * service.js
 * Função: centralizar chamadas externas, como requisições a APIs ou funções utilitárias de dados.
 * Por que usar: deixa claro onde estão as integrações com o "mundo externo".
 */

const BASE_URL = 'https://pokeapi.co/api/v2';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Pokemon Search Services
export const pokemonSearchService = {
  /**
   * Busca um Pokémon específico por nome ou ID
   */
  async searchPokemon(query) {
    try {
      const response = await apiClient.get(`/pokemon/${query.toLowerCase()}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Pokémon "${query}" não encontrado`);
      }
      throw new Error('Erro ao buscar Pokémon');
    }
  },

  /**
   * Busca informações de espécie do Pokémon para descrição
   */
  async getPokemonSpecies(id) {
    try {
      const response = await apiClient.get(`/pokemon-species/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar informações da espécie');
    }
  }
};

// Pokemon List Services
export const pokemonListService = {
  /**
   * Busca lista paginada de Pokémon
   */
  async getPokemonList(offset = 0, limit = 20) {
    try {
      const response = await apiClient.get(`/pokemon?offset=${offset}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar lista de Pokémon');
    }
  },

  /**
   * Busca detalhes básicos de múltiplos Pokémon
   */
  async getPokemonDetails(urls) {
    try {
      const promises = urls.map(url => axios.get(url));
      const responses = await Promise.all(promises);
      return responses.map(response => response.data);
    } catch (error) {
      throw new Error('Erro ao carregar detalhes dos Pokémon');
    }
  }
};

// Battle Comparison Services
export const battleService = {
  /**
   * Busca dois Pokémon para comparação
   */
  async comparePokemon(pokemon1Name, pokemon2Name) {
    try {
      const [pokemon1, pokemon2] = await Promise.all([
        apiClient.get(`/pokemon/${pokemon1Name.toLowerCase()}`),
        apiClient.get(`/pokemon/${pokemon2Name.toLowerCase()}`)
      ]);
      
      return {
        pokemon1: pokemon1.data,
        pokemon2: pokemon2.data
      };
    } catch (error) {
      throw new Error('Erro ao comparar Pokémon');
    }
  },

  /**
   * Calcula vantagem de tipos
   */
  async getTypeEffectiveness(attackingType) {
    try {
      const response = await apiClient.get(`/type/${attackingType}`);
      const typeData = response.data;
      
      // Simplificada - em uma aplicação real, você processaria as relações de tipo
      return {
        doubleDamage: typeData.damage_relations.double_damage_to,
        halfDamage: typeData.damage_relations.half_damage_to,
        noDamage: typeData.damage_relations.no_damage_to
      };
    } catch (error) {
      throw new Error('Erro ao calcular efetividade de tipos');
    }
  }
};

// Favorites Services (Local Storage)
export const favoritesService = {
  /**
   * Carrega favoritos do localStorage
   */
  loadFavorites() {
    try {
      const favorites = localStorage.getItem('pokemonFavorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      return [];
    }
  },

  /**
   * Salva favoritos no localStorage
   */
  saveFavorites(favorites) {
    try {
      localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
      return false;
    }
  },

  /**
   * Adiciona Pokémon aos favoritos
   */
  addToFavorites(pokemon) {
    const favorites = this.loadFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav?.id === pokemon?.id);
    
    if (!isAlreadyFavorite) {
      const newFavorites = [...favorites, {
        id: pokemon?.id,
        name: pokemon?.name,
        image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
        types: pokemon.types.map(type => type.type.name),
        addedAt: new Date().toISOString()
      }];
      this.saveFavorites(newFavorites);
      return newFavorites;
    }
    
    return favorites;
  },

  /**
   * Remove Pokémon dos favoritos
   */
  removeFromFavorites(pokemonId) {
    const favorites = this.loadFavorites();
    const newFavorites = favorites.filter(fav => fav.id !== pokemonId);
    this.saveFavorites(newFavorites);
    return newFavorites;
  }
};

// Utility functions
export const pokemonUtils = {
  /**
   * Extrai dados essenciais do Pokémon
   */
  extractPokemonData(pokemon) {
    return {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
      types: pokemon.types.map(type => type.type.name),
      stats: pokemon.stats.reduce((acc, stat) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
      }, {}),
      height: pokemon.height,
      weight: pokemon.weight,
      abilities: pokemon.abilities.map(ability => ability.ability.name)
    };
  },

  /**
   * Calcula poder total do Pokémon
   */
  calculateTotalPower(stats) {
    return Object.values(stats).reduce((total, stat) => total + stat, 0);
  },

  /**
   * Formata altura e peso
   */
  formatMeasurements(height, weight) {
    return {
      height: `${height / 10} m`, // height é em decímetros
      weight: `${weight / 10} kg`  // weight é em hectogramas
    };
  }
};
