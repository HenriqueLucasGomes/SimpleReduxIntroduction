import React from 'react';

// Simple test component without Redux or Router
function SimpleApp() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'green' }}>🎉 React is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2>Debug Information:</h2>
        <ul>
          <li>✅ React component rendered</li>
          <li>✅ CSS styles applied</li>
          <li>✅ No JavaScript errors</li>
        </ul>
      </div>
    </div>
  );
}

export default SimpleApp;
