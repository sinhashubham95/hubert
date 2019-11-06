import {DarkTheme, DefaultTheme} from 'react-native-paper';

import PDF from '../assets/pdf.png';
import DOC from '../assets/doc.png';

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

export const BASE_URL = 'https://api-test.hubert.com.br';

export const LOGIN_FORM = [
  {
    key: 'username',
    autoCompleteType: 'username',
    textContentType: 'username',
    autoCapitalize: 'none',
    defaultValue: '',
    mode: 'outlined',
  },
  {
    key: 'password',
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
    label: 'changePassword',
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
    label: 'logout',
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

export const REPORTS_LIST = {
  revenue: 'rgb(93,203,156)',
  expense: 'rgb(236,89,86)',
  income: 'rgb(252,148,77)',
};

export const DOCUMENT_FILE_LIST = {
  pdf: PDF,
  doc: DOC,
};

export const REPORTS_TABLE_LIST = ['name', 'income', 'status'];
export const REPORTS_TABLE_EXTENDED_LIST = [
  'tenant',
  'contractDate',
  'revenue',
  'expense',
];

export const AUTH_SERVICE_KEY = 'AUTH_SERVICE';
export const USER_INFORMATION_SERVICE_KEY = 'USER_INFORMATION_SERVICE';
export const DASHBOARD_DATA_SERVICE_KEY = 'DASHBOARD_SERVICE_DATA';
export const DASHBOARD_REPORT_SERVICE_KEY = 'DASHBOARD_SERVICE_REPORT';
export const DOCUMENT_SERVICE_KEY = 'DOCUMENT_SERVICE';
export const REPORT_DATES_SERVICE_KEY = 'REPORT_DATES_SERVICE';
export const REPORT_PROPERTIES_SERVICE_KEY = 'REPORT_PROPERTIES_SERVICE';

export const NAVIGATION_DASHBOARD = 'Dashboard';
export const NAVIGATION_LOGIN = 'Login';

export const LIGHT_PAPER_THEME = Object.assign({}, DefaultTheme, {
  mode: 'adaptive',
  colors: Object.assign({}, DefaultTheme.colors, {
    primary: 'rgb(51,126,241)',
    element: DefaultTheme.colors.surface,
    switch: 'rgb(51,126,241)',
  }),
});

export const DARK_PAPER_THEME = Object.assign({}, DarkTheme, {
  mode: 'adaptive',
  colors: Object.assign({}, DarkTheme.colors, {
    primary: 'rgb(31,30,36)',
    element: DefaultTheme.colors.surface,
    switch: DefaultTheme.colors.surface,
  }),
});
