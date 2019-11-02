import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {Provider, DefaultTheme, DarkTheme} from 'react-native-paper';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Snackbar from 'react-native-snackbar';

import TranslationService from './utils/translationService';

import Login from './containers/login';
import Dashboard from './containers/dashboard';
import Document from './containers/document';
import Report from './containers/report';
import SideMenu from './containers/sideMenu';

import Header from './components/header';

import * as constants from './constants';

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
                Report,
                Document,
              },
              {
                backBehavior: 'history',
                shifting: true,
              },
            ),
          },
          {
            defaultNavigationOptions: ({navigation}) => ({
              headerTitle: () => <Header navigation={navigation} />,
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
    (async () => {
      try {
        await TranslationService.init();
      } catch (e) {
        Snackbar.show({
          title: e.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    })();
    super(props);
    this.state = {
      darkTheme: false,
      clientCode: 0,
    };
  }

  onThemeChange = () =>
    this.setState(({darkTheme}) => ({darkTheme: !darkTheme}));

  updateClientCode = value => this.setState({clientCode: value});

  render() {
    const {darkTheme, clientCode} = this.state;
    const paperTheme = darkTheme ? DarkTheme : DefaultTheme;
    const rootTheme = darkTheme ? constants.DARK_THEME : constants.LIGHT_THEME;
    return (
      <Provider theme={paperTheme}>
        <Root
          theme={rootTheme}
          screenProps={{
            darkTheme,
            clientCode,
            updateTheme: this.onThemeChange,
            updateClientCode: this.updateClientCode,
          }}
        />
      </Provider>
    );
  }
}
