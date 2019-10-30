import React, {Component} from 'react';
import {withTheme} from 'react-native-paper';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import logo from '../assets/logo.png';

const useStyles = theme =>
  StyleSheet.create({
    header: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    headerImage: {
      width: '80%',
      height: '100%',
      tintColor: theme.colors.text,
      resizeMode: 'contain',
    },
    menu: {
      marginLeft: 8,
    },
  });

class Header extends Component {
  onMenuPress = () => {
    const {navigation} = this.props;
    navigation.openDrawer();
  };

  render() {
    const {theme} = this.props;
    const styles = useStyles(theme);
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.menu} onPress={this.onMenuPress}>
          <Icon color={theme.colors.text} name="menu" size={24} />
        </TouchableOpacity>
        <Image source={logo} style={styles.headerImage} />
      </View>
    );
  }
}

export default withTheme(Header);
