import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import AsyncBundle from './AsyncBundle';
//import Login from '../components/Login';

const AsyncUpdaterForm = props => {
  return (
    <AsyncBundle load={() => import('../components/UpdaterForm')}>
      {UpdaterForm => <UpdaterForm {...props} />}
    </AsyncBundle>
  );
};

const AsyncLogin = props => {
  return (
    <AsyncBundle load={() => import('../components/Login')}>
      {Login => <Login {...props} />}
    </AsyncBundle>
  );
};

const AsyncNoMatch = props => {
  return (
    <AsyncBundle load={() => import('../components/NoMatch')}>
      {NoMatch => <NoMatch {...props} />}
    </AsyncBundle>
  );
};

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
