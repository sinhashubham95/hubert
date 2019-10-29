import * as constants from './index';

export const WHITE = '#fff';

export const DODGER_BLUE = 'rgb(51,129,241)';

export const SILVER = '#BEBEBE';

export const BUTTON_BORDER = 'rgba(255,255,255,0.7)';

export const TEXT_BLACK = 'rgba(0,0,0,0.87)';

export const BORDER_COLOR = 'rgba(151, 151, 151, 0.6)';

export const BACKGROUND_GREY = 'rgb(239,239,239)';

export const BACKGROUND_SHADOW = 'rgb(224,224,224)';

export const LINE_SEPARATOR_COLOR = 'rgb(184,184,184)';

export const TEXT_BLACK_SECONDARY = 'rgba(0,0,0,0.54)';

export const DEFAULT_STYLE = {
  selectionColor: 'rgb(51,129,241)',
  buttonBackgroundColorPrimary: 'rgb(51,129,241)',
  buttonBackgroundColorSecondary: 'rgb(239,239,239)',
  buttonTextColorPrimary: 'rgb(145,217,247)',
  buttonTextColorSecondary: 'rgb(152,152,152)',
};

export const THEME = {
  [constants.LIGHT_THEME]: {
    imageTintColor: 'rgb(87,87,87)',
    backgroundColor: 'rgb(255,255,255)',
    textPrimaryColor: 'rgb(87,87,87)',
    textSecondaryColor: 'rgb(170,170,170)',
    borderColor: 'rgba(151, 151, 151, 0.6)',
    backgroundShadow: 'rgb(224,224,224)',
    ...DEFAULT_STYLE,
  },
  [constants.DARK_THEME]: {
    imageTintColor: 'rgb(206,205,210)',
    backgroundColor: 'rgb(43,42,48)',
    textPrimaryColor: 'rgb(206,205,210)',
    textSecondaryColor: 'rgb(131,130,135)',
    borderColor: 'rgb(52,51,56)',
    selectionColor: 'rgb(51,129,241)',
    backgroundShadow: 'rgb(23,22,27)',
    ...DEFAULT_STYLE,
  },
};
