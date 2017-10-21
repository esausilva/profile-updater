import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import update from 'immutability-helper';

import {
  SOCIAL_BUTTON_SIZE_BIG,
  SOCIAL_BUTTON_SIZE_SMALL,
  HORIZONTAL,
  VERTICAL
} from '../library/constants';
import { isEmptyObject, encrypt } from '../library/utils';
import {
  readUserFromFirebase,
  updateUserToFirebase
} from '../library/firebaseMethods';

import styles from './SocialButtonList.css';

class SocialButtonList extends Component {
  static propTypes = {
    size: PropTypes.string.isRequired,
    orientation: PropTypes.string,
    firebase: PropTypes.object.isRequired,
    buttonList: PropTypes.object.isRequired,
    updateSideMenuItems: PropTypes.func
  };

  static defaultProps = {
    orientation: HORIZONTAL
  };

  /**
   * Returns an object with encrypted access tokens and secret token.
   * Returns:
   * {
   *    accessToken: 'U2F...xU=',
   *    secret: 'U2F...dA=='
   * }
   * @param {object} data - User authentication data
   */
  processAuthData = data =>
    Object.keys(data).reduce((acc, key) => {
      if (key === 'accessToken' || key === 'secret') {
        acc[key] = encrypt(data[key]);
      }
      return acc;
    }, {});

  /**
   * Handles Firebase login authentication logic, if user authenticated, reads current 
   * user tokens from Firebase database, updates with new tokens and saves them to 
   * Firebase database.
   * @param {object} authData - Authentication object from Firebase upon login
   */
  authHandler = async authData => {
    if (authData) {
      const {
        firebase,
        orientation,
        history,
        updateSideMenuItems
      } = this.props;
      const db = firebase.database();
      const userId = authData.user.uid;
      const provider = authData.credential.providerId.split('.')[0];
      const savedUser = await readUserFromFirebase(db, userId);
      const credentials = this.processAuthData(authData.credential);
      let updatedUser = {};

      if (!isEmptyObject(savedUser)) {
        updatedUser = {
          userId,
          data: update(savedUser, {
            [provider]: { $set: { ...credentials } }
          })
        };
      } else {
        updatedUser = {
          userId,
          data: {
            [provider]: { ...credentials }
          }
        };
      }

      await updateUserToFirebase(db, updatedUser);

      // 'orientation' is 'HORIZONTAL' when in Login screen
      if (orientation === HORIZONTAL) {
        history.push('/updater');
      } else {
        updateSideMenuItems(false, updatedUser.data, provider);
      }
    }
  };

  /**
   * Calls Firebase API to authenticate user with a social provider.
   * @param {object} e - Click event
   * @param {string} providerName - Name of the social provider
   */
  authenticate = (e, providerName) => {
    e.preventDefault();
    const { firebase, buttonList } = this.props;
    const providerObject = buttonList[providerName].provider();

    if (!firebase.auth().currentUser) {
      firebase
        .auth()
        .signInWithPopup(providerObject)
        .then(this.authHandler)
        .catch(err => console.error(err));
    } else {
      firebase
        .auth()
        .currentUser.linkWithPopup(providerObject)
        .then(this.authHandler)
        .catch(err => console.error(err));
    }
  };

  /** 
   * Renders the social login buttons. 
   */
  renderButtonList = key => {
    const { widthLogin, widthUpdater, hide } = styles;
    const { orientation, size, buttonList } = this.props;
    const button = buttonList[key];
    let btnStyle = '';

    if (orientation === HORIZONTAL && size === SOCIAL_BUTTON_SIZE_BIG)
      btnStyle = widthLogin;
    else if (orientation === VERTICAL && size === SOCIAL_BUTTON_SIZE_SMALL)
      btnStyle = widthUpdater;

    return (
      <a
        key={key}
        href="#"
        className={button.visible ? '' : hide}
        onClick={e => this.authenticate(e, key)}
      >
        <Button color={button.color} size={size} className={btnStyle}>
          <Icon name={key} /> {key}
        </Button>
      </a>
    );
  };

  render() {
    const { flexLoginButtons, flexUpdaterButtons } = styles;
    const { orientation, size, buttonList } = this.props;
    let display = '';
    if (orientation === HORIZONTAL && size === SOCIAL_BUTTON_SIZE_BIG)
      display = flexLoginButtons;
    else if (orientation === VERTICAL && size === SOCIAL_BUTTON_SIZE_SMALL)
      display = flexUpdaterButtons;

    return (
      <div className={display}>
        {Object.keys(buttonList).map(this.renderButtonList)}
      </div>
    );
  }
}

export default withRouter(SocialButtonList);
