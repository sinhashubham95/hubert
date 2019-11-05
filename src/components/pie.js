import React from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import {Surface, Group, Text} from '@react-native-community/art';
import {withTheme} from 'react-native-paper';

import * as shape from 'd3-shape';
import AnimatedShape from './animatedShape';

class Pie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: 0,
    };
  }

  onSelectedIndexChange = index => this.setState({highlightedIndex: index});

  value = item => {
    return item.value;
  };

  color = item => {
    return item.color;
  };

  createPieChart = (item, index) => {
    const arcs = shape.pie().value(this.value)(this.props.data);
    const highlightedArc = shape
      .arc()
      .outerRadius(this.props.width / 2 - this.props.margin)
      .padAngle(0.05)
      .innerRadius(
        this.props.width / 2 -
          this.props.margin -
          this.props.cover -
          this.props.selectionRaise,
      );
    const arc = shape
      .arc()
      .outerRadius(
        this.props.width / 2 - this.props.margin - this.props.selectionRaise,
      )
      .padAngle(0.05)
      .innerRadius(
        this.props.width / 2 -
          this.props.margin -
          this.props.cover -
          this.props.selectionRaise,
      );
    const arcData = arcs[index];
    const path =
      this.state.highlightedIndex === index
        ? highlightedArc(arcData)
        : arc(arcData);
    return {
      path,
      color: this.color(item),
    };
  };

  renderShape = (item, index) => (
    <TouchableWithoutFeedback
      key={'pie_shape_' + index}
      onPress={() => this.onSelectedIndexChange(index)}>
      <AnimatedShape
        color={this.color(item)}
        d={() => this.createPieChart(item, index)}
      />
    </TouchableWithoutFeedback>
  );

  render() {
    const x = this.props.width / 2;
    const y = this.props.height / 2;
    const {data, theme} = this.props;
    const {highlightedIndex} = this.state;
    return (
      <View style={this.props.style}>
        <Surface width={this.props.width} height={this.props.height}>
          <Group x={x} y={y}>
            {data.map(this.renderShape)}
            {data[highlightedIndex] && (
              <Text fill={theme.colors.text} stroke={theme.colors.text}>
                {this.value(data[highlightedIndex])}
              </Text>
            )}
          </Group>
        </Surface>
      </View>
    );
  }
}

export default withTheme(Pie);
