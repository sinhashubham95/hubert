import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text, Picker} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Button from 'react-native-really-awesome-button';

import AuthService from '../utils/authService';
import UserInformationService from '../utils/userInformationService';
import Loading from '../components/loading';
import LineSeparator from '../components/lineSeparator';
import * as colors from '../constants/colors';
import * as constants from '../constants';

export default props => {
  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonStates = constants.SIDE_MENU_BUTTONS.map(() => useState(false));
  const [client, setClient] = useState('');

  const userInfoEffect = () => {
    if (init || loading) {
      return;
    }
    (async () => {
      setLoading(true);
      try {
        await UserInformationService.get();
        if (UserInformationService.data.currentClientIndex >= 0) {
          setClient(
            UserInformationService.data.clients[
              UserInformationService.data.currentClientIndex
            ].NomeProprietario,
          );
        }
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

  const onButtonPress = (key, index) => next => {
    if (key === constants.CHANGE_PASSWORD) {
      // functionality is not yet available
      buttonStates[index][1](true);
      Snackbar.show({
        title: 'This functionality will be available soon.',
        duration: Snackbar.LENGTH_SHORT,
      });
      next();
      buttonStates[index][1](false);
      return;
    }
    (async () => {
      buttonStates[index][1](true);
      try {
        props.navigation.navigate(constants.NAVIGATION_LOGIN);
        await UserInformationService.clear(key);
        await AuthService.clear(key);
      } catch (e) {
        Snackbar.show({
          title: e.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        buttonStates[index][1](false);
        next();
      }
    })();
  };

  const onClientChange = (clientName, index) => {
    setClient(clientName);
    UserInformationService.updateClient(index);
  };

  const renderButton = ({label, key, textStyle, ...otherProps}, index) => (
    <View key={key}>
      <Button
        {...otherProps}
        onPress={onButtonPress(key, index)}
        progress={buttonStates[index][0]}>
        <Text style={textStyle}>{label}</Text>
      </Button>
    </View>
  );

  const renderClient = clientData => (
    <Picker.Item
      key={clientData.CodProprietario}
      label={clientData.NomeProprietario}
      value={clientData.NomeProprietario}
    />
  );

  if (!init || loading) {
    return (
      <View>
        <Loading />
      </View>
    );
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
        {constants.SIDE_MENU_BUTTONS.map(renderButton)}
      </View>
      <LineSeparator />
      <View style={styles.selections}>
        <Picker
          selectedValue={client}
          onValueChange={onClientChange}
          style={styles.selection}>
          {UserInformationService.data.clients.map(renderClient)}
        </Picker>
      </View>
      <LineSeparator />
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
    paddingHorizontal: 16,
    marginVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selections: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  selection: {
    width: '100%',
  },
});
