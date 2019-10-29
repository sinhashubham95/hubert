/* eslint-disable react-hooks/rules-of-hooks */

import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Provider, DefaultTheme, DarkTheme, Appbar} from 'react-native-paper';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import Login from './containers/login';
import Dashboard from './containers/dashboard';
import SideMenu from './containers/sideMenu';

import logo from './assets/logo.png';
import * as constants from './constants';
import {createStackNavigator} from 'react-navigation-stack';

const useStyles = theme =>
  StyleSheet.create({
    header: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    headerImage: {
      width: '78%',
      height: '100%',
      tintColor: theme.text,
      resizeMode: 'contain',
    },
  });

const Root = createAppContainer(
  createSwitchNavigator({
    Login,
    Root: createDrawerNavigator(
      {
        Main: createStackNavigator(
          {
            Tabs: createMaterialBottomTabNavigator(
              {
                Dashboard,
                Report: Dashboard,
              },
              {
                backBehavior: 'history',
              },
            ),
          },
          {
            defaultNavigationOptions: ({navigation, theme}) => ({
              headerTitle: () => (
                <View style={useStyles(theme).header}>
                  <Appbar.Action icon="menu" onPress={navigation.openDrawer} />
                  <Image source={logo} style={useStyles(theme).headerImage} />
                </View>
              ),
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
