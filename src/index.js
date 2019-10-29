import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

import Login from './containers/login';
import Dashboard from './containers/dashboard';
import SideMenu from './containers/sideMenu';
import * as constants from './constants';

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

export default () => {
  const [theme, setTheme] = useState(constants.LIGHT_THEME);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        forceInset={{top: 'always', horizontal: 'never'}}
        style={styles.container}>
        <App theme={theme} screenProps={{updateTheme: setTheme}} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
