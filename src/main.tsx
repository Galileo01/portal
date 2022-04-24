import * as React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'normalize.css'

import ErrorBoundary from './components/error-boundary'
import { UserInfoProvider } from './store/user-info'

import './assets/style/global.less'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ErrorBoundary>
        <UserInfoProvider>
          <App />
        </UserInfoProvider>
      </ErrorBoundary>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
