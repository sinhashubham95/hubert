import * as colors from './colors';

export const LOGIN_FORM = [
  {
    key: 'username',
    placeholder: 'Username',
    autoCompleteType: 'username',
    textContentType: 'username',
    autoCapitalize: 'none',
    defaultValue: '',
  },
  {
    key: 'password',
    placeholder: 'Password',
    autoCompleteType: 'password',
    textContentType: 'password',
    secureTextEntry: true,
    autoCapitalize: 'none',
    defaultValue: '',
  },
];

export const CHANGE_PASSWORD = 'changePassword';
export const LOGOUT = 'logout';
export const SIDE_MENU_BUTTONS = [
  {
    key: CHANGE_PASSWORD,
    label: 'Change Password',
    width: 120,
    height: 32,
    backgroundColor: colors.DODGER_BLUE,
    backgroundShadow: colors.BACKGROUND_SHADOW,
    raiseLevel: 2,
    progressLoadingTime: 500,
    textStyle: {
      color: colors.WHITE,
      fontSize: 12,
    },
  },
  {
    key: LOGOUT,
    label: 'Logout',
    width: 120,
    height: 32,
    backgroundColor: colors.BACKGROUND_GREY,
    backgroundShadow: colors.BACKGROUND_SHADOW,
    raiseLevel: 2,
    progressLoadingTime: 500,
    textStyle: {
      color: colors.TEXT_BLACK,
      fontSize: 12,
    },
  },
];

export const AUTH_SERVICE_KEY = 'AUTH_SERVICE';
export const USER_INFORMATION_SERVICE_KEY = 'USER_INFORMATION_SERVICE';

export const NAVIGATION_DASHBOARD = 'Dashboard';
export const NAVIGATION_LOGIN = 'Login';
