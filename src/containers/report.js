import React, {Component} from 'react';
import {
  withTheme,
  Card,
  Portal,
  Dialog,
  RadioButton,
  Text,
  Divider,
  DataTable,
  Caption,
} from 'react-native-paper';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Moment from 'moment';
import Color from 'color';

import Cell from '../components/cell';
import Button from '../components/button';
import Icon from '../components/icon';

import translationService from '../utils/translationService';
import reportService from '../utils/reportService';
import * as constants from '../constants';

class Report extends Component {
  static navigationOptions = {
    tabBarIcon: () => (
      <Icon name="attach-money" size={24} type="md" secondary />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      init: false,
      selectedDate: '',
      radioDate: '',
      showSelectedDates: false,
      propertyExpand: [],
    };
  }

  componentDidMount() {
    if (this.props.screenProps.clientCode) {
      this.fetchDataWithLoading();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.init && this.state.init) {
      this.fetchDataWithLoading();
    }
    if (
      prevProps.screenProps.clientCode !== this.props.screenProps.clientCode
    ) {
      this.fetchDataWithLoading();
    }
  }

  onRadioDateChange = value => this.setState({radioDate: value});

  onPropertyClick = ind => () => {
    let {propertyExpand} = this.state;
    propertyExpand = Object.assign([], propertyExpand);
    propertyExpand[ind] = !propertyExpand[ind];
    this.setState({propertyExpand});
  };

  fetchDataWithLoading = () => {
    if (!this.state.init) {
      (async () => {
        await this.fetchCachedData();
      })();
      return;
    }
    this.setState({loading: true}, this.fetchData);
  };

  fetchCachedData = async () => {
    const {screenProps} = this.props;
    const {clientCode} = screenProps;
    try {
      await reportService.initDates(clientCode);
    } catch (e) {
      this.showError(e.message);
    }
    const dates = reportService.dates;
    const selectedDate = dates.length ? dates[0] : '';
    const radioDate = dates.length ? dates[0] : '';
    if (selectedDate) {
      try {
        await reportService.initRentalDetails(clientCode, selectedDate);
      } catch (e) {
        this.showError(e.message);
      }
    }
    const {properties} = reportService;
    this.setState({
      init: true,
      selectedDate,
      radioDate,
      showSelectedDates: false,
      propertyExpand: properties.map(() => false),
    });
  };

  fetchData = async () => {
    const {screenProps} = this.props;
    try {
      await reportService.getDates(screenProps.clientCode);
    } catch (e) {
      this.showError(e.message);
    }
    const dates = reportService.dates;
    const selectedDate = dates.length ? dates[0] : '';
    const radioDate = dates.length ? dates[0] : '';
    if (selectedDate) {
      try {
        await reportService.getRentalDetails(
          screenProps.clientCode,
          selectedDate,
        );
      } catch (e) {
        this.showError(e.message);
      }
    }
    const {properties} = reportService;
    this.setState({
      loading: false,
      selectedDate,
      radioDate,
      showSelectedDates: false,
      propertyExpand: properties.map(() => false),
    });
  };

  showError = message => {
    Snackbar.show({
      duration: Snackbar.LENGTH_SHORT,
      title: message,
    });
  };

  formatDate = date => Moment(date).format('DD/MM/YYYY');

  showSelectedDates = () => {
    this.setState({showSelectedDates: true});
  };

  hideSelectedDates = () => {
    this.setState({showSelectedDates: false});
  };

  updateSelectedDate = () => {
    if (this.state.radioDate !== this.state.selectedDate) {
      this.setState({
        selectedDate: this.state.radioDate,
        showSelectedDates: false,
      });
    } else {
      this.setState({
        showSelectedDates: false,
      });
    }
  };

