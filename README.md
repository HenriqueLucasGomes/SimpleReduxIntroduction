# 🎮 Simple Redux Introduction - Pokémon App

Uma aplicação React demonstrando os conceitos fundamentais do Redux através de uma Pokédex interativa usando a PokéAPI.

## 📖 Sobre o Projeto

Esta aplicação foi criada para demonstrar os padrões e fluxos do Redux de forma prática e educacional. Cada tela representa um fluxo Redux diferente, permitindo o entendimento progressivo dos conceitos.

## 🏗️ Arquitetura Redux Implementada

O projeto segue rigorosamente o padrão de organização Redux especificado:

### 1. **service.js** - Camada de Serviços
- **Função**: Centralizar chamadas externas (APIs, localStorage)
- **Por que usar**: Separa a lógica de integração externa do Redux
- **Implementação**: 
  - `pokemonSearchService` - Busca Pokémon individual
  - `pokemonListService` - Lista paginada
  - `battleService` - Comparação de Pokémon
  - `favoritesService` - Gerenciamento localStorage

### 2. **actions.js** - Definição de Ações
- **Função**: Definir objetos que descrevem eventos da aplicação
- **O que são**: Descrevem "o que aconteceu", não "como mudar o estado"
- **Implementação**: 51 action creators organizados por feature

### 3. **reducer.js** - Gerenciamento de Estado
- **Função**: Especificar como o estado muda em resposta às ações
- **Papel principal**: Receber (estado atual + ação) → retornar novo estado
- **Implementação**: Reducers separados para cada feature, combinados em um root reducer

### 4. **operations.js** - Lógica Assíncrona
- **Função**: Lidar com operações assíncronas usando redux-thunk
- **Como funciona**: Combina service.js (requisições) + actions.js (dispatch)
- **Implementação**: Thunks para cada operação complexa da aplicação

### 5. **selectors.js** - Acesso ao Estado
- **Função**: Facilitar leitura e transformação de dados do estado global
- **Por que usar**: Evita espalhar lógica de acesso ao estado
- **Implementação**: Selectors simples e compostos usando pattern similar ao reselect

## 🎯 Demonstrações por Tela

### 🔍 Tela 1: Busca de Pokémon
**Fluxo Redux Demonstrado**: Busca Individual
- Input do usuário → Action → Service (API) → Reducer → UI atualizada
- **Actions**: `POKEMON_SEARCH_REQUEST/SUCCESS/FAILURE`
- **Service**: `pokemonSearchService.searchPokemon()`
- **Features**: Loading states, error handling, integração com favoritos

### 📋 Tela 2: Lista de Pokémon
**Fluxo Redux Demonstrado**: Paginação e Loading Estados
- Mount do componente → Action → Service → Reducer → Lista renderizada
- **Actions**: `POKEMON_LIST_REQUEST/SUCCESS/LOAD_MORE`
- **Service**: `pokemonListService.getPokemonList()`
- **Features**: Paginação, lazy loading, batch operations

### ❤️ Tela 3: Favoritos
**Fluxo Redux Demonstrado**: Estado Local + Persistência
- Redux State ↔ localStorage sincronização
- **Actions**: `FAVORITES_ADD/REMOVE/LOAD/CLEAR_ALL`
- **Service**: `favoritesService` com localStorage
- **Features**: Persistência local, estatísticas calculadas, bulk operations

### ⚔️ Tela 4: Batalha/Comparação
**Fluxo Redux Demonstrado**: Estados Interdependentes e Cálculos Complexos
- Múltiplas ações → Estados dependentes → Cálculos no reducer → UI reativa
- **Actions**: `BATTLE_COMPARE_REQUEST/SUCCESS`, `BATTLE_SET_POKEMON_1/2`
- **Service**: `battleService.comparePokemon()`
- **Features**: Validação de entrada, cálculos de estatísticas, estados complexos

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd SimpleReduxIntroduction

# Instale as dependências
npm install

# Execute a aplicação
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📚 Estrutura de Arquivos

```
src/
├── redux/
│   ├── pokemon/
│   │   ├── service.js      # Serviços e integrações externas
│   │   ├── actions.js      # Action types e action creators
│   │   ├── reducer.js      # Estado e transformações
│   │   ├── operations.js   # Thunks e lógica assíncrona
│   │   └── selectors.js    # Acesso e transformação do estado
│   └── store.js            # Configuração da store
├── components/
│   ├── Navigation.js       # Navegação principal
│   ├── PokemonSearch.js    # Tela 1: Busca
│   ├── PokemonList.js      # Tela 2: Lista
│   ├── FavoritesScreen.js  # Tela 3: Favoritos
│   └── BattleComparison.js # Tela 4: Batalha
├── styles/
│   └── global.css          # Estilos globais
└── App.js                  # Componente principal
```

## 🎓 Conceitos Redux Demonstrados

### Estados de Loading
- Loading global e por seção
- Loading states diferentes para operações distintas
- UI responsiva baseada em estados de loading

### Error Handling
- Error boundaries no Redux
- Error states específicos por feature
- Recuperação de erros com retry mechanisms

### Selectors Pattern
- Selectors simples para acesso direto
- Selectors compostos para transformações
- Selectors com parâmetros para filtros dinâmicos
- Memoização manual para performance

### Async Operations
- Redux Thunk para operações assíncronas
- Padrão Request/Success/Failure
- Handling de race conditions
- Cancelamento de operações

### Estado Complexo
- Estado normalizado vs desnormalizado
- Estados interdependentes
- Computed properties via selectors
- Side effects e sincronização

## 🔗 API Utilizada

**PokéAPI**: `https://pokeapi.co/api/v2/`
- Endpoints utilizados:
  - `/pokemon/{id-or-name}` - Dados do Pokémon
  - `/pokemon?offset={n}&limit={n}` - Lista paginada
  - `/pokemon-species/{id}` - Informações da espécie

## 🎯 Objetivos Educacionais

1. **Entender o fluxo unidirecional** de dados no Redux
2. **Separar responsabilidades** entre camadas da aplicação
3. **Gerenciar estado complexo** de forma previsível
4. **Implementar padrões** de loading, error e success states
5. **Integrar APIs externas** com Redux de forma eficiente
6. **Usar selectors** para transformação e acesso a dados
7. **Demonstrar diferentes** tipos de operações assíncronas

## 🔧 Tecnologias Utilizadas

- **React 18** - Biblioteca de UI
- **Redux 4.2** - Gerenciamento de estado
- **Redux Thunk 2.4** - Middleware para ações assíncronas
- **React Redux 8.1** - Binding React + Redux
- **React Router 6** - Roteamento
- **Axios** - Cliente HTTP
- **PokéAPI** - API externa de dados

## 📈 Próximos Passos

Para expandir o aprendizado, considere implementar:

1. **Redux Toolkit** para simplificar boilerplate
2. **RTK Query** para cache e sincronização automática
3. **Middleware customizado** para logging ou analytics
4. **Persistência** com redux-persist
5. **Testing** com Jest + Redux Testing Library
6. **DevTools** para debugging avançado

## 🤝 Contribuindo

Este é um projeto educacional. Contribuições que melhorem a didática e demonstração dos conceitos Redux são bem-vindas!

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

---

**Feito com ❤️ para aprender Redux**