import React, {Component} from 'react';
import {
  withTheme,
  Card,
  Text,
  Caption,
  TouchableRipple,
  ProgressBar,
} from 'react-native-paper';
import {
  StyleSheet,
  RefreshControl,
  ScrollView,
  Image,
  Dimensions,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Fetch from 'rn-fetch-blob';

import Icon from '../components/icon';
import * as constants from '../constants';
import DocumentService from '../utils/documentService';
import AuthService from '../utils/authService';
import translationService from "../utils/translationService";

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
      documents: {},
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
      const grantedExternalRead = await this.checkPermission(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        'readPermissionTitle',
        'readPermissionMessage',
      );
      const grantedExternalWrite = await this.checkPermission(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        'writePermissionTitle',
        'writePermissionMessage',
      );
      if (grantedExternalRead && grantedExternalWrite) {
        // we can go ahead and download the file now
        let {documents} = this.state;
        documents = Object.assign({}, documents);
        documents[document.key] = {
          downloadInProgress: true,
          downloadProgress: 0,
        };
        this.setState({documents}, this.downloadDocument(document));
      }
    } catch (e) {
      this.showError(e.message);
    }
  };

  downloadDocument = document => async () => {
    try {
      await Fetch.config({
        addAndroidDownloads: {
          useDownloadManager: true,
        },
      })
        .fetch('GET', document.url, {
          Authorization: `${AuthService.data.tokenType} ${
            AuthService.data.token
          }`,
        })
        .progress({count: 10}, this.updateProgress(document));
    } catch (e) {
      this.showError(e.message);
    }
    let {documents} = this.state;
    documents = Object.assign({}, documents);
    documents[document.key] = {
      downloadInProgress: false,
      downloadProgress: 0,
    };
    this.setState({documents});
  };

  checkPermission = async (name, title, messsage) => {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(name, {
        title: translationService.get(title),
        message: translationService.get(messsage),
        buttonNeutral: translationService.get('neutral'),
        buttonNegative: translationService.get('cancel'),
        buttonPositive: translationService.get('ok'),
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
    } catch (e) {}
    return false;
  };

  updateProgress = document => (received, total) => {
    let {documents} = this.state;
    documents = Object.assign({}, documents);
    documents[document.key] = {
      downloadInProgress: true,
      downloadProgress: received / total,
    };
    this.setState({documents});
  };

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
    const docs = DocumentService.data;
    const documents = {};
    for (let i = 0; i < docs.length; i += 1) {
      documents[docs[i].key] = {
        downloadInProgress: false,
        downloadProgress: 0,
      };
    }
    this.setState({
      documents,
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

  renderProgress = (document, docState) => {
    const {theme} = this.props;
    const {width} = Dimensions.get('window');
    const styles = useStyles(theme, width);
    return (
      <ProgressBar
        indeterminate={docState.downloadProgress === 0}
        progress={docState.downloadProgress}
        visible={docState.downloadInProgress}
        style={styles.progress}
      />
    );
  };

  renderDocument = document => {
    const {theme} = this.props;
    const {width} = Dimensions.get('window');
    const {documents} = this.state;
    const docState = documents[document.key];
    const styles = useStyles(theme, width);
    return (
      <TouchableRipple
        key={document.key}
        onPress={this.onDocumentClick(document)}>
        <Card style={styles.documentContainer}>
          <Card.Content style={styles.document}>
            <Image
              style={styles.documentImage}
              source={constants.DOCUMENT_FILE_LIST[document.type]}
            />
            <View style={styles.documentDescription}>
              <Text style={styles.documentHeadline}>{document.title}</Text>
              <Caption style={styles.documentCaption}>
                {document.description}
              </Caption>
            </View>
            <View style={styles.documentDate}>
              <Caption>{document.date}</Caption>
            </View>
          </Card.Content>
          {this.renderProgress(document, docState)}
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
      paddingTop: 16,
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
      width: width * 0.44,
    },
    documentHeadline: {
      width: '100%',
      fontWeight: '700',
    },
    documentCaption: {
      width: '100%',
    },
    progress: {
      marginTop: 16,
    },
    documentDate: {
      width: width * 0.2,
      marginHorizontal: width * 0.02,
    },
  });

export default withTheme(Document);
