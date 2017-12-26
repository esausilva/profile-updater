import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import Loading from '../components/Loading';

const AsyncUpdaterForm = Loadable({
  loader: () => import('../components/UpdaterForm'),
  loading: Loading
});

const AsyncLogin = Loadable({
  loader: () => import('../components/Login'),
  loading: Loading
});

const AsyncNoMatch = Loadable({
  loader: () => import('../components/NoMatch'),
  loading: Loading
});

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
