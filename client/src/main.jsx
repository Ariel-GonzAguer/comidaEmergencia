/**
 * @file Punto de entrada del cliente React.
 * Monta el componente {@link App} dentro del elemento `#root` del DOM
 * con `React.StrictMode` habilitado.
 *
 * @module main
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
