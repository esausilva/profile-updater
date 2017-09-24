import React, { Component } from 'react';
import { Sidebar, Icon } from 'semantic-ui-react';

import SideMenu from './SideMenu';
import UpdaterForm from './UpdaterForm';
import firebase from '../firebase';

import styles from './Updater.css';

/**
 * Secure area layout.
 */
class Updater extends Component {
  state = {
    sidebarVisibility: false,
    pusherDimmed: false
  };

  toggleVisibility = () =>
    this.setState({
      sidebarVisibility: !this.state.sidebarVisibility,
      pusherDimmed: !this.state.pusherDimmed
    });

  render() {
    const { containerStyle, div, menuButton, mobileHamburger } = styles;
    const menuStyle = `ui black huge launch right attached button ${menuButton}`;

    return (
      <Sidebar.Pushable as={'div'} className={div}>
        <Sidebar
          as={'div'}
          animation="push"
          width="wide"
          visible={this.state.sidebarVisibility}
          className={containerStyle}
        >
          <Icon
            name="content"
            size="large"
            inverted
            className={mobileHamburger}
            onClick={this.toggleVisibility}
          />
          <SideMenu firebase={firebase} />
        </Sidebar>
        <Sidebar.Pusher dimmed={this.state.pusherDimmed}>
          <div className={menuStyle} onClick={this.toggleVisibility}>
            <Icon name="content" />
          </div>
          <UpdaterForm firebase={firebase} />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default Updater;
