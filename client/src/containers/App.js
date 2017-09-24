import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import Login from '../components/Login';
import Updater from '../components/Updater';

const NoMatch = () => {
  return <div>Page Not Found</div>;
};

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/updater" component={Updater} />
          <Route exact path="/" component={Login} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
