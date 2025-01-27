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
  Portal,
  Dialog,
  RadioButton,
  TouchableRipple,
  overlay,
} from 'react-native-paper';
import {PieChart} from 'react-native-svg-charts';
import {Text as TextArt} from 'react-native-svg';
import PureChart from 'react-native-pure-chart';
import Snackbar from 'react-native-snackbar';

import Button from '../components/button';
import Icon from '../components/icon';

import {formatCurrency, formatPercentage} from '../utils';
import DashboardService from '../utils/dashboardService';
import * as constants from '../constants';
import translationService from '../utils/translationService';

class Dashboard extends Component {
  static navigationOptions = {
    tabBarIcon: () => <Icon name="line-chart" size={24} type="fa" secondary />,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      init: false,
      selectedDate: '',
      radioDate: '',
      showSelectedDates: false,
      highlightedIndex: 0,
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

  onHighlightedIndexChange = index => this.setState({highlightedIndex: index});

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
    try {
      await DashboardService.init(this.props.screenProps.clientCode);
    } catch (e) {
      this.showError(e.message);
    }
    const dates = Object.keys(DashboardService.reports);
    const selectedDate = dates.length ? dates[dates.length - 1] : '';
    const radioDate = dates.length ? dates[dates.length - 1] : '';
    this.setState({
      init: true,
      selectedDate,
      radioDate,
      highlightedIndex: 0,
    });
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
    const selectedDate = dates.length ? dates[dates.length - 1] : '';
    const radioDate = dates.length ? dates[dates.length - 1] : '';
    this.setState({
      loading: false,
      selectedDate,
      radioDate,
      highlightedIndex: 0,
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
      refreshing={this.state.loading || !this.state.init}
      onRefresh={this.fetchDataWithLoading}
    />
  );

  renderProgress = (value, index) => {
    const {theme} = this.props;
    const styles = useStyles(theme);
    return (
      <TouchableRipple
        style={styles.bar}
        key={value.key}
        onPress={() => this.onHighlightedIndexChange(index)}>
        <View>
          <View style={styles.barText}>
            <Text>{value.title}</Text>
            <Text>{value.count}</Text>
          </View>
          <ProgressBar
            progress={value.percentage / 100.0}
            color={value.color}
          />
        </View>
      </TouchableRipple>
    );
  };

  renderDateSelector = () => {
    const {theme} = this.props;
    const width = Dimensions.get('window').width;
    const styles = useStyles(theme, width);
    const {selectedDate, showSelectedDates, radioDate} = this.state;
    const dates = Object.keys(DashboardService.reports);
    if (
      !dates.length ||
      !DashboardService.reports ||
      !DashboardService.reports[selectedDate]
    ) {
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
            <Dialog.Title>
              {translationService.get('dateSelector')}
            </Dialog.Title>
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

  renderReportAmount = name => {
    const {theme} = this.props;
    const width = Dimensions.get('window').width;
    const styles = useStyles(theme, width);
    const {selectedDate} = this.state;
    const dates = Object.keys(DashboardService.reports);
    if (
      !dates.length ||
      !DashboardService.reports ||
      !DashboardService.reports[selectedDate]
    ) {
      return null;
    }
    return (
      <View
        key={name}
        style={[
          styles.reportAmountTile,
          {backgroundColor: constants.REPORTS_LIST[name]},
        ]}>
        <Text style={styles.reportAmountText}>
          {translationService.get(name)}
        </Text>
        <Text style={styles.reportAmountText}>
          {formatCurrency(DashboardService.reports[selectedDate][name])}
        </Text>
      </View>
    );
  };

  renderReportChart = () => {
    const {theme} = this.props;
    const dates = Object.keys(DashboardService.reports);
    const {selectedDate} = this.state;
    if (
      !dates.length ||
      !DashboardService.reports ||
      !DashboardService.reports[selectedDate]
    ) {
      return null;
    }
    const reports = Object.keys(constants.REPORTS_LIST).map(name => ({
      seriesName: translationService.get(name),
      color: constants.REPORTS_LIST[name],
      data: Object.values(DashboardService.reports).map(value => ({
        x: value.displayDate,
        y: value[name],
      })),
    }));
    const color =
      theme.dark && theme.mode === 'adaptive'
        ? overlay(4, theme.colors.surface)
        : theme.colors.surface;
    return (
      <PureChart
        height={160}
        type="bar"
        data={reports}
        showEvenNumberXaxisLabel={false}
        backgroundColor={color}
        labelColor={theme.colors.text}
      />
    );
  };

  render() {
    const {theme} = this.props;
    const {highlightedIndex} = this.state;
    const width = Dimensions.get('window').width;
    const styles = useStyles(theme, width);
    const values = Object.values(DashboardService.data);
    const highlightedArc = {
      outerRadius: width * 0.2,
      innerRadius: width * 0.18,
    };
    const arc = {
      outerRadius: width * 0.19,
      innerRadius: width * 0.18,
    };
    const series = values.map((value, index) => ({
      value: value.percentage,
      label: value.title,
      svg: {
        fill: value.color,
        onPress: () => this.onHighlightedIndexChange(index),
      },
      arc: highlightedIndex === index ? highlightedArc : arc,
      key: index,
    }));
    const text = values[highlightedIndex]
      ? formatPercentage(values[highlightedIndex].percentage.toFixed(2))
      : '';
    return (
      <ScrollView
        style={styles.container}
        refreshControl={this.renderRefreshControl()}>
        <Card>
          <Card.Title
            title={translationService.get('rentalStatus')}
            titleStyle={styles.headerTitle}
          />
          <Divider style={styles.divider} />
          <View style={styles.pieContainer}>
            <PieChart
              style={styles.pie}
              data={series}
              outerRadius={width * 0.2}
              innerRadius={width * 0.19}
              padAngle={0.05}>
              <TextArt
                fill={theme.colors.text}
                stroke={theme.colors.text}
                textAnchor="middle"
                fontSize={20}>
                {text}
              </TextArt>
            </PieChart>
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
              title={translationService.get('reportClosing')}
              titleStyle={styles.headerTitle}
            />
            {this.renderDateSelector()}
          </View>
          <Divider style={styles.divider} />
          <View style={styles.reportAmount}>
            {Object.keys(constants.REPORTS_LIST).map(this.renderReportAmount)}
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
    headerTitle: {
      fontSize: 16,
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
      width: width * 0.5,
      height: width * 0.5,
    },
    divider: {
      width: '100%',
      height: 2 * StyleSheet.hairlineWidth,
    },
    verticalDivider: {
      height: '100%',
      width: 2 * StyleSheet.hairlineWidth,
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
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      width: width * 0.55,
      marginRight: width * 0.05,
    },
    reportDateSelector: {
      width: width * 0.35,
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
    reportAmountText: {
      color: theme.colors.element,
    },
  });

export default withTheme(Dashboard);
