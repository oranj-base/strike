import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './popup/popup';
import './popup/index.css';
// import Provider from './popup/provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Provider> */}
    <Popup />
    {/* </Provider> */}
  </React.StrictMode>,
);
