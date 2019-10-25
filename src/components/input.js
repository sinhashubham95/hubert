import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

import * as colors from '../constants/colors';

export default ({style, ...otherProps}) => (
  <TextInput
    selectionColor={colors.DODGER_BLUE}
    style={[styles.input, style]}
    {...otherProps}
  />
);

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderColor: colors.SILVER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 24,
  },
});
