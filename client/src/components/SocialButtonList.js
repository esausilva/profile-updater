import React, { Component } from 'react';
import { string, object } from 'prop-types';
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
    size: string.isRequired,
    orientation: string,
    firebase: object.isRequired
  };

  static defaultProps = {
    orientation: HORIZONTAL
  };

  state = {
    buttonList: {
      github: {
        color: this.props.orientation === HORIZONTAL ? 'black' : 'grey',
        visible: true,
        provider: () => {
          const provider = new this.props.firebase.firebase_.auth
            .GithubAuthProvider();
          provider.addScope('user');
          return provider;
        }
      },
      twitter: {
        color: 'twitter',
        visible: true,
        provider: () =>
          new this.props.firebase.firebase_.auth.TwitterAuthProvider()
      },
      facebook: {
        color: 'facebook',
        visible: true,
        provider: () =>
          new this.props.firebase.firebase_.auth.FacebookAuthProvider()
      }
    }
  };

  /**
   * Checks if user is logged in, if so then reads connected social providers and changes
   * the visibility of the social button icons.
   */
  componentDidMount() {
    const { firebase } = this.props;

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const updatedButtonList = user.providerData.reduce(
          (acc, providerObj) => {
            const providerId = providerObj.providerId.split('.')[0];
            acc = update(acc, {
              [providerId]: {
                visible: {
                  $set: false
                }
              }
            });
            return acc;
          },
          { ...this.state.buttonList }
        );

        this.setState({
          buttonList: updatedButtonList
        });
      } else {
        this.props.history.push('/');
      }
    });
  }

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
      const db = this.props.firebase.database();
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

      if (this.props.orientation === HORIZONTAL) {
        this.props.history.push('/updater');
      } else {
        this.setState({
          buttonList: update(this.state.buttonList, {
            [provider]: {
              visible: {
                $set: false
              }
            }
          })
        });
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
    const { firebase } = this.props;
    const providerObject = this.state.buttonList[providerName].provider();

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
    const { orientation, size } = this.props;
    const button = this.state.buttonList[key];
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
    const { orientation, size } = this.props;
    let display = '';

    if (orientation === HORIZONTAL && size === SOCIAL_BUTTON_SIZE_BIG)
      display = flexLoginButtons;
    else if (orientation === VERTICAL && size === SOCIAL_BUTTON_SIZE_SMALL)
      display = flexUpdaterButtons;

    return (
      <div className={display}>
        {Object.keys(this.state.buttonList).map(this.renderButtonList)}
      </div>
    );
  }
}

export default withRouter(SocialButtonList);
