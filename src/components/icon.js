import React from 'react';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import IcIcon from 'react-native-vector-icons/Ionicons';
import McdIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EnIcon from 'react-native-vector-icons/Entypo';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import {withTheme} from 'react-native-paper';

const ICON_SETS = {
  en: EnIcon,
  md: MdIcon,
  ic: IcIcon,
  mcd: McdIcon,
  fa: FaIcon,
};

const Icon = props => {
  const {theme, name, type, secondary, ...rest} = props;
  const IconSet = ICON_SETS[type];
  let color = theme.colors.text;
  if (secondary) {
    color = theme.colors.element;
  }
  return <IconSet name={name} color={color} {...rest} />;
};

export default withTheme(Icon);
