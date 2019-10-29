import React, {Component} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ConnectionStatusBar from './connectionStatusBar';
import * as colors from '../constants/colors';
import logo from '../assets/logo.png';

const iconStyle = theme => ({
  size: 25,
  color: colors.THEME[theme].headerTextColor,
});

const useStyles = theme =>
  StyleSheet.create({
    headerContainer: {
      flex: 0,
      elevation: 5,
      backgroundColor: theme.headerBackgroundColor,
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
      tintColor: colors.THEME[theme].headerTextColor,
    },
    navMenuButton: {
      padding: 8,
    },
  });

class Header extends Component {
  onBack = () => {
    this.props.navigation.goBack();
  };

  onNavMenu = () => {
    this.props.navigation.openDrawer();
  };

  renderCenterHeader = () => {
    const {theme} = this.props;
    const styles = useStyles(theme);
    return (
      <View style={styles.centerHeader}>
        <Image source={logo} style={styles.logo} />
      </View>
    );
  };

  renderLeftHeader = () => {
    const {dismissBehavior, onDismissCallback, dismissIcon, theme} = this.props;
    const styles = useStyles(theme);
    return (
      <View style={styles.leftHeader}>
        {dismissBehavior === 'back' && (
          <TouchableOpacity onPress={this.onBack}>
            <Icon
              name={dismissIcon}
              {...iconStyle(theme)}
              style={styles.navMenuButton}
            />
          </TouchableOpacity>
        )}
        {dismissBehavior === 'callback' && (
          <TouchableOpacity onPress={onDismissCallback}>
            <Icon
              name={dismissIcon}
              {...iconStyle(theme)}
              style={styles.navMenuButton}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={this.onNavMenu}>
          <Icon
            name="menu"
            {...iconStyle(theme)}
            style={styles.navMenuButton}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {theme} = this.props;
    const styles = useStyles(theme);
    return (
      <View flex={0}>
        <View style={styles.headerContainer}>
          <View style={styles.headerBaseContainer}>
            {this.renderLeftHeader()}
            {this.renderCenterHeader()}
          </View>
        </View>
        <ConnectionStatusBar />
      </View>
    );
  }
}

export default Header;
