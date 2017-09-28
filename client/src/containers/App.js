import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

import Login from '../components/Login';
import UpdaterForm from '../components/UpdaterForm';
import Layout from './Layout';
import Content from './Content';

const NoMatch = () => {
  return (
    <Layout>
      <Content>
        <Header as="h1">Ooops! Page Not Found</Header>
      </Content>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/updater" component={UpdaterForm} />
          <Route exact path="/" component={Login} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
