import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from './store'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#00264d',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#f5a623', secondary: '#00264d' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
