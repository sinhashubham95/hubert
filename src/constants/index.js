import PDF from '../assets/pdf.png';
import DOC from '../assets/doc.png';

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

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
  income: 'rgb(243,171,123)',
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

export const NAVIGATION_DASHBOARD = 'Dashboard';
export const NAVIGATION_LOGIN = 'Login';
