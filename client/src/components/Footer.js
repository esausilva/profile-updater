import React from 'react';
import { Divider, Icon } from 'semantic-ui-react';

import { pullRight, margins } from './Footer.css';

const Footer = () => {
  return (
    <div className={margins}>
      <Divider />
      <p className={pullRight}>
        Made with <Icon name="heart" color="red" /> by Esau Silva
      </p>
    </div>
  );
};

export default Footer;
