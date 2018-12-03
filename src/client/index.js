import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Main from '../shared/Main';
import buildStore from '../shared/redux/buildStore';

document.body.onload = () => {
  const rootEl = document.querySelector('.main-container');
  const state = JSON.parse(document.querySelector('#hiddenState').value);
  const store = buildStore(state);
  ReactDOM.hydrate(
      <Provider store={store}>
        <Main id='main'/>
      </Provider>
  , rootEl);
};
