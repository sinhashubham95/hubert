import React from 'react';
import {View, StyleSheet} from 'react-native';

import * as colors from '../constants/colors';

export default () => <View style={styles.container} />;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.LINE_SEPARATOR_COLOR,
  },
});
