import React from 'react';
import { object, func } from 'prop-types';
import { Container, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import firebase from '../firebase';
import SocialButtonList from './SocialButtonList';
import { SOCIAL_BUTTON_SIZE_SMALL } from '../library/constants';

import { h1, layout, logout as logoutStyle } from './SideMenu.css';

const SideMenu = () => {
  const logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('User signed out.'))
      .catch(err => console.error(err));
  };

  return (
    <Container fluid className={layout}>
      <Link to="/updater">
        <Header as="h1" className={h1} inverted>
          profile<br />updater
        </Header>
      </Link>
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

export default SideMenu;
