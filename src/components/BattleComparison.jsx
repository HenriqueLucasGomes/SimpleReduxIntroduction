import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  comparePokemonOperation,
  clearBattleComparisonOperation,
  setPokemon1Operation,
  setPokemon2Operation
} from '../redux/pokemon/operations';
import {
  selectBattleIsLoading,
  selectBattlePokemon1,
  selectBattlePokemon2,
  selectBattleComparisonDetails,
  selectBattleError,
  selectBattleReadyToCompare
} from '../redux/pokemon/selectors';

/**
 * TELA 4: BATTLE COMPARISON
 * Demonstra fluxo Redux complexo com múltiplas ações e estados interdependentes
 * Fluxo: Input 2 Pokémon -> buscar dados -> comparar estatísticas -> exibir resultado
 */
const BattleComparison = () => {
  const dispatch = useDispatch();
  const [pokemon1Input, setPokemon1Input] = useState('');
  const [pokemon2Input, setPokemon2Input] = useState('');
  
  // Selectors para acessar o estado Redux
  const isLoading = useSelector(selectBattleIsLoading);
  const pokemon1 = useSelector(selectBattlePokemon1);
  const pokemon2 = useSelector(selectBattlePokemon2);
  const comparisonDetails = useSelector(selectBattleComparisonDetails);
  const error = useSelector(selectBattleError);
  const readyToCompare = useSelector(selectBattleReadyToCompare);

  // Handler para comparar Pokémon
  const handleCompare = (e) => {
    e.preventDefault();
    if (pokemon1Input.trim() && pokemon2Input.trim()) {
      dispatch(comparePokemonOperation(pokemon1Input.trim(), pokemon2Input.trim()));
    }
  };

  // Handler para limpar comparação
  const handleClear = () => {
    setPokemon1Input('');
    setPokemon2Input('');
    dispatch(clearBattleComparisonOperation());
  };

  // Componente de card do Pokémon na batalha
  const BattlePokemonCard = ({ pokemon, isWinner, position }) => {
    return (
    <div className={`card ${isWinner ? 'winner-card' : ''}`}>
      <div style={{ textAlign: 'center' }}>
        <img 
          src={pokemon.image}
          alt={pokemon.name}
          className="pokemon-image"
          style={{ width: '150px', height: '150px' }}
        />
        <h3 className="pokemon-name">
          #{pokemon.id.toString().padStart(3, '0')} {pokemon.name}
          {isWinner && ' 👑'}
        </h3>
        <div className="pokemon-types">
          {pokemon.types.map(type => (
            <span key={type} className="pokemon-type">
              {type}
            </span>
          ))}
        </div>
      </div>
      
      <div className="stats-grid" style={{ marginTop: '20px' }}>
        {Object.entries(pokemon.stats).map(([statName, statValue]) => {
          const comparison = comparisonDetails?.statComparisons[statName];
          const isStatWinner = comparison?.winner === position;
          
          return (
            <div 
              key={statName} 
              className={`stat-item ${isStatWinner ? 'stat-winner' : ''}`}
            >
              <div className="stat-name">{statName.replace('-', ' ')}</div>
              <div className="stat-value">
                {statValue}
                {isStatWinner && ' ⭐'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )};

  return (
    <div className="battle-comparison">
      <h1>⚔️ Batalha Pokémon</h1>
      <p>Compare dois Pokémon e descubra quem levaria vantagem em uma batalha!</p>

      {/* Formulário de seleção */}
      <form onSubmit={handleCompare} className="battle-form">
        <div className="search-container">
          <input
            type="text"
            value={pokemon1Input}
            onChange={(e) => setPokemon1Input(e.target.value)}
            placeholder="Primeiro Pokémon (ex: pikachu)"
            className="search-input"
            disabled={isLoading}
          />
          <span style={{ fontSize: '24px', alignSelf: 'center' }}>VS</span>
          <input
            type="text"
            value={pokemon2Input}
            onChange={(e) => setPokemon2Input(e.target.value)}
            placeholder="Segundo Pokémon (ex: charizard)"
            className="search-input"
            disabled={isLoading}
          />
        </div>
        <div className="search-container">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading || !pokemon1Input.trim() || !pokemon2Input.trim()}
          >
            {isLoading ? '🔄 Comparando...' : '⚔️ Comparar'}
          </button>
          {readyToCompare && (
            <button 
              type="button" 
              onClick={handleClear}
              className="btn btn-secondary"
            >
              🗑️ Limpar
            </button>
          )}
        </div>
      </form>

      {/* Estado de loading */}
      {isLoading && (
        <div className="loading">
          🔄 Preparando a batalha...
        </div>
      )}

      {/* Estado de erro */}
      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      {/* Resultado da comparação */}
      {pokemon1 && pokemon2 && comparisonDetails && !isLoading && (
        <>
          {/* Resumo da batalha */}
          <div className="card battle-summary">
            <h3>🏆 Resultado da Batalha</h3>
            {comparisonDetails.battleRecommendation && (
              <div className={`battle-result ${comparisonDetails.battleRecommendation.result}`}>
                <h4>
                  {comparisonDetails.battleRecommendation.result === 'tie' 
                    ? '🤝 Empate!' 
                    : `👑 ${comparisonDetails.winner === 'pokemon1' ? pokemon1.name : pokemon2.name} Venceu!`
                  }
                </h4>
                <p>{comparisonDetails.battleRecommendation.message}</p>
                <div className="confidence-indicator">
                  Confiança: 
                  <span className={`confidence ${comparisonDetails.battleRecommendation.confidence}`}>
                    {comparisonDetails.battleRecommendation.confidence} 
                    ({comparisonDetails.battleRecommendation.percentage?.toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}
            
            <div className="battle-stats">
              <h4>📊 Estatísticas da Batalha</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-name">{pokemon1.name} Vantagens</div>
                  <div className="stat-value">{comparisonDetails.advantages.pokemon1}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-name">{pokemon2.name} Vantagens</div>
                  <div className="stat-value">{comparisonDetails.advantages.pokemon2}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-name">Empates</div>
                  <div className="stat-value">{comparisonDetails.advantages.ties}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-name">Diferença Total</div>
                  <div className="stat-value">{comparisonDetails.totalPower.difference}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards dos Pokémon */}
          <div className="comparison-container">
            <BattlePokemonCard 
              pokemon={pokemon1} 
              isWinner={comparisonDetails.winner === 'pokemon1'}
              position="pokemon1"
            />
            <BattlePokemonCard 
              pokemon={pokemon2} 
              isWinner={comparisonDetails.winner === 'pokemon2'}
              position="pokemon2"
            />
          </div>
        </>
      )}

      {/* Estado vazio */}
      {!pokemon1 && !pokemon2 && !isLoading && !error && (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3>⚔️ Pronto para a Batalha!</h3>
            <p>Digite os nomes de dois Pokémon nos campos acima para comparar suas estatísticas.</p>
            <div style={{ margin: '20px 0' }}>
              <strong>Como funciona:</strong>
              <ul style={{ textAlign: 'left', display: 'inline-block', margin: '10px 0' }}>
                <li>Digite o nome de dois Pokémon diferentes</li>
                <li>O sistema buscará os dados de ambos na PokéAPI</li>
                <li>As estatísticas serão comparadas automaticamente</li>
                <li>Você verá qual Pokémon tem vantagem em cada atributo</li>
                <li>Um vencedor será determinado baseado no total de estatísticas</li>
              </ul>
            </div>
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
              <strong>Exemplos:</strong> pikachu vs raichu, charizard vs blastoise, mewtwo vs mew
            </div>
          </div>
        </div>
      )}

      {/* Informações sobre Redux Flow */}
      <div className="card" style={{ marginTop: '30px', backgroundColor: '#f8f9fa' }}>
        <h3>🔧 Fluxo Redux Demonstrado</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Múltiplas Actions:</strong> SET_POKEMON_1, SET_POKEMON_2, COMPARE_REQUEST</li>
          <li><strong>Service Complexo:</strong> battleService.comparePokemon() busca 2 Pokémon</li>
          <li><strong>Estado Interdependente:</strong> Comparação depende de ambos os Pokémon</li>
          <li><strong>Cálculos no Reducer:</strong> calculatePokemonComparison() processa dados</li>
          <li><strong>Selectors Avançados:</strong> selectBattleComparisonDetails combina dados</li>
          <li><strong>Validação:</strong> Actions validam entrada antes de processar</li>
        </ul>
      </div>
    </div>
  );
};

export default BattleComparison;
