import React from 'react';
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

const propTypes = {
  size: PropTypes.string.isRequired,
  orientation: PropTypes.string,
  firebase: PropTypes.object.isRequired,
  buttonList: PropTypes.object.isRequired,
  updateSideMenuItems: PropTypes.func
};

const defaultProps = {
  orientation: HORIZONTAL
};

const SocialButtonList = props => {
  /**
   * Returns an object with encrypted access tokens and secret token.
   * Returns:
   * {
   *    accessToken: 'U2F...xU=',
   *    secret: 'U2F...dA=='
   * }
   * @param {object} data - User authentication data
   */
  const processAuthData = data =>
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
  const authHandler = async authData => {
    if (authData) {
      const { firebase, orientation, history, updateSideMenuItems } = props;
      const db = firebase.database();
      const userId = authData.user.uid;
      const provider = authData.credential.providerId.split('.')[0];
      const savedUser = await readUserFromFirebase(db, userId);
      const credentials = processAuthData(authData.credential);
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
  const authenticate = (e, providerName) => {
    e.preventDefault();
    const { firebase, buttonList } = props;
    const providerObject = buttonList[providerName].provider();

    if (!firebase.auth().currentUser) {
      firebase
        .auth()
        .signInWithPopup(providerObject)
        .then(authHandler)
        .catch(err => console.error(err));
    } else {
      firebase
        .auth()
        .currentUser.linkWithPopup(providerObject)
        .then(authHandler)
        .catch(err => console.error(err));
    }
  };

  /** 
   * Renders the social login buttons. 
   */
  const renderButtonList = key => {
    const { widthLogin, widthUpdater, hide } = styles;
    const { orientation, size, buttonList } = props;
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
        onClick={e => authenticate(e, key)}
      >
        <Button color={button.color} size={size} className={btnStyle}>
          <Icon name={key} /> {key}
        </Button>
      </a>
    );
  };

  let display = '';
  if (
    props.orientation === HORIZONTAL &&
    props.size === SOCIAL_BUTTON_SIZE_BIG
  ) {
    display = styles.flexLoginButtons;
  } else if (
    props.orientation === VERTICAL &&
    props.size === SOCIAL_BUTTON_SIZE_SMALL
  ) {
    display = styles.flexUpdaterButtons;
  }

  return (
    <div className={display}>
      {Object.keys(props.buttonList).map(renderButtonList)}
    </div>
  );
};

SocialButtonList.propTypes = propTypes;
SocialButtonList.defaultProps = defaultProps;

export default withRouter(SocialButtonList);
