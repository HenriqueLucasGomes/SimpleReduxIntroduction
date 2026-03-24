# GitHub Copilot Instructions

## Priority Guidelines

When generating code for this repository:

1. **Version Compatibility**: Always detect and respect the exact versions of languages, frameworks, and libraries used in this project
2. **Context Files**: Prioritize patterns and standards defined in the .github/copilot directory
3. **Codebase Patterns**: When context files don't provide specific guidance, scan the codebase for established patterns
4. **Architectural Consistency**: Maintain our layered architectural style and established boundaries
5. **Code Quality**: Prioritize maintainability, performance, security, accessibility, and testability in all generated code

## Technology Version Detection

Before generating code, scan the codebase to identify:

1. **Language Versions**: Detect the exact versions of programming languages in use
   - React ^18.2.0 with ES6+ features (target: es5 with modern transforms)
   - JavaScript with JSX support and ES modules
   - Never use language features beyond ES6 compatibility level

2. **Framework Versions**: Identify the exact versions of all frameworks
   - React ^18.2.0 (functional components with hooks)
   - Redux ^4.2.1 with redux-thunk ^2.4.2 for async operations
   - React-Redux ^8.1.3 for store connections
   - React-Router-Dom ^6.16.0 for routing
   - Axios ^1.5.0 for HTTP requests
   - React-Scripts 5.0.1 for build tooling

3. **Library Versions**: Note the exact versions of key libraries and dependencies
   - Generate code compatible with these specific versions
   - Never use APIs or features not available in the detected versions

## Context Files

Prioritize the following files in .github/copilot directory (if they exist):

- **architecture.md**: System architecture guidelines
- **tech-stack.md**: Technology versions and framework details
- **coding-standards.md**: Code style and formatting standards
- **folder-structure.md**: Project organization guidelines
- **exemplars.md**: Exemplary code patterns to follow

## Codebase Scanning Instructions

When context files don't provide specific guidance:

1. Identify similar files to the one being modified or created
2. Analyze patterns for:
   - Naming conventions
   - Code organization
   - Error handling
   - Logging approaches
   - Documentation style
   - Testing patterns
   
3. Follow the most consistent patterns found in the codebase
4. When conflicting patterns exist, prioritize patterns in newer files or files with higher test coverage
5. Never introduce patterns not found in the existing codebase

## Code Quality Standards

### Maintainability
- Write self-documenting code with clear naming following established patterns
- Follow the established Redux architecture: service → actions → reducer → operations → selectors
- Keep functions focused on single responsibilities
- Limit function complexity and length to match existing patterns
- Use consistent JSDoc comments as seen in existing files

### Performance
- Follow existing patterns for memory and resource management
- Use selector memoization patterns with `createSelector` from reselect
- Apply conditional rendering patterns evident in components
- Follow established patterns for asynchronous operations using Redux Thunk
- Optimize according to patterns evident in the codebase

### Security
- Follow existing patterns for input validation in service layer
- Apply the same sanitization techniques used in API calls
- Use axios configuration patterns matching existing setup
- Follow established error handling patterns that don't expose sensitive information
- Handle user input according to existing validation patterns

### Accessibility
- Follow existing accessibility patterns in JSX components
- Match semantic HTML usage with existing components
- Maintain keyboard navigation support consistent with existing code
- Follow established patterns for form handling and validation
- Apply text alternative patterns consistent with the codebase

### Testability
- Follow established patterns for testable code structure
- Match Redux testing approaches used in the codebase
- Apply the same patterns for separating concerns (service, actions, reducers)
- Follow established mocking patterns for external dependencies
- Match the component testing style used in existing tests

## Documentation Requirements

- Follow the exact JSDoc documentation format found in the codebase
- Match the style and completeness of existing component and function comments
- Document parameters, returns, and exceptions in the same style as existing code
- Follow existing patterns for inline code comments
- Match class-level and module-level documentation style and content

## Redux Architecture Patterns

