import React from 'react';
import {ThemeContext} from 'react-navigation';

export default Component => props => (
  <ThemeContext.Consumer>
    {theme => <Component theme={theme} {...props} />}
  </ThemeContext.Consumer>
);
