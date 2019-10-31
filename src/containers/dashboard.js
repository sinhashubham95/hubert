import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {withTheme, Divider, Card, ProgressBar, Text} from 'react-native-paper';
import PieChart from 'react-native-pie-chart';
import Snackbar from 'react-native-snackbar';

import Icon from '../components/icon';

import DashboardService from '../utils/dashboardService';

class Dashboard extends Component {
  static navigationOptions = {
    tabBarIcon: () => <Icon name="line-chart" size={24} type="fa" secondary />,
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
    this.setState({loading: false});
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
  });

export default withTheme(Dashboard);
