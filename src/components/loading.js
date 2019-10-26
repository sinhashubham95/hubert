import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';

import * as colors from '../constants/colors';

export default ({
  size = 'large',
  color = colors.DODGER_BLUE,
  style = {},
  ...otherProps
}) => (
  <ActivityIndicator
    size={size}
    color={color}
    style={[styles.container, style]}
    {...otherProps}
  />
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingVertical: 16,
  },
});
