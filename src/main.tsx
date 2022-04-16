import * as React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'normalize.css'

import ErrorBoundary from './components/error-boundary'

import './assets/style/global.less'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
