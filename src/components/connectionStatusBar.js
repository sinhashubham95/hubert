import React, {Component} from 'react';
import {Animated, Easing, Text} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const styles = {
  elementContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectedStatus: {
    backgroundColor: '#367c2b',
  },
  disconnectedStatus: {
    backgroundColor: '#e62716',
  },
  connectionText: {
    fontSize: 14,
    color: '#fff',
  },
};

export default class ConnectionStatusBar extends Component {
  constructor(props) {
    super(props);

    this.animatedValue = new Animated.Value(0);
    this.state = {
      isConnected: true,
    };
  }

  componentDidMount() {
    this.netInfoListener = NetInfo.addEventListener((state) => {
      this.connectionChanged(state.isConnected);
    });
  }

  componentWillUnmount() {
    this.netInfoListener();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  slideDown = () => {
    this.animatedValue.setValue(0);

    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 250,
      easing: Easing.linear,
    }).start();
  };

  slideUp = () => {
    this.animatedValue.setValue(1);

    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 250,
      easing: Easing.linear,
    }).start();
  };

  connectionChanged = isConnected => {
    if (this.state.isConnected !== isConnected) {
      this.setState({isConnected}, () => {
        if (this.state.isConnected) {
          this.timeout = setTimeout(() => {
            this.slideUp();
          }, 2000);
        } else {
          this.slideDown();
        }
      });
    }
  };

  render() {
    const statusStyle = this.state.isConnected ? styles.connectedStatus : styles.disconnectedStatus;
    const height = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 48],
    });
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[styles.elementContainer, statusStyle, {height, opacity}]}>
        {this.state.isConnected && <Text style={styles.connectionText}>Connected</Text>}
        {!this.state.isConnected && (
          <Text style={styles.connectionText}>No internet connection</Text>
        )}
      </Animated.View>
    );
  }
}
