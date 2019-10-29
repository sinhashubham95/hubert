import * as colors from './colors';

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

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
export const SIDE_MENU_BUTTONS = theme => [
  {
    key: CHANGE_PASSWORD,
    label: 'Change Password',
    width: 120,
    height: 32,
    backgroundColor: colors.THEME[theme].buttonBackgroundColorPrimary,
    backgroundShadow: colors.THEME[theme].backgroundShadow,
    raiseLevel: 2,
    progressLoadingTime: 500,
    type: 'primary',
    progress: true,
    textStyle: {
      color: colors.THEME[theme].buttonTextColorPrimary,
      fontSize: 12,
    },
  },
  {
    key: LOGOUT,
    label: 'Logout',
    width: 120,
    height: 32,
    backgroundColor: colors.THEME[theme].buttonBackgroundColorSecondary,
    backgroundShadow: colors.THEME[theme].backgroundShadow,
    raiseLevel: 2,
    progressLoadingTime: 500,
    progress: true,
    type: 'primary',
    textStyle: {
      color: colors.THEME[theme].buttonTextColorSecondary,
      fontSize: 12,
    },
  },
];

export const AUTH_SERVICE_KEY = 'AUTH_SERVICE';
export const USER_INFORMATION_SERVICE_KEY = 'USER_INFORMATION_SERVICE';

export const NAVIGATION_DASHBOARD = 'Dashboard';
export const NAVIGATION_LOGIN = 'Login';
