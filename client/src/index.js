import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/App';

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );

render(App);

/** 
 * Hot Module Replacement 
 */
if (module.hot) module.hot.accept('./containers/App', () => render(App));
