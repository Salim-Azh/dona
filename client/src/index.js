import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';
import Associations from './components/Associations';
import CustomHeader from './components/CustomHeader';
import CustomFooter from './components/Footer';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomHeader/>
      <div className='app-container'>
        <Routes>
          <Route path='/' element={<App/>} />
          <Route path='/associations' element={<Associations/>} />
          <Route path='*' element={
            <h1>
              <p>There's nothing here!</p>
            </h1>
          } />
        </Routes>
      </div>
      <CustomFooter/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
