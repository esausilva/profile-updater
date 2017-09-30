import React from 'react';
import { node, string } from 'prop-types';
import { Container } from 'semantic-ui-react';

import Footer from '../components/Footer';

import { main } from './Content.css';

const propTypes = {
  children: node.isRequired,
  align: string
};

const defaultProps = {
  align: 'left'
};

/**
 * Base layout.
 */
const Content = ({ children, align }) => {
  return (
    <Container textAlign={align} className={main}>
      {children}
      <Footer />
    </Container>
  );
};

Content.propTypes = propTypes;
Content.defaultProps = defaultProps;

export default Content;
