import React, {Component} from 'react';
import {View, StyleSheet, Image, Text, Picker, Switch} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Button from 'react-native-really-awesome-button';

import AuthService from '../utils/authService';
import UserInformationService from '../utils/userInformationService';
import Loading from '../components/loading';
import LineSeparator from '../components/lineSeparator';
import * as colors from '../constants/colors';
import * as constants from '../constants';
import withTheme from '../hoc/withTheme';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      client: '',
    };
  }

  componentDidMount() {
    (async () => {
      try {
        await UserInformationService.get();
        if (UserInformationService.data.currentClientIndex >= 0) {
          this.setState({
            client:
              UserInformationService.data.clients[
                UserInformationService.data.currentClientIndex
              ].NomeProprietario,
            loading: false,
          });
        }
      } catch (e) {
        this.setState({loading: false}, this.showError(e.message));
      }
    })();
  }

  onClientChange = (clientName, index) => {
    UserInformationService.updateClient(index);
    this.setState({client: clientName});
  };

  onButtonPress = key => next => {
    if (key === constants.CHANGE_PASSWORD) {
      this.showError('This functionality will be available soon.')();
      next();
      return;
    }
    (async () => {
      try {
        await AuthService.clear(key);
        this.props.navigation.navigate(constants.NAVIGATION_LOGIN);
        await UserInformationService.clear(key);
      } catch (e) {
        this.showError(e.message);
        next();
      }
    })();
  };

  onThemeChange = value => {
    const {theme, screenProps} = this.props;
    if (value) {
      if (theme !== constants.DARK_THEME) {
        screenProps.updateTheme(constants.DARK_THEME);
      }
    } else {
      if (theme !== constants.LIGHT_THEME) {
        screenProps.updateTheme(constants.LIGHT_THEME);
      }
    }
  };

  showError = message => () => {
    Snackbar.show({
      title: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  renderButton = ({label, key, textStyle, ...otherProps}) => (
    <View key={key}>
      <Button {...otherProps} onPress={this.onButtonPress(key)}>
        <Text style={textStyle}>{label}</Text>
      </Button>
    </View>
  );

  renderClient = clientData => (
    <Picker.Item
      key={clientData.CodProprietario}
      label={clientData.NomeProprietario}
      value={clientData.NomeProprietario}
    />
  );

  render() {
    const {theme} = this.props;
    const {client, loading} = this.state;
    const styles = useStyles(theme);
    if (loading) {
      return (
        <View style={styles.container}>
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
          {constants.SIDE_MENU_BUTTONS(theme).map(this.renderButton)}
        </View>
        <LineSeparator />
        <View style={styles.selections}>
          <Picker
            selectedValue={client}
            onValueChange={this.onClientChange}
            style={styles.selection}>
            {UserInformationService.data.clients.map(this.renderClient)}
          </Picker>
        </View>
        <LineSeparator />
        <View style={styles.switch}>
          <View style={styles.switchDetails}>
            <Text style={styles.switchPrimaryDetail}>Dark Theme</Text>
            <Text style={styles.switchSecondaryDetail}>
              Turn background colors dark
            </Text>
          </View>
          <Switch
            thumbColor={colors.WHITE}
            trackColor={colors.BACKGROUND_GREY}
            value={theme === constants.DARK_THEME}
            onValueChange={this.onThemeChange}
          />
        </View>
      </View>
    );
  }
}

const useStyles = theme =>
  StyleSheet.create({
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
      borderColor: colors.THEME[theme].borderColor,
      borderWidth: StyleSheet.hairlineWidth,
      marginRight: 32,
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    name: {
      marginVertical: 4,
      color: colors.THEME[theme].textPrimaryColor,
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
      color: colors.THEME[theme].textPrimaryColor,
    },
    switch: {
      width: '100%',
      paddingHorizontal: 16,
      marginVertical: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    switchDetails: {
      flexDirection: 'column',
    },
    switchPrimaryDetail: {
      fontSize: 16,
      color: colors.THEME[theme].textPrimaryColor,
    },
    switchSecondaryDetail: {
      fontSize: 12,
      color: colors.THEME[theme].textSecondaryColor,
    },
  });

export default withTheme(SideMenu);
