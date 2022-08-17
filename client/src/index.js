import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import './index.css';
import CustomHeader from './components/CustomHeader';
import CustomFooter from './components/Footer';
import Routing from './Routing/Routing';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomHeader />
      <div className='app-container'>
        <Routing />
      </div>
      <CustomFooter />
    </BrowserRouter>
  </React.StrictMode>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
