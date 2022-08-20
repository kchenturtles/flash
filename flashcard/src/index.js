import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
// const head = ReactDOM.createHead(document.getElementById('head'));
// head.render(
//   <title>
//     Flash
//   </title>
// );
root.render(
  <React.StrictMode>
    <div id = "header">
    <img src = {require ("./images/turtle-logo.png")} alt = "turtle-logo" className = "App-logo" />
    <h1>Flashcard Maker</h1> </div>
    <App id = "App"/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
