import React from 'react';
import {LayoutAnimation} from 'react-native';
import {Shape} from '@react-native-community/art';

import Morph from 'art/morph/path';

const AnimationDurationMs = 250;

export default class AnimatedShape extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      path: '',
    };
  }

  componentDidMount() {
    this.updateState();
  }

  componentDidUpdate(prevProps) {
    if (this.props.path !== prevProps.path) {
      this.updateState();
    }
  }

  updateState() {
    const graph = this.props.d();
    this.setState({
      path: graph.path,
    });
    if (!this.previousGraph) {
      this.previousGraph = graph;
    }
    const pathFrom = this.previousGraph.path;
    const pathTo = graph.path;
    cancelAnimationFrame(this.animating);
    this.animating = null;
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        AnimationDurationMs,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
    this.setState(
      {
        path: Morph.Tween(pathFrom, pathTo),
      },
      this.animate,
    );
    this.previousGraph = graph;
  }

  animate(start) {
    this.animating = requestAnimationFrame(timestamp => {
      if (!start) {
        start = timestamp;
      }
      const delta = (timestamp - start) / AnimationDurationMs;
      if (delta > 1) {
        this.animating = null;
        this.setState({
          path: this.previousGraph.path,
        });
        return;
      }
      this.state.path.tween(delta);
      this.setState(this.state, () => this.animate(start));
    });
  }

  render() {
    const path = this.state.path;
    return <Shape d={path} stroke={this.props.color} fill={this.props.color} />;
  }
}
