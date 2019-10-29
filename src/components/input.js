import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

import * as colors from '../constants/colors';

export default ({style, theme, ...otherProps}) => {
  const styles = useStyles(theme);
  return (
    <TextInput
      selectionColor={colors.THEME[theme].selectionColor}
      placeholderTextColor={colors.THEME[theme].textSecondaryColor}
      style={[styles.input, style]}
      {...otherProps}
    />
  );
};

const useStyles = theme =>
  StyleSheet.create({
    input: {
      height: 48,
      borderColor: colors.THEME[theme].borderColor,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginBottom: 24,
      color: colors.THEME[theme].textPrimaryColor,
    },
  });
