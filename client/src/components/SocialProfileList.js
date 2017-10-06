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
          <img src={profilePhoto} alt="placeholder" width="130" height="130" />
          <div className={info}>
            <p>
              <label>
                <strong>Location:</strong>
              </label>{' '}
              {location}
            </p>
            <p>
              <label>
                <strong>Company:</strong>
              </label>{' '}
              {company === undefined ? 'N/A' : company}
            </p>
            <p>
              <label>
                <strong>Website:</strong>
              </label>{' '}
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </p>
            <p>
              <label>
                <strong>Bio:</strong>
              </label>{' '}
              {bio}
            </p>
          </div>
        </div>
      );
    });
  };

  render() {
    return <div className={styles.container}>{this.renderProfiles()}</div>;
  }
}

export default SocialProfileList;
