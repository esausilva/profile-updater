import React, { Component } from 'react';
import { node } from 'prop-types';
import { Sidebar, Icon } from 'semantic-ui-react';

import SideMenu from '../components/SideMenu';

import styles from './Layout.css';

/**
 * Main area layout.
 */
class Layout extends Component {
  static propTypes = {
    children: node.isRequired
  };

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
    const menuStyle = `ui black huge launch right attached button ${
      menuButton
    }`;

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
          <SideMenu />
        </Sidebar>
        <Sidebar.Pusher dimmed={this.state.pusherDimmed}>
          <div className={menuStyle} onClick={this.toggleVisibility}>
            <Icon name="content" />
          </div>
          {this.props.children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default Layout;
