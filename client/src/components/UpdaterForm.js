import React, { Component } from 'react';
import { object } from 'prop-types';
import {
  Grid,
  Header,
  Form,
  Input,
  TextArea,
  Message
} from 'semantic-ui-react';
import update from 'immutability-helper';

import Layout from '../containers/Layout';
import Content from '../containers/Content';
import firebase from '../firebase';
import { readUserFromFirebase } from '../library/firebaseMethods';
import API from '../api';
import { firstLetterToUpper } from '../library/utils';

import { count, highlight } from './UpdaterForm.css';

class UpdaterForm extends Component {
  state = {
    fields: {
      location: '',
      url: '',
      company: '',
      bio: ''
    },
    count: {
      location: 0,
      url: 0,
      company: 0,
      bio: 0
    },
    hasTwitter: false,
    userCredentials: {},
    message: {
      color: 'grey',
      hidden: true,
      header: '',
      text: ''
    }
  };

  /**
   * Checks if user is logged in, if so then reads user's tokens from Firebase database,
   * checks if Twitter is one of the social providers and sets the user's tokens to state.
   */
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        readUserFromFirebase(firebase.database(), user.uid).then(savedUser =>
          this.setState({
            hasTwitter: user.providerData
              .map(p => p.providerId)
              .includes('twitter.com'),
            userCredentials: savedUser
          })
        );
      }
    });
  }

  /**
   * Handles input change and updates state with input values and input lenght count.
   * @param {object} e - Click event
   */
  handleChange = e => {
    const { fields, count } = this.state;
    const { name, value } = e.target;

    this.setState({
      fields: update(fields, {
        [name]: {
          $set: value
        }
      }),
      count: update(count, {
        [name]: {
          $set: value.length
        }
      })
    });
  };

  /**
   * Handles form submission, updates user's profile in their connected social account(s),
   * resets input state, and displays (un)successful message.
   * @param {object} e - Click event
   */
  handleSubmit = async e => {
    e.preventDefault();
    let providers = [];
    const { userCredentials, fields } = this.state;
    const promisesArr = Object.keys(userCredentials).map(provider => {
      providers.push(firstLetterToUpper(provider));

      if (provider === 'github') {
        return API.updateGithubUserProfile(fields, userCredentials.github);
      }
      if (provider === 'twitter') {
        return API.updateTwitterUserProfile(fields, userCredentials.twitter);
      }
      if (provider === 'facebook') {
        return API.updateFacebookUserProfile(fields, userCredentials.facebook);
      }
    });

    await Promise.all(promisesArr);

    this.setState({
      fields: {
        location: '',
        url: '',
        company: '',
        bio: ''
      },
      count: {
        location: 0,
        url: 0,
        company: 0,
        bio: 0
      },
      message: {
        hidden: false,
        color: 'green',
        text: `Successfully updated: ${providers.join(', ')}`
      }
    });
  };

  /**
   * Styles the counter number underneath each input, if the user has Twitter connected, then
   * after X number characters the style changes.
   */
  counterStyle = (field, chars) => {
    const countHighlight = `${count} ${highlight}`;
    const { hasTwitter } = this.state;

    return hasTwitter && field > chars ? countHighlight : count;
  };

  renderForm = () => {
    const {
      location: locationValue,
      url: urlValue,
      company: companyValue,
      bio: bioValue
    } = this.state.fields;
    const {
      location: locationCount,
      url: urlCount,
      company: companyCount,
      bio: bioCount
    } = this.state.count;

    return (
      <Form onSubmit={this.handleSubmit} method="POST">
        <Form.Field
          control={Input}
          label="Location"
          name="location"
          placeholder="Enter your location"
          value={locationValue}
          onChange={this.handleChange}
        />
        <span className={this.counterStyle(locationCount, 30)}>
          {locationCount}
        </span>
        <Form.Field
          control={Input}
          label="Blog / Website URL"
          name="url"
          placeholder="Enter your blog / website address"
          value={urlValue}
          onChange={this.handleChange}
        />
        <span className={this.counterStyle(urlCount, 100)}>{urlCount}</span>
        <Form.Field
          control={Input}
          label="Company"
          name="company"
          placeholder="Enter your company"
          value={companyValue}
          onChange={this.handleChange}
        />
        <span className={count}>{companyCount}</span>
        <Form.Field
          control={TextArea}
          label="Bio"
          name="bio"
          placeholder="Enter your bio"
          value={bioValue}
          onChange={this.handleChange}
        />
        <span className={this.counterStyle(bioCount, 160)}>{bioCount}</span>
        <Form.Button content="Submit" type="submit" primary />
      </Form>
    );
  };

  handleMessageDismiss = () => {
    this.setState({
      message: {
        hidden: true
      }
    });
  };

  render() {
    const { color, hidden, header, text } = this.state.message;

    return (
      <Layout>
        <Content>
          <Message
            color={color}
            hidden={hidden}
            onDismiss={this.handleMessageDismiss}
          >
            <Message.Header>{header}</Message.Header>
            <p>{text}</p>
          </Message>
          <Grid columns={2} divided stackable>
            <Grid.Row>
              <Grid.Column width={12}>{this.renderForm()}</Grid.Column>
              <Grid.Column width={4}>
                <Header as="h3">Twitter Limitations</Header>
                <p>
                  Twitter has some limitations in how much text you can enter:
                </p>
                <ul>
                  <li>Location: 30 characters</li>
                  <li>Blog/Website: 100 characters</li>
                  <li>Company: N/A</li>
                  <li>Bio: 160 characters</li>
                </ul>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Content>
      </Layout>
    );
  }
}

export default UpdaterForm;
