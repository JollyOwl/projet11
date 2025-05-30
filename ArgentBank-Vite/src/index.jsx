import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; 
import store from './store'; 
import App from './App.jsx';
import './css/main.css';


ReactDOM.createRoot(document.getElementById('root')).render(
 
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);