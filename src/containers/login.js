import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';

import * as colors from '../constants/colors';
import logo from '../assets/logo.png';
import Input from '../components/input';
import Button from '../components/button';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = setValue => value => setValue(value);

  const onSubmit = () => {
    console.log(email, password);
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.form}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={handleChange(setEmail)}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={handleChange(setPassword)}
        />
        <Button
          disabled={!email || !password}
          label="Log In"
          onPress={onSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  logo: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
});
