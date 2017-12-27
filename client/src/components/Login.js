import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

import Content from '../containers/Content';
import SocialButtonList from './SocialButtonList';
import firebase from '../firebase';
import { bl } from '../library/buttonListInitial';
import { SOCIAL_BUTTON_SIZE_BIG } from '../library/constants';

import { h1 } from './Login.css';

class Login extends Component {
  state = {
    buttonList: bl(firebase, 'black')
  };

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
        <SocialButtonList
          size={SOCIAL_BUTTON_SIZE_BIG}
          firebase={firebase}
          buttonList={this.state.buttonList}
        />
        <Header as="h3">About</Header>
        <p>
          A React App to Update Your Social Media Profiles: Twitter, GitHub &
          Facebook. The purpose is to type your profile information once, and
          then send the updates to your profile in Twitter, GitHub & Facebook.
        </p>
      </Content>
    );
  }
}

export default Login;
