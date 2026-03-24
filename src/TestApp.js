import React from 'react';

function TestApp() {
  return React.createElement('div', { style: { padding: '20px' } }, 
    React.createElement('h1', { style: { color: 'green' } }, '🎉 React is Working!'),
    React.createElement('p', null, 'This component uses React.createElement instead of JSX'),
    React.createElement('div', { style: { marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' } },
      React.createElement('h2', null, 'Debug Information:'),
      React.createElement('ul', null,
        React.createElement('li', null, '✅ React component rendered'),
        React.createElement('li', null, '✅ No JSX syntax used'),
        React.createElement('li', null, '✅ Should work without JSX parsing')
      )
    )
  );
}

export default TestApp;
