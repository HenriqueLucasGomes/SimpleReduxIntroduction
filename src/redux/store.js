import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { enhancedPokemonReducer } from './pokemon/reducer';

// Configure Redux DevTools Extension
const composeEnhancers = 
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// Middleware configuration
const middleware = [thunk];

// Root reducer combining all feature reducers
const rootReducer = combineReducers({
  pokemon: enhancedPokemonReducer
});

// Create store with middleware and DevTools
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(...middleware)
  )
);

export default store;
