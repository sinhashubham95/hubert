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

export const DASHBOARD_STATUS_LIST = {
  'Em Dia': '#2CA185',
  Atrasado: '#8B0000',
  Rescindido: '#FFD700',
  Execução: '#0000CD',
  Despejo: '#D9534F',
  Suspenso: '#E6E9ED',
  Vago: '#F44336',
  Indisponível: '#2196F3',
};

export const AUTH_SERVICE_KEY = 'AUTH_SERVICE';
export const USER_INFORMATION_SERVICE_KEY = 'USER_INFORMATION_SERVICE';

export const NAVIGATION_DASHBOARD = 'Dashboard';
export const NAVIGATION_LOGIN = 'Login';
