import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Snackbar from 'react-native-snackbar';

import * as colors from '../constants/colors';
import * as constants from '../constants';
import logo from '../assets/logo.png';
import Input from '../components/input';
import Button from '../components/button';
import Loading from '../components/loading';

import authService from '../utils/authService';

export default () => {
  const [loading, setLoading] = useState(false);

  const states = constants.LOGIN_FORM.map(({defaultValue}) =>
    useState(defaultValue),
  );

  const handleChange = setValue => value => setValue(value);

  const onSubmit = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      await authService.get(states[0][0], states[1][0]);
    } catch (e) {
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
    setLoading(false);
  };

  const renderFormInput = ({value, updateValue, ...otherProps}, index) => (
    <Input
      value={states[index][0]}
      onChangeText={handleChange(states[index][1])}
      {...otherProps}
    />
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image source={logo} style={styles.logo} />
      <View style={styles.form}>
        {constants.LOGIN_FORM.map(renderFormInput)}
        {loading && <Loading />}
        {!loading && (
          <Button
            disabled={states
              .map(state => state[0])
              .reduce((result, value) => result || !value, false)}
            label="Log In"
            onPress={onSubmit}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logo: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 64,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
});