### Core Redux Principles
- Follow the established service → actions → reducer → operations → selectors pattern
- All async logic must go through operations (Redux Thunk)
- Actions must be pure and follow the established naming conventions
- Reducers must be pure functions that never mutate state
- Use selectors for all data access from components

### Naming Conventions
- **Action Types**: `FEATURE_ACTION_TYPE` (SCREAMING_SNAKE_CASE)
- **Action Creators**: `featureActionType` (camelCase)
- **Selectors**: `selectFeatureProperty` (camelCase with 'select' prefix)
- **Operations**: `featureOperation` (camelCase with 'Operation' suffix)
- **Services**: `featureService` (camelCase with 'Service' suffix)

### File Organization
- **Components**: `ComponentName.js` (PascalCase)
- **Redux Files**: `lowercase.js` (service, actions, reducer, operations, selectors)
- **Folders**: `lowercase` (components, redux, styles)

### Action Pattern
Follow the established REQUEST/SUCCESS/FAILURE pattern for async operations:

```javascript
// Action Types
export const FEATURE_REQUEST = 'FEATURE_REQUEST';
export const FEATURE_SUCCESS = 'FEATURE_SUCCESS';
export const FEATURE_FAILURE = 'FEATURE_FAILURE';

// Action Creators
export const featureRequest = (params) => ({
  type: FEATURE_REQUEST,
  payload: { params }
});

export const featureSuccess = (data) => ({
  type: FEATURE_SUCCESS,
  payload: { 
    data,
    timestamp: Date.now()
  }
});

export const featureFailure = (error) => ({
  type: FEATURE_FAILURE,
  payload: { 
    error: error.message || 'Erro desconhecido',
    timestamp: Date.now()
  }
});
```

### Reducer Pattern
Follow the established reducer structure with proper state immutability:

```javascript
const featureReducer = (state = initialState.feature, action) => {
  switch (action.type) {
    case FEATURE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case FEATURE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: null,
        lastUpdated: action.payload.timestamp
      };
      
    case FEATURE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        lastUpdated: action.payload.timestamp
      };
      
    default:
      return state;
  }
};
```

### Service Layer Pattern
Follow the established service pattern for external API calls:

```javascript
export const featureService = {
  async performAction(params) {
    try {
      const response = await apiClient.get(`/endpoint/${params}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Resource "${params}" não encontrado`);
      }
      throw new Error('Erro ao realizar operação');
    }
  }
};
```

### Operations Pattern
Follow the established thunk pattern for async operations:

```javascript
export const featureOperation = (params) => {
  return async (dispatch, getState) => {
    dispatch(featureRequest(params));
    
    try {
      const result = await featureService.performAction(params);
      dispatch(featureSuccess(result));
    } catch (error) {
      dispatch(featureFailure(error));
    }
  };
};
```

### Selector Pattern
Follow the established selector pattern using createSelector for memoization:

```javascript
export const selectFeatureData = createSelector(
  [state => state.pokemon.feature],
  (feature) => feature.data
);

export const selectFeatureIsLoading = createSelector(
  [state => state.pokemon.feature],
  (feature) => feature.isLoading
);

export const selectFeatureError = createSelector(
  [state => state.pokemon.feature],
  (feature) => feature.error
);
```

## React Component Patterns

### Component Structure
Follow the established functional component structure with hooks:

```jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { operationName } from '../redux/pokemon/operations';
import { selectorName } from '../redux/pokemon/selectors';

const ComponentName = () => {
  // Local state
  const [localState, setLocalState] = useState('');
  
  // Redux state
  const dispatch = useDispatch();
  const reduxData = useSelector(selectorName);
  
  // Effects
  useEffect(() => {
    // Component lifecycle logic
  }, [dependency]);
  
  // Handlers
  const handleAction = () => {
    dispatch(operationName(params));
  };
  
  // Render
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### Hook Usage Patterns
- Use `useSelector` for accessing Redux state
- Use `useDispatch` for dispatching actions
- Use `useState` for local component state
- Use `useEffect` for side effects and lifecycle events
- Follow existing patterns for conditional hooks and custom hooks

### Event Handling
Follow the established event handling patterns:
- Form submissions prevent default and validate input
- Button clicks dispatch Redux operations
- Input changes update local state
- Use consistent naming for event handlers (`handle[Action]`)

## Error Handling Patterns

### Service Layer Errors
- Always wrap API calls in try/catch blocks
- Provide meaningful error messages in Portuguese
- Handle specific HTTP status codes (404, 500, etc.)
- Throw Error objects with descriptive messages

### Redux Error Handling
- Include error states in all async reducers
- Store error messages with timestamps
- Clear errors when starting new operations
- Use consistent error action payload structure

### Component Error Handling
- Display error messages to users using selectors
- Provide fallback UI for error states
- Clear errors when appropriate
- Show loading states during async operations

## State Management Patterns

### Initial State Structure
Follow the established initial state pattern:

```javascript
const initialState = {
  feature: {
    isLoading: false,
    data: null,
    error: null,
    lastUpdated: null
  }
};
```

### State Updates
- Always return new objects, never mutate existing state
- Use spread operator for shallow updates
- Handle array updates with proper immutability
- Include timestamps for state tracking

### Local Storage Integration
Follow the established pattern for localStorage integration:
- Use service layer for localStorage operations
- Sync with Redux state through operations
- Handle JSON serialization/deserialization
- Provide fallbacks for storage failures

## API Integration Guidelines

### Axios Configuration
Follow the established axios setup:
- Use the configured apiClient instance
- Set appropriate timeouts (10000ms)
- Handle different error response types
- Use lowercase endpoints for consistency

### Data Transformation
- Process API responses in service layer
- Extract relevant data using utility functions
- Maintain consistent data structures
- Handle missing or incomplete data gracefully

## Testing Approach

### Redux Testing
- Test action creators for correct payload structure
- Test reducers for proper state transformations
- Test selectors for correct data extraction
- Mock services for operations testing

### Component Testing
- Test component rendering with different props/state
- Test user interactions and event handlers
- Test Redux integration with mock store
- Test error states and loading states

## Performance Optimization

### Selector Optimization
- Use createSelector for memoization
- Avoid creating new objects in selectors
- Compose selectors for complex data
- Cache expensive computations

### Component Optimization
- Use React.memo for pure components
- Use useCallback for stable function references
- Use useMemo for expensive calculations
- Avoid unnecessary re-renders

### Bundle Optimization
- Follow code splitting patterns
- Use dynamic imports for large components
- Optimize asset loading
- Minimize bundle size

## Version Control Guidelines

- Follow Semantic Versioning patterns as applied in the codebase
- Document breaking changes in commit messages
- Follow the established branching strategy
- Include meaningful commit messages

## General Best Practices

- Follow naming conventions exactly as they appear in existing code
- Match code organization patterns from similar files
- Apply error handling consistent with existing patterns
- Follow the same approach to testing as seen in the codebase
- Match logging patterns from existing code
- Use the same approach to configuration as seen in the codebase
- Respect existing architectural boundaries without exception
- Match the style and patterns of surrounding code
- When in doubt, prioritize consistency with existing code over external best practices

## Project-Specific Guidance

- Scan the codebase thoroughly before generating any code
- This is a Pokemon-themed Redux learning application
- All features revolve around Pokemon data and user interactions
- API integration uses the PokeAPI (https://pokeapi.co/api/v2)
- Application includes search, list, favorites, and battle comparison features
- Follow the established service → actions → reducer → operations → selectors pattern
- Use Portuguese for user-facing messages and comments
- Maintain the educational nature of the codebase with clear documentation

---

*Last updated: 2025-09-09*
*This blueprint is based on analysis of the SimpleReduxIntroduction codebase patterns and should be updated when architectural changes are made.*
