import React from 'react';

import {Appbar, withTheme} from 'react-native-paper';

const Dashboard = () => {
  return (
    <Appbar.Header>
      <Appbar.Content title="Hubert" />
    </Appbar.Header>
  );
};

export default withTheme(Dashboard);
