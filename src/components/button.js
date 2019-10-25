import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import * as colors from '../constants/colors';

export default props => (
  <TouchableOpacity
    disabled={props.disabled}
    style={styles.container}
    onPress={props.onPress}>
    <Text style={styles.text}>{props.label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.DODGER_BLUE,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.BUTTON_BORDER,
  },
  text: {
    color: colors.WHITE,
    textAlign: 'center',
    height: 20,
  },
});
