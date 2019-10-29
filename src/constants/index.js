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
    mode: 'outlined',
  },
  {
    key: 'password',
    placeholder: 'Password',
    autoCompleteType: 'password',
    textContentType: 'password',
    secureTextEntry: true,
    autoCapitalize: 'none',
    defaultValue: '',
    mode: 'outlined',
  },
];

export const CHANGE_PASSWORD = 'changePassword';
export const LOGOUT = 'logout';
export const SIDE_MENU_BUTTONS = [
  {
    key: CHANGE_PASSWORD,
    label: 'Change Password',
    mode: 'contained',
    compact: true,
    uppercase: false,
    labelStyle: {
      fontSize: 10,
    },
    contentStyle: {
      width: 120,
      height: 32,
    },
  },
  {
    key: LOGOUT,
    label: 'Logout',
    mode: 'outlined',
    compact: true,
    uppercase: false,
    labelStyle: {
      fontSize: 10,
    },
    contentStyle: {
      width: 120,
      height: 32,
    },
  },
];

export const AUTH_SERVICE_KEY = 'AUTH_SERVICE';
export const USER_INFORMATION_SERVICE_KEY = 'USER_INFORMATION_SERVICE';

export const NAVIGATION_DASHBOARD = 'Dashboard';
export const NAVIGATION_LOGIN = 'Login';
