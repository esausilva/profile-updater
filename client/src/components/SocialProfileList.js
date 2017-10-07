import React, { Component } from 'react';
import { object } from 'prop-types';
import { Icon, Button } from 'semantic-ui-react';

import { readUserFromFirebase } from '../library/firebaseMethods';
import API from '../api';
import { isEmptyObject } from '../library/utils';

import styles from './SocialProfileList.css';

class SocialProfileList extends Component {
  static propTypes = {
    firebase: object.isRequired
  };

  state = {
    profiles: [],
    userCredentials: {}
  };

  /**
   * Checks if user is logged in, if so then reads user's tokens from Firebase database,
   * and sets the user's tokens to state.
   */
  componentDidMount() {
    const { firebase } = this.props;

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        readUserFromFirebase(firebase.database(), user.uid).then(savedUser =>
          this.setState(
            {
              userCredentials: savedUser
            },
            () => this.getProfilesInfo()
          )
        );
      }
    });
  }

  /**
   * Calls provider APIs to read user's profile information
   */
  getProfilesInfo = async () => {
    const { userCredentials } = this.state;
    const promisesArr = Object.keys(userCredentials).map(provider => {
      if (provider === 'github') {
        return API.fetchGithubUser(userCredentials.github);
      }
      if (provider === 'twitter') {
        return API.fetchTwitterUser('_esausilva', userCredentials.twitter);
      }
    });
    const resolved = await Promise.all(promisesArr);
    const profiles = resolved.map(profile => {
      if (profile.provider === 'github') {
        return {
          github: {
            location: profile.location,
            url: profile.blog,
            company: profile.company,
            bio: profile.bio,
            profilePhoto: profile.avatar_url,
            homepage: profile.html_url
          }
        };
      }
      if (profile.provider === 'twitter') {
        return {
          twitter: {
            location: profile.location,
            url: profile.entities.url.urls[0].expanded_url,
            bio: profile.description,
            profilePhoto: profile.profile_image_url,
            homepage: `https://twitter.com/${profile.screen_name}`
          }
        };
      }
    });

    this.setState({ profiles });
  };

  /**
   * Dinamically add styles for follow along "dropdown"
   * @param {object} e - Click event
   */
  handleEnter = e => {
    const el = e.target;
    const { triggerEnter, triggerEnterActive, open, infoBlock } = styles;

    el.classList.add(triggerEnter);
    setTimeout(
      () =>
        el.classList.contains(triggerEnter) &&
        el.classList.add(triggerEnterActive),
      150
    );
    this.background.classList.add(open);

    const info = el.nextElementSibling;
    const infoCoords = info.getBoundingClientRect();
    const containerCoords = this.container.getBoundingClientRect();
    const coords = {
      height: infoCoords.height,
      width: infoCoords.width,
      top: infoCoords.top - (containerCoords.top + 60),
      left: infoCoords.left - containerCoords.left
    };

    this.background.style.setProperty('width', `${coords.width}px`);
    this.background.style.setProperty('height', `${coords.height}px`);
    this.background.style.setProperty(
      'transform',
      `translate(${coords.left}px, ${coords.top}px)`
    );
  };

  /**
   * Removes dynamic "dropdown" styles
   * @param {object} e - Click event
   */
  handleLeave = e => {
    const { triggerEnter, triggerEnterActive, open } = styles;

    e.target.classList.remove(triggerEnter, triggerEnterActive);
    this.background.classList.remove(open);
  };

  renderProfiles = () => {
    const { containerInner, logo, info, url } = styles;

    return this.state.profiles.map(profile => {
      const provider = Object.keys(profile)[0];
      const { location, homepage, profilePhoto, url, bio, company } = profile[
        provider
      ];

      return (
        <div className={containerInner} key={provider}>
          <div className={logo}>
            <a href={homepage} target="_blank">
              <Icon name={provider} size="huge" inverted />
            </a>
            <Button color="red" size="mini" inverted compact>
              Unlink
            </Button>
          </div>
          <img
            src={profilePhoto}
            width="130"
            height="130"
            onMouseEnter={this.handleEnter}
            onMouseLeave={this.handleLeave}
          />
          <div className={info}>
            <label>
              <strong>Location:</strong>
            </label>{' '}
            {location}
            <br />
            <label>
              <strong>Company:</strong>
            </label>{' '}
            {company === undefined ? 'N/A' : company}
            <br />
            <label>
              <strong>Website:</strong>
            </label>{' '}
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
            <br />
            <label>
              <strong>Bio:</strong>
            </label>{' '}
            {bio}
          </div>
        </div>
      );
    });
  };

  render() {
    const { container, dropdownBackground, arrow } = styles;

    return (
      <div className={container} ref={div => (this.container = div)}>
        <div
          className={dropdownBackground}
          ref={div => (this.background = div)}
        >
          <span className={arrow} />
        </div>
        {this.renderProfiles()}
      </div>
    );
  }
}

export default SocialProfileList;
