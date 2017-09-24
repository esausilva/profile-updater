import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

import Content from '../containers/Content';
import SocialButtonList from './SocialButtonList';
import firebase from '../firebase';
import { SOCIAL_BUTTON_SIZE_BIG } from '../library/constants';

import { h1 } from './Login.css';

class Login extends Component {
  /** 
   * Checks if user is logged in, if so then sends them to secure area .
   */
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push('/updater');
      }
    });
  }

  render() {
    return (
      <Content align="center">
        <Header as="h1" className={h1}>
          profile updater
        </Header>
        <Header as="h2">Connect With</Header>
        <SocialButtonList size={SOCIAL_BUTTON_SIZE_BIG} firebase={firebase} />
        <Header as="h3">About</Header>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          placerat eget nunc ac molestie. Suspendisse fringilla nisl et tellus
          ultricies, sit amet rutrum odio faucibus. Nunc tincidunt lectus a
          magna elementum, a placerat erat fringilla. Cras leo elit, tincidunt
          vulputate euismod in, ullamcorper gravida ipsum.{' '}
        </p>
      </Content>
    );
  }
}

export default Login;
