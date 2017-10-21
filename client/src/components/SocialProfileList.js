import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'semantic-ui-react';

import { removeUserProviderFromFirebase } from '../library/firebaseMethods';
import { firstLetterToUpper } from '../library/utils';

import styles from './SocialProfileList.css';

class SocialProfileList extends Component {
  static propTypes = {
    firebase: PropTypes.object.isRequired,
    profiles: PropTypes.array.isRequired,
    userCredentials: PropTypes.object.isRequired,
    updateSideMenuItems: PropTypes.func.isRequired
  };

  /**
   * @param {string} provider - Social media provider
   * @param {string} userId - User ID of the currently logged in user
   */
  removeProviderFromFirebase = (provider, userId) => {
    removeUserProviderFromFirebase(
      this.props.firebase.database(),
      userId,
      provider
    );
  };

  /**
   * @param {object} e - Click event
   * @param {string} provider - Social media provider
   */
  handleProviderUnlink = async (e, providerId) => {
    if (
      confirm(`Do you really want to unlink ${firstLetterToUpper(providerId)}?`)
    ) {
      const { firebase, userCredentials, updateSideMenuItems } = this.props;

      await firebase.auth().currentUser.unlink(`${providerId}.com`);
      await this.removeProviderFromFirebase(
        providerId,
        firebase.auth().currentUser.uid
      );
      delete userCredentials[providerId];
      updateSideMenuItems(true, userCredentials, providerId);
    }
  };

  /**
   * Dinamically add styles for follow along "dropdown"
   * @param {object} e - Mouse enter event
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
   * @param {object} e - Mouse leave event
   */
  handleLeave = e => {
    const { triggerEnter, triggerEnterActive, open } = styles;

    e.target.classList.remove(triggerEnter, triggerEnterActive);
    this.background.classList.remove(open);
  };

  renderProfiles = () => {
    const { containerInner, logo, info, url } = styles;

    return this.props.profiles.map(profile => {
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
            <Button
              color="red"
              size="mini"
              onClick={e => this.handleProviderUnlink(e, provider)}
              inverted
              compact
            >
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