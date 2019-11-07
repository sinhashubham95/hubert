import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';

const Cell = ({children, style, numeric, numberOfLines, ...rest}) => (
  <TouchableRipple
    {...rest}
    style={[styles.container, numeric && styles.right, style]}>
    <Text numberOfLines={numberOfLines}>{children}</Text>
  </TouchableRipple>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  right: {
    justifyContent: 'flex-end',
  },
});

export default Cell;
