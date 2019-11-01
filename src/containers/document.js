import React, {Component} from 'react';
import {
  withTheme,
  Card,
  Headline,
  Caption,
  TouchableRipple,
} from 'react-native-paper';
import {
  StyleSheet,
  RefreshControl,
  ScrollView,
  Image,
  Dimensions,
  View,
  PermissionsAndroid,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Fetch from 'react-native-fetch-blob';

import Icon from '../components/icon';
import * as constants from '../constants';
import DocumentService from '../utils/documentService';
import AuthService from '../utils/authService';

class Document extends Component {
  static navigationOptions = {
    tabBarIcon: () => (
      <Icon
        name="file-document-box-multiple-outline"
        size={24}
        type="mcd"
        secondary
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchDataWithLoading();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.screenProps.clientCode !== this.props.screenProps.clientCode
    ) {
      this.fetchDataWithLoading();
    }
  }

  onDocumentClick = document => async () => {
    try {
      const grantedExternalRead = await this.checkPermissionExternalRead();
      const grantedExternalWrite = await this.checkPermissionExternalWrite();
      if (
        grantedExternalRead === PermissionsAndroid.RESULTS.GRANTED &&
        grantedExternalWrite === PermissionsAndroid.RESULTS.GRANTED) {
        // we can go ahead and download the file now
        await Fetch.fetch('GET', document.url, {
          Authorization: `${AuthService.data.tokenType} ${
            AuthService.data.token
          }`,
        });
      }
    } catch (e) {
      this.showError(e.message);
    }
  };

  checkPermissionExternalRead = () =>
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Read External Storage',
        message:
          'Allow access to read external storage for saving the document.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

  checkPermissionExternalWrite = () =>
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Read External Storage',
        message:
          'Allow access to write external storage for saving the document.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

  fetchDataWithLoading = () => {
    this.setState({loading: true}, this.fetchData);
  };

  fetchData = async () => {
    const {screenProps} = this.props;
    const {clientCode} = screenProps;
    if (!clientCode) {
      return;
    }
    try {
      await DocumentService.get(clientCode);
    } catch (e) {
      this.showError(e.message);
    }
    this.setState({
      loading: false,
    });
  };

  showError = message => {
    Snackbar.show({
      duration: Snackbar.LENGTH_SHORT,
      title: message,
    });
  };

  renderRefreshControl = () => (
    <RefreshControl
      refreshing={this.state.loading}
      onRefresh={this.fetchDataWithLoading}
    />
  );

  renderDocument = document => {
    const {theme} = this.props;
    const {width} = Dimensions.get('window');
    const styles = useStyles(theme, width);
    return (
      <TouchableRipple key={document.key} onPress={this.onDocumentClick(document)}>
        <Card style={styles.documentContainer}>
          <Card.Content style={styles.document}>
            <Image
              style={styles.documentImage}
              source={constants.DOCUMENT_FILE_LIST[document.type]}
            />
            <View style={styles.documentDescription}>
              <Headline style={styles.documentHeadline}>{document.title}</Headline>
              <Caption style={styles.documentCaption}>{document.description}</Caption>
            </View>
          </Card.Content>
        </Card>
      </TouchableRipple>
    );
  };

  render() {
    const {theme} = this.props;
    const {width} = Dimensions.get('window');
    const styles = useStyles(theme, width);
    return (
      <ScrollView
        style={styles.container}
        refreshControl={this.renderRefreshControl()}>
        {DocumentService.data.map(this.renderDocument)}
      </ScrollView>
    );
  }
}

const useStyles = (theme, width) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    documentContainer: {
      marginVertical: 4,
      paddingVertical: 16,
    },
    document: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
    },
    documentImage: {
      resizeMode: 'contain',
      width: width * 0.2,
      height: width * 0.2,
      marginHorizontal: width * 0.02,
    },
    documentDescription: {
      flexDirection: 'column',
      marginHorizontal: width * 0.02,
      width: width * 0.68,
    },
    documentHeadline: {
      width: '100%',
    },
    documentCaption: {
      width: '100%',
    },
  });

export default withTheme(Document);
