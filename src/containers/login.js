import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Snackbar from 'react-native-snackbar';

import {TextInput, withTheme, Headline} from 'react-native-paper';

import Button from '../components/button';

import logo from '../assets/logo.png';

import * as constants from '../constants';

import translationService from '../utils/translationService';
import authService from '../utils/authService';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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

  showError = message => () => {
    Snackbar.show({
      title: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  onSubmit = () => {
    Keyboard.dismiss();
    this.setState({loading: true}, this.onSubmitWithLoading);
  };

  onSubmitWithLoading = async () => {
    try {
      await authService.get(this.state.values[0], this.state.values[1]);
      this.props.navigation.navigate(constants.NAVIGATION_DASHBOARD);
    } catch (e) {
      this.setState({loading: false}, this.showError(e.message));
    }
  };

  onValueChange = index => value =>
    this.setState(({values}) => {
      values = Object.assign([], values);
      values[index] = value;
      return {values};
    });

  renderFormInput = ({value, updateValue, key, ...otherProps}, index) => (
    <TextInput
      key={key}
      value={this.state.values[index]}
      onChangeText={this.onValueChange(index)}
      placeholder={translationService.get(key)}
      {...otherProps}
    />
  );

  render() {
    const {loading, values} = this.state;
    const {theme} = this.props;
    const styles = useStyles(theme);
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Headline style={styles.primaryTitle}>
          {translationService.get('appTitlePrimary')}
        </Headline>
        <Headline>{translationService.get('appTitleSecondary')}</Headline>
        <View style={styles.form}>
          {constants.LOGIN_FORM.map(this.renderFormInput)}
          <Button
            style={styles.button}
            mode="contained"
            loading={loading}
            disabled={values.reduce((result, value) => result || !value, false)}
            onPress={this.onSubmit}>
            {translationService.get('logIn')}
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
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 16,
    },
    logo: {
      flex: 1,
      width: '100%',
      resizeMode: 'contain',
      alignSelf: 'center',
      tintColor: theme.text,
    },
    form: {
      flex: 1,
      justifyContent: 'center',
      width: '80%',
    },
    button: {
      marginTop: 16,
    },
    primaryTitle: {
      color: theme.colors.primary,
    },
  });

export default withTheme(Login);
