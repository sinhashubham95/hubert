import React from 'react';
import {withTheme, Button as PaperButton} from 'react-native-paper';

const Button = ({theme, mode, ...props}) => {
  if (theme.dark && (mode === 'outlined' || mode === 'text')) {
    return <PaperButton {...props} mode={mode} color={theme.colors.element} />;
  }
  return <PaperButton {...props} mode={mode} />;
};

export default withTheme(Button);
