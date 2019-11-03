import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Snackbar from 'react-native-snackbar';

import {
  withTheme,
  Avatar,
  Title,
  Headline,
  Caption,
  Divider,
  List,
  Switch,
  ActivityIndicator,
} from 'react-native-paper';

import Button from '../components/button';
import AuthService from '../utils/authService';
import UserInformationService from '../utils/userInformationService';
import * as constants from '../constants';
import translationService from '../utils/translationService';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showClients: false,
      client: '',
    };
  }

  componentDidMount() {
    (async () => {
      try {
        await UserInformationService.get();
        if (UserInformationService.data.currentClientIndex >= 0) {
          this.setState(
            {
              client:
                UserInformationService.data.clients[
                  UserInformationService.data.currentClientIndex
                ].NomeProprietario,
              loading: false,
            },
            this.updateCode(
              UserInformationService.data.clients[
                UserInformationService.data.currentClientIndex
              ].CodProprietario,
            ),
          );
        }
      } catch (e) {
        this.setState({loading: false}, this.showError(e.message));
      }
    })();
  }

  onClientChange = (clientName, index) => () => {
    UserInformationService.updateClient(index);
    this.setState(
      {
        client: clientName,
        loading: false,
        showClients: false,
      },
      this.updateCode(
        UserInformationService.data.clients[index].CodProprietario,
      ),
    );
    this.setState({client: clientName, showClients: false});
  };

  onButtonPress = key => next => {
    if (key === constants.CHANGE_PASSWORD) {
      this.showError(translationService.get('notAvailable'))();
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
    const {screenProps} = this.props;
    if (value !== screenProps.darkTheme) {
      screenProps.updateTheme();
    }
  };

  onShowClients = () =>
    this.setState(({showClients}) => ({showClients: !showClients}));

  updateCode = value => () => {
    const {screenProps} = this.props;
    screenProps.updateClientCode(value);
  };

  showError = message => () => {
    Snackbar.show({
      title: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  renderButton = ({label, key, ...otherProps}) => (
    <Button key={key} onPress={this.onButtonPress(key)} {...otherProps}>
      {translationService.get(label)}
    </Button>
  );

  renderClient = (clientData, index) => (
    <List.Item
      key={clientData.CodProprietario}
      title={clientData.NomeProprietario}
      onPress={this.onClientChange(clientData.NomeProprietario, index)}
    />
  );

  render() {
    const {theme, screenProps} = this.props;
    const {client, loading, showClients} = this.state;
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size={32} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar.Image
            source={{uri: UserInformationService.data.profilePhoto}}
            style={styles.photo}
          />
          <Headline>{UserInformationService.data.name}</Headline>
        </View>
        <View style={styles.buttons}>
          {constants.SIDE_MENU_BUTTONS.map(this.renderButton)}
        </View>
        <Divider style={styles.divider} />
        <View style={styles.selections}>
          <List.Accordion
            title={client}
            description={translationService.get('clientCode')}
            expanded={showClients}
            onPress={this.onShowClients}>
            {UserInformationService.data.clients.map(this.renderClient)}
          </List.Accordion>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.switch}>
          <View style={styles.switchDetails}>
            <Title>{translationService.get('darkTheme')}</Title>
            <Caption>{translationService.get('darkThemeCaption')}</Caption>
          </View>
          <Switch
            value={screenProps.darkTheme}
            onValueChange={this.onThemeChange}
            color={theme.colors.switch}
          />
        </View>
        <Divider style={styles.divider} />
      </View>
    );
  }
}

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
    marginRight: 16,
  },
  divider: {
    width: '100%',
    height: 2 * StyleSheet.hairlineWidth,
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
});

export default withTheme(SideMenu);
