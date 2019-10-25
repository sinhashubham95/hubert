import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import Login from './containers/login';

export default createAppContainer(
  createSwitchNavigator({
    Login,
  }),
);
