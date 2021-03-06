import React, { Component } from 'react';
import { Container, Header, Icon } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import update from 'immutability-helper';

import SocialProfileList from './SocialProfileList';
import SocialButtonList from './SocialButtonList';
import firebase from '../firebase';
import API from '../api';
import { SOCIAL_BUTTON_SIZE_SMALL } from '../library/constants';
import { bl } from '../library/buttonListInitial';
import { readUserFromFirebase } from '../library/firebaseMethods';

import { h1, layout, logout as logoutStyle } from './SideMenu.css';

class SideMenu extends Component {
  state = {
    buttonList: bl(firebase, 'grey'),
    profiles: [],
    userCredentials: {}
  };

  /**
   * Checks if user is logged in, if so then reads connected social providers, changes
   * the visibility of the social button icons, reads user's tokens from Firebase database,
   * sets the user's tokens to state and gets connected profiles info.
   */
  componentDidMount() {
    firebase.auth().onAuthStateChanged(async user => {
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

        const userCredentials = await readUserFromFirebase(
          firebase.database(),
          user.uid
        );

        this.setState(
          {
            buttonList: updatedButtonList,
            userCredentials
          },
          () => this.getProfilesInfo()
        );
      } else {
        this.props.history.push('/');
      }
    });
  }

  isUndefinedOrBlank = property =>
    property === undefined || property === '' || property === null
      ? 'N/A'
      : property;

  buildUrl = link =>
    `<a href='${link}' target='_blank' rel='noopener noreferrer'>${link}</a>`;

  /**
   * Calls provider APIs to read user's profile information
   */
  getProfilesInfo = async () => {
    const { userCredentials } = this.state;
    const promisesArr = Object.keys(userCredentials).map(providerId => {
      if (providerId === 'github') {
        return API.fetchGithubUser(userCredentials.github);
      }
      if (providerId === 'twitter') {
        return API.fetchTwitterUser(
          userCredentials.twitter.username,
          userCredentials.twitter
        );
      }
      if (providerId === 'facebook') {
        return API.fetchFacebookUser(userCredentials.facebook);
      }
    });
    const resolved = await Promise.all(
      promisesArr.filter(promise => promise !== undefined)
    );
    const profiles = resolved.map(profile => {
      if (profile.provider === 'github') {
        return {
          github: {
            location: this.isUndefinedOrBlank(profile.location),
            url:
              this.isUndefinedOrBlank(profile.blog) === 'N/A'
                ? 'N/A'
                : this.buildUrl(profile.blog),
            company: this.isUndefinedOrBlank(profile.company),
            bio: this.isUndefinedOrBlank(profile.bio),
            profilePhoto: profile.avatar_url,
            homepage: profile.html_url
          }
        };
      }
      if (profile.provider === 'twitter') {
        return {
          twitter: {
            location: this.isUndefinedOrBlank(profile.location),
            url:
              this.isUndefinedOrBlank(profile.entities.url) === 'N/A'
                ? 'N/A'
                : this.buildUrl(profile.entities.url.urls[0].expanded_url),
            company: 'N/A',
            bio: this.isUndefinedOrBlank(profile.description),
            profilePhoto: profile.profile_image_url,
            homepage: `https://twitter.com/${profile.screen_name}`
          }
        };
      }
      if (profile.provider === 'facebook') {
        return {
          facebook: {
            location:
              this.isUndefinedOrBlank(profile.location) === 'N/A'
                ? 'N/A'
                : profile.location.name,
            url:
              this.isUndefinedOrBlank(profile.website) === 'N/A'
                ? 'N/A'
                : this.buildUrl(profile.website),
            company:
              this.isUndefinedOrBlank(profile.work) === 'N/A'
                ? 'N/A'
                : profile.work[0].employer.name,
            bio: this.isUndefinedOrBlank(profile.about),
            profilePhoto: profile.picture.data.url,
            homepage: profile.link
          }
        };
      }
    });

    this.setState({ profiles });
  };

  /**
   * Update the visibility of a provider's button
   * @param {bool} visibility
   * @param {string} providerId
   */
  updateProviderVisibility = (visibility, providerId) => {
    this.setState({
      buttonList: update(this.state.buttonList, {
        [providerId]: {
          visible: {
            $set: visibility
          }
        }
      })
    });
  };

  /**
   * Updates profiles and buttons when user unlinks or connects a provider
   * @param {bool} visibility
   * @param {object} - userCredentials - User's connected profile tokens
   * @param {string} providerId
   */
  updateSideMenuItems = (visibility, userCredentials, providerId) => {
    this.setState({ userCredentials }, () => {
      this.getProfilesInfo();
      this.updateProviderVisibility(visibility, providerId);
    });
  };

  logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('logged out');
        this.props.history.push('/');
      })
      .catch(err => console.error(err));
  };

  render() {
    return (
      <Container fluid className={layout}>
        <Link to="/updater">
          <Header as="h1" className={h1} inverted>
            profile<br />updater
          </Header>
        </Link>
        <SocialProfileList
          firebase={firebase}
          profiles={this.state.profiles}
          userCredentials={this.state.userCredentials}
          updateSideMenuItems={this.updateSideMenuItems}
        />
        <SocialButtonList
          size={SOCIAL_BUTTON_SIZE_SMALL}
          orientation="vertical"
          firebase={firebase}
          buttonList={this.state.buttonList}
          updateSideMenuItems={this.updateSideMenuItems}
        />
        <Icon
          name="log out"
          size="large"
          color="red"
          circular={true}
          inverted
          onClick={this.logOut}
          className={logoutStyle}
        />
      </Container>
    );
  }
}

export default withRouter(SideMenu);
