import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  withTheme,
  Divider,
  Card,
  ProgressBar,
  Text,
  Button,
  Portal,
  Dialog,
  RadioButton,
} from 'react-native-paper';
import PieChart from 'react-native-pie-chart';
import PureChart from 'react-native-pure-chart';
import Snackbar from 'react-native-snackbar';

import Icon from '../components/icon';

import DashboardService from '../utils/dashboardService';
import * as constants from '../constants';

class Dashboard extends Component {
  static navigationOptions = {
    tabBarIcon: () => <Icon name="line-chart" size={24} type="fa" secondary />,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedDate: '',
      radioDate: '',
      showSelectedDates: false,
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

  onRadioDateChange = value => this.setState({radioDate: value});

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
      await DashboardService.get(clientCode);
    } catch (e) {
      this.showError(e.message);
    }
    const dates = Object.keys(DashboardService.reports);
    this.setState({
      loading: false,
      selectedDate: dates[0] || '',
      radioDate: dates[0] || '',
    });
  };

  showError = message => {
    Snackbar.show({
      duration: Snackbar.LENGTH_SHORT,
      title: message,
    });
  };

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

  renderRefreshControl = () => (
    <RefreshControl
      refreshing={this.state.loading}
      onRefresh={this.fetchDataWithLoading}
    />
  );

  renderProgress = value => {
    const {theme} = this.props;
    const styles = useStyles(theme);
    return (
      <View key={value.key} style={styles.bar}>
        <Text style={styles.barText}>{value.title}</Text>
        <ProgressBar progress={value.percentage / 100.0} color={value.color} />
      </View>
    );
  };

  renderDateSelector = () => {
    const {theme} = this.props;
    const width = Dimensions.get('window').width;
    const styles = useStyles(theme, width);
    const {selectedDate, showSelectedDates, radioDate} = this.state;
    const dates = Object.keys(DashboardService.reports);
    if (!dates.length) {
      return null;
    }
    return (
      <View style={styles.reportDateSelector}>
        <Button mode="outlined" onPress={this.showSelectedDates}>
          {DashboardService.reports[selectedDate].displayDate}
        </Button>
        <Portal>
          <Dialog
            visible={showSelectedDates}
            onDismiss={this.hideSelectedDates}>
            <Dialog.Title>Choose a Date</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group
                value={radioDate}
                onValueChange={this.onRadioDateChange}>
                {dates.map(date => (
                  <View style={styles.reportDateRadio} key={date}>
                    <RadioButton value={date} />
                    <Text>
                      {DashboardService.reports[date]
                        ? DashboardService.reports[date].displayDate
                        : ''}
                    </Text>
                  </View>
                ))}
              </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this.hideSelectedDates}>CANCEL</Button>
              <Button onPress={this.updateSelectedDate}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  };

  renderReportAmount = name => {
    const {theme} = this.props;
    const width = Dimensions.get('window').width;
    const styles = useStyles(theme, width);
    const {selectedDate} = this.state;
    const dates = Object.keys(DashboardService.reports);
    if (!dates.length) {
      return null;
    }
    return (
      <View
        key={name}
        style={[
          styles.reportAmountTile,
          {backgroundColor: constants.DASHBOARD_REPORTS_LIST[name]},
        ]}>
        <Text>{name}</Text>
        <Text>{DashboardService.reports[selectedDate][name]}</Text>
      </View>
    );
  };

  renderReportChart = () => {
    const dates = Object.keys(DashboardService.reports);
    if (!dates.length) {
      return null;
    }
    const reports = Object.keys(constants.DASHBOARD_REPORTS_LIST).map(name => ({
      seriesName: name,
      color: constants.DASHBOARD_REPORTS_LIST[name],
      data: Object.values(DashboardService.reports).map(value => ({
        x: value.displayDate,
        y: value[name],
      })),
    }));
    return (
      <PureChart
        height={160}
        type="bar"
        data={reports}
        showEvenNumberXaxisLabel={false}
      />
    );
  };

  render() {
    const {theme} = this.props;
    const width = Dimensions.get('window').width;
    const styles = useStyles(theme, width);
    const values = Object.values(DashboardService.data);
    const series = Object.values(DashboardService.data).map(
      value => value.percentage,
    );
    const colors = Object.values(DashboardService.data).map(
      value => value.color,
    );
    return (
      <ScrollView
        style={styles.container}
        refreshControl={this.renderRefreshControl()}>
        <Card>
          <Card.Title title="Rental Status" />
          <Divider />
          <View style={styles.pieContainer}>
            <PieChart
              style={styles.pie}
              series={series}
              sliceColor={colors}
              chart_wh={width * 0.4}
              doughnut
              coverRadius={0.9}
              coverFill={theme.colors.surface}
            />
            <Divider style={styles.verticalDivider} />
            <View style={styles.progress}>
              {values.map(this.renderProgress)}
            </View>
          </View>
        </Card>
        <Card style={styles.reports}>
          <View style={styles.reportHeader}>
            <Card.Title
              style={styles.reportHeaderTitle}
              title="Reports by Closing Date"
            />
            {this.renderDateSelector()}
          </View>
          <Divider />
          <View style={styles.reportAmount}>
            {Object.keys(constants.DASHBOARD_REPORTS_LIST).map(
              this.renderReportAmount,
            )}
          </View>
          <View style={styles.chartContainer}>{this.renderReportChart()}</View>
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
    loading: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pieContainer: {
      flexDirection: 'row',
      width: '100%',
    },
    pie: {
      marginVertical: 16,
      marginHorizontal: width * 0.05,
    },
    verticalDivider: {
      height: '100%',
      width: StyleSheet.hairlineWidth,
    },
    progress: {
      flexDirection: 'column',
      width: width * 0.5,
      paddingHorizontal: width * 0.05,
      height: '100%',
      marginTop: 8,
    },
    bar: {
      marginTop: 8,
    },
    barText: {
      marginBottom: 4,
    },
    reports: {
      marginTop: 8,
    },
    reportHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    reportHeaderTitle: {
      width: width * 0.65,
      marginRight: width * 0.05,
    },
    reportDateSelector: {
      width: width * 0.25,
      marginRight: width * 0.05,
    },
    reportDateRadio: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reportAmount: {
      width: width * 0.8,
      marginVertical: 16,
      marginHorizontal: width * 0.02,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    reportAmountTile: {
      marginHorizontal: width * 0.02,
      width: width * 0.28,
      marginVertical: 8,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 2,
      elevation: 2,
    },
    chartContainer: {
      width: '100%',
      marginVertical: 16,
      paddingHorizontal: width * 0.04,
    },
  });

export default withTheme(Dashboard);
