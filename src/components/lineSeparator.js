import React from 'react';
import {View, StyleSheet} from 'react-native';

import * as colors from '../constants/colors';

const LineSeparator = ({theme}) => {
  const styles = useStyles(theme);
  return <View style={styles.container} />;
};

const useStyles = theme =>
  StyleSheet.create({
    container: {
      width: '100%',
      borderBottomWidth: 2 * StyleSheet.hairlineWidth,
      borderColor: colors.THEME[theme].lineSeparatorColor,
    },
  });

export default LineSeparator;
