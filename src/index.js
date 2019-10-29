import React, {Component} from 'react';
import {Provider, DefaultTheme, DarkTheme} from 'react-native-paper';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

import Login from './containers/login';
import Dashboard from './containers/dashboard';
import SideMenu from './containers/sideMenu';

import * as constants from './constants';

const Root = createAppContainer(
  createSwitchNavigator({
    Login,
    Root: createDrawerNavigator(
      {
        Main: createStackNavigator(
          {
            Dashboard,
          },
          {
            defaultNavigationOptions: () => ({
              header: null,
            }),
          },
        ),
      },
      {
        contentComponent: SideMenu,
      },
    ),
  }),
);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkTheme: false,
    };
  }

  onThemeChange = () =>
    this.setState(({darkTheme}) => ({darkTheme: !darkTheme}));

  render() {
    const {darkTheme} = this.state;
    const paperTheme = darkTheme ? DarkTheme : DefaultTheme;
    const rootTheme = darkTheme ? constants.DARK_THEME : constants.LIGHT_THEME;
    return (
      <Provider theme={paperTheme}>
        <Root
          theme={rootTheme}
          screenProps={{darkTheme, updateTheme: this.onThemeChange}}
        />
      </Provider>
    );
  }
}
