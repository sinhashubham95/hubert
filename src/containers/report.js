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
} from 'react-native-paper';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import momemt from 'moment';

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
      selectedDate: '',
      radioDate: '',
      showSelectedDates: false,
      propertyExpand: [],
    };
  }

  componentDidMount() {
    this.fetchDatesWithLoading();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.screenProps.clientCode !== this.props.screenProps.clientCode
    ) {
      this.fetchDatesWithLoading();
    }
    if (prevState.selectedDate !== this.state.selectedDate) {
      this.fetchRentalDetailsWithLoading();
    }
  }

  onRadioDateChange = value => this.setState({radioDate: value});

  onPropertyClick = ind => () => {
    let {propertyExpand} = this.state;
    propertyExpand = Object.assign([], propertyExpand);
    propertyExpand[ind] = !propertyExpand[ind];
    this.setState({propertyExpand});
  };

  fetchDatesWithLoading = () => {
    this.setState({loading: true}, this.fetchDates);
  };

  fetchRentalDetailsWithLoading = () => {
    this.setState({loading: true}, this.fetchRentalDetails);
  };

  fetchDates = async () => {
    const {screenProps} = this.props;
    try {
      await reportService.getDates(screenProps.clientCode);
    } catch (e) {
      this.showError(e.message);
    }
    const dates = reportService.dates;
    this.setState({
      loading: false,
      selectedDate: dates.length ? dates[0] : '',
      radioDate: dates.length ? dates[0] : '',
      showSelectedDates: false,
    });
  };

  fetchRentalDetails = async () => {
    const {screenProps} = this.props;
    const {selectedDate} = this.state;
    try {
      await reportService.getRentalDetails(
        screenProps.clientCode,
        selectedDate,
      );
    } catch (e) {
      this.showError(e.message);
    }
    const {properties} = reportService;
    this.setState({
      loading: false,
      propertyExpand: properties.map(() => false),
    });
  };

  showError = message => {
    Snackbar.show({
      duration: Snackbar.LENGTH_SHORT,
      title: message,
    });
  };

  formatDate = date => momemt(date).format('DD/MM/YYYY');

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
              <Button onPress={this.hideSelectedDates}>
                {translationService.get('cancel')}
              </Button>
              <Button onPress={this.updateSelectedDate}>
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
      refreshing={this.state.loading}
      onRefresh={this.fetchDatesWithLoading}
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
        <Text>{translationService.get(name)}</Text>
        <Text>{reportService[name]}</Text>
      </View>
    );
  };

  renderPropertyHeader = name => (
    <DataTable.Title key={`property_header_${name}`}>
      {translationService.get(name)}
    </DataTable.Title>
  );

  renderPropertyData = (name, value) => {
    if (constants.REPORTS_LIST[name]) {
      return <Text style={{color: constants.REPORTS_LIST[name]}}>{value}</Text>;
    }
    return value;
  };

  renderPropertyCell = property => name => (
    <DataTable.Cell key={`property_cell_${property.code}_${name}`}>
      {this.renderPropertyData(name, property[name])}
    </DataTable.Cell>
  );

  renderProperty = (property, index) => (
    <View key={`property_${property.code}`}>
      <DataTable.Row onPress={this.onPropertyClick(index)}>
        {constants.REPORTS_TABLE_LIST.map(this.renderPropertyCell(property))}
      </DataTable.Row>
      <Portal>
        <Dialog
          visible={this.state.propertyExpand[index]}
          onDismisss={this.onPropertyClick(index)}>
          <Dialog.Title>{property.name}</Dialog.Title>
          <DataTable>
            <DataTable.Header>
              {constants.REPORTS_TABLE_EXTENDED_LIST.map(
                this.renderPropertyHeader,
              )}
            </DataTable.Header>
            <DataTable.Row>
              {constants.REPORTS_TABLE_EXTENDED_LIST.map(
                this.renderPropertyCell(property),
              )}
            </DataTable.Row>
          </DataTable>
          <Dialog.Actions>
            <Button onPress={this.onPropertyClick(index)}>
              {translationService.get('ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );

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
      width: width * 0.6,
      marginRight: width * 0.05,
    },
    headerTitleDetails: {
      fontSize: 16,
    },
    dateSelector: {
      width: width * 0.3,
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
  });

export default withTheme(Report);
