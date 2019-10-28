import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

import Login from './containers/login';
import Dashboard from './containers/dashboard';
import SideMenu from './containers/sideMenu';

const App = createAppContainer(
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

export default () => (
  <SafeAreaProvider>
    <SafeAreaView
      forceInset={{top: 'always', horizontal: 'never'}}
      style={styles.container}>
      <App />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
