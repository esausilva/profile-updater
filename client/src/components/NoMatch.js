import React from 'react';
import { Header } from 'semantic-ui-react';

import Layout from '../containers/Layout';
import Content from '../containers/Content';

const NoMatch = () => {
  return (
    <Layout>
      <Content>
        <Header as="h1">Ooops! Page Not Found!</Header>
      </Content>
    </Layout>
  );
};

export default NoMatch;
