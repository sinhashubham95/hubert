import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Text,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Button from 'react-native-really-awesome-button';

import withTheme from '../hoc/withTheme';

import logo from '../assets/logo.png';
import Input from '../components/input';

import * as colors from '../constants/colors';
import * as constants from '../constants';

import authService from '../utils/authService';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: constants.LOGIN_FORM.map(({defaultValue}) => defaultValue),
    };
  }

  componentDidMount() {
    (async () => {
      try {
        await authService.get();
        this.props.navigation.navigate(constants.NAVIGATION_DASHBOARD);
      } catch (e) {
        this.setState({loading: false});
      }
    })();
  }

  showError = message => {
    Snackbar.show({
      title: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  onSubmit = next => {
    Keyboard.dismiss();
    (async () => {
      try {
        await authService.get(this.state.values[0], this.state.values[1]);
        this.props.navigation.navigate(constants.NAVIGATION_DASHBOARD);
      } catch (e) {
        next();
        this.showError(e.message);
      }
    })();
  };

  onValueChange = index => value =>
    this.setState(({values}) => {
      values = Object.assign([], values);
      values[index] = value;
      return {values};
    });

  renderFormInput = ({value, updateValue, ...otherProps}, index) => (
    <Input
      theme={this.props.theme}
      value={this.state.values[index]}
      onChangeText={this.onValueChange(index)}
      {...otherProps}
    />
  );

  render() {
    const {values} = this.state;
    const {theme} = this.props;
    const styles = useStyles(theme);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image source={logo} style={styles.logo} />
        <View style={styles.form}>
          {constants.LOGIN_FORM.map(this.renderFormInput)}
          <Button
            stretch
            style={styles.button}
            raiseLevel={2}
            backgroundColor={colors.THEME[theme].buttonBackgroundColorPrimary}
            backgroundShadow={colors.THEME[theme].backgroundShadow}
            disabled={values.reduce((result, value) => result || !value, false)}
            onPress={this.onSubmit}
            type="primary"
            progress>
            <Text style={styles.buttonText}>Log In</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const useStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.THEME[theme].backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    logo: {
      flex: 1,
      width: '100%',
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: 64,
      tintColor: colors.THEME[theme].imageTintColor,
    },
    form: {
      flex: 1,
      justifyContent: 'center',
      width: '80%',
    },
    buttonText: {
      color: colors.THEME[theme].buttonTextColorPrimary,
    },
    button: {
      marginTop: 16,
    },
  });

export default withTheme(Login);
