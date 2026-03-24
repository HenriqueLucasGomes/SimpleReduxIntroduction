import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import App from './AppJSX';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(Provider, { store: store },
      React.createElement(BrowserRouter, null,
        React.createElement(App, null)
      )
    )
  )
);
