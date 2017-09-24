import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { Container, Header, Icon } from 'semantic-ui-react';

import SocialButtonList from './SocialButtonList';
import { SOCIAL_BUTTON_SIZE_SMALL } from '../library/constants';

import { h1, layout, logout as logoutStyle } from './SideMenu.css';

const propTypes = {
  firebase: object.isRequired
};

const SideMenu = ({ firebase }) => {
  const logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('User signed out.'))
      .catch(err => console.error(err));
  };

  return (
    <Container fluid className={layout}>
      <Header as="h1" className={h1} inverted>
        profile<br />updater
      </Header>
      <SocialButtonList
        size={SOCIAL_BUTTON_SIZE_SMALL}
        orientation="vertical"
        firebase={firebase}
      />
      <Icon
        name="log out"
        size="large"
        color="red"
        circular={true}
        inverted
        onClick={logOut}
        className={logoutStyle}
      />
    </Container>
  );
};

SideMenu.propTypes = propTypes;

export default SideMenu;
