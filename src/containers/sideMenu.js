import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import Snackbar from 'react-native-snackbar';

import UserInformationService from '../utils/userInformationService';
import Loading from '../components/loading';
import Button from '../components/footerButton';
import * as colors from '../constants/colors';
import * as constants from '../constants';

export default props => {
  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);

  const userInfoEffect = () => {
    if (init || loading) {
      return;
    }
    (async () => {
      setLoading(true);
      try {
        await UserInformationService.get();
        setInit(true);
      } catch (e) {
        Snackbar.show({
          title: e.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
      setLoading(false);
    })();
  };
  useEffect(userInfoEffect);

  const onLogout = () => {
    props.navigation.navigate(constants.NAVIGATION_LOGIN);
  };

  if (!init || loading) {
    return <Loading />;
  }

  return (
    <View
      style={styles.container}
      forceInset={{top: 'always', horizontal: 'never'}}>
      <View style={styles.header}>
        <View style={styles.photo}>
          <Image
            height="100%"
            width="100%"
            resizeMode="center"
            style={styles.photoImage}
            source={{uri: UserInformationService.data.profilePhoto}}
          />
        </View>
        <Text style={styles.name}>{UserInformationService.data.name}</Text>
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button disabled label="Change Password" />
        </View>
        <View style={styles.button}>
          <Button label="Logout" onPress={onLogout} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    marginVertical: 24,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    height: 64,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  photo: {
    height: 64,
    width: 64,
    borderRadius: 32,
    borderColor: colors.BORDER_COLOR,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 32,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginVertical: 4,
    color: colors.TEXT_BLACK,
    fontSize: 20,
    fontWeight: '500',
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
  },
  button: {
    width: '50%',
    paddingHorizontal: 16,
  },
});
