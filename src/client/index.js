import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Main from '../shared/Main';
import buildStore from '../shared/redux/buildStore';

document.body.onload = () => {
  const rootEl = document.querySelector('.main-container');
  const store = buildStore({});
  ReactDOM.render(
      <Provider store={store}>
        <Main id='main'/>
      </Provider>
  , rootEl);
};