  renderDateSelector = () => {
    const {theme} = this.props;
    const width = Dimensions.get('window').width;
    const styles = useStyles(theme, width);
    const {selectedDate, showSelectedDates, radioDate} = this.state;
    const {dates} = reportService;
    if (!dates.length) {
      return null;
    }
    return (
      <View style={styles.dateSelector}>
        <Button mode="outlined" onPress={this.showSelectedDates}>
          {this.formatDate(selectedDate)}
        </Button>
        <Portal>
          <Dialog
            visible={showSelectedDates}
            onDismiss={this.hideSelectedDates}>
            <Dialog.Title>
              {translationService.get('dateSelector')}
            </Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group
                value={radioDate}
                onValueChange={this.onRadioDateChange}>
                {dates.map(date => (
                  <View style={styles.dateRadio} key={date}>
                    <RadioButton value={date} />
                    <Text>{this.formatDate(date)}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                color={theme.colors.switch}
                onPress={this.hideSelectedDates}>
                {translationService.get('cancel')}
              </Button>
              <Button
                color={theme.colors.switch}
                onPress={this.updateSelectedDate}>
                {translationService.get('ok')}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  };

  renderRefreshControl = () => (
    <RefreshControl
      refreshing={this.state.loading || !this.state.init}
      onRefresh={this.fetchDataWithLoading}
    />
  );

  renderReportAmount = name => {
    const {theme} = this.props;
    const width = Dimensions.get('window').width;
    const styles = useStyles(theme, width);
    const {dates} = reportService;
    if (!dates.length || !reportService[name]) {
      return null;
    }
    return (
      <View
        key={`report_amount_${name}`}
        style={[
          styles.amountTile,
          {backgroundColor: constants.REPORTS_LIST[name]},
        ]}>
        <Text style={styles.amountText}>{translationService.get(name)}</Text>
        <Text style={styles.amountText}>{reportService[name]}</Text>
      </View>
    );
  };

  renderPropertyHeader = name => (
    <DataTable.Title key={`property_header_${name}`}>
      {translationService.get(name)}
    </DataTable.Title>
  );

  renderPropertyData = (name, property) => {
    const value = property[name];
    if (name === 'status') {
      const {theme} = this.props;
      const color =
        constants.STATUS_LIST[property.contractStatus] ||
        constants.STATUS_LIST[property.propertyStatus] ||
        theme.colors.text;
      return <Text style={{color}}>{value}</Text>;
    }
    if (constants.REPORTS_LIST[name]) {
      return <Text style={{color: constants.REPORTS_LIST[name]}}>{value}</Text>;
    }
    return value;
  };

  renderPropertyCell = property => name => (
    <Cell key={`property_cell_${property.code}_${name}`}>
      {this.renderPropertyData(name, property)}
    </Cell>
  );

  renderExtendedProperty = property => name => {
    const {theme} = this.props;
    const width = Dimensions.get('window');
    const styles = useStyles(theme, width);
    const color =
      constants.REPORTS_LIST[name] ||
      Color(theme.colors.text)
        .alpha(0.54)
        .rgb()
        .string();
    return (
      <View style={styles.extendedProperty} key={`${property.code}_${name}`}>
        <Text>{translationService.get(name)}</Text>
        <Caption style={{color}}>{property[name]}</Caption>
      </View>
    );
  };

  renderProperty = (property, index) => {
    const {theme} = this.props;
    return (
      <View key={`property_${property.code}`}>
        <DataTable.Row onPress={this.onPropertyClick(index)}>
          {constants.REPORTS_TABLE_LIST.map(this.renderPropertyCell(property))}
        </DataTable.Row>
        <Portal>
          <Dialog
            visible={this.state.propertyExpand[index]}
            onDismisss={this.onPropertyClick(index)}>
            <Dialog.Title>{property.name}</Dialog.Title>
            <Dialog.Content>
              {constants.REPORTS_TABLE_EXTENDED_LIST.map(
                this.renderExtendedProperty(property),
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                color={theme.colors.switch}
                onPress={this.onPropertyClick(index)}>
                {translationService.get('ok')}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  };

  renderProperties = () => {
    const {properties} = reportService;
    if (!properties.length) {
      return null;
    }
    return (
      <DataTable>
        <DataTable.Header>
          {constants.REPORTS_TABLE_LIST.map(this.renderPropertyHeader)}
        </DataTable.Header>
        {properties.map(this.renderProperty)}
      </DataTable>
    );
  };

  render() {
    const {theme} = this.props;
    const width = Dimensions.get('window').width;
    const styles = useStyles(theme, width);
    return (
      <ScrollView
        style={styles.container}
        refreshControl={this.renderRefreshControl()}>
        <Card>
          <View style={styles.header}>
            <Card.Title
              titleStyle={styles.headerTitleDetails}
              style={styles.headerTitle}
              title={translationService.get('reportClosing')}
            />
            {this.renderDateSelector()}
          </View>
          <Divider style={styles.divider} />
          <View style={styles.amount}>
            {Object.keys(constants.REPORTS_LIST).map(this.renderReportAmount)}
          </View>
          <Divider style={styles.divider} />
          {this.renderProperties()}
        </Card>
      </ScrollView>
    );
  }
}

const useStyles = (theme, width) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      width: width * 0.55,
      marginRight: width * 0.05,
    },
    headerTitleDetails: {
      fontSize: 16,
    },
    dateSelector: {
      width: width * 0.35,
      marginRight: width * 0.05,
    },
    dateRadio: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    amount: {
      width: width * 0.8,
      marginVertical: 16,
      marginHorizontal: width * 0.02,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    amountTile: {
      marginHorizontal: width * 0.02,
      width: width * 0.28,
      marginVertical: 8,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 2,
      elevation: 2,
    },
    divider: {
      width: '100%',
      height: 2 * StyleSheet.hairlineWidth,
    },
    amountText: {
      color: theme.colors.element,
    },
    extendedProperty: {
      marginBottom: 8,
    },
  });

export default withTheme(Report);
