import React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'normalize.css'

import './index.css'
import App from './App'
import { EditerDataProvider } from './store/editer-data'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <EditerDataProvider>
        <App />
      </EditerDataProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
