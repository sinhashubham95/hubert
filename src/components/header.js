import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ConnectionStatusBar from './connectionStatusBar';
import * as colors from '../constants/colors';
import logo from '../assets/logo.png';

const iconStyle = {
  size: 25,
  color: '#fff',
};

const styles = {
  headerContainer: {
    flex: 0,
    elevation: 5,
    backgroundColor: colors.DODGER_BLUE,
  },
  headerBaseContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftHeader: {
    flex: 0,
    flexDirection: 'row',
  },
  centerHeader: {
    flex: 1,
  },
  logo: {
    flex: 1,
    width: '90%',
    resizeMode: 'contain',
    tintColor: colors.WHITE,
  },
  navMenuButton: {
    padding: 8,
  },
};

export default props => {
  const insets = useSafeArea();
  const pad = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const onBack = () => {
    props.navigation.goBack();
  };

  const onNavMenu = () => {
    props.navigation.openDrawer();
  };

  const renderCenterHeader = () => (
    <View style={styles.centerHeader}>
      <Image source={logo} style={styles.logo} />
    </View>
  );

  const renderLeftHeader = () => {
    const {dismissBehavior, onDismissCallback, dismissIcon} = props;

    return (
      <View style={styles.leftHeader}>
        {dismissBehavior === 'back' && (
          <TouchableOpacity onPress={onBack}>
            <Icon
              name={dismissIcon}
              {...iconStyle}
              style={styles.navMenuButton}
            />
          </TouchableOpacity>
        )}
        {dismissBehavior === 'callback' && (
          <TouchableOpacity onPress={onDismissCallback}>
            <Icon
              name={dismissIcon}
              {...iconStyle}
              style={styles.navMenuButton}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onNavMenu}>
          <Icon name="menu" {...iconStyle} style={styles.navMenuButton} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View flex={0}>
      <View style={[styles.headerContainer, pad]}>
        <View style={styles.headerBaseContainer}>
          {renderLeftHeader()}
          {renderCenterHeader()}
        </View>
      </View>
      <ConnectionStatusBar />
    </View>
  );
};
