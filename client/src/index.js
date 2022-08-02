import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';
import Associations from './components/Associations';
import CustomHeader from './components/CustomHeader';
import CustomFooter from './components/Footer';
import { DonationForm } from './components/DonationForm';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomHeader/>
      <div className='app-container'>
        <Routes>
          <Route path='/' element={<App/>} />
          <Route path='/associations' element={<Associations/>} />
          <Route path='/associations/:id/donnate' element={<DonationForm/>} />
          <Route path='*' element={
            <h1>
              <p>There's nothing here!</p>
            </h1>
          } />
        </Routes>
      </div>
      <CustomFooter/>
    </BrowserRouter>
  </React.StrictMode>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
