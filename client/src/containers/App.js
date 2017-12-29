import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import ImportedComponent from 'react-imported-component';

import Loading from '../components/Loading';

const AsyncUpdaterForm = ImportedComponent(
  () =>
    import(/* webpackChunkName:'UpdaterForm' */ '../components/UpdaterForm'),
  {
    LoadingComponent: Loading
  }
);
const AsyncLogin = ImportedComponent(
  () => import(/* webpackChunkName:'Login' */ '../components/Login'),
  {
    LoadingComponent: Loading
  }
);
const AsyncNoMatch = ImportedComponent(
  () => import(/* webpackChunkName:'NoMatch' */ '../components/NoMatch'),
  {
    LoadingComponent: Loading
  }
);

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/updater" component={AsyncUpdaterForm} />
          <Route exact path="/" component={AsyncLogin} />
          <Route component={AsyncNoMatch} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
