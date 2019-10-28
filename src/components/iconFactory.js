import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

/** Place all the icons which gonna be using across the application */
const getIcon = props => {
  const {name, size, style} = props;
  let iconType;
  switch (name) {
    case 'checked':
      iconType = <Icon name="done" size={size} color="#00ff00" style={style} />;
      break;
    case 'unchecked':
      iconType = <Icon name="done" size={size} color="#999" style={style} />;
      break;
    case 'keyboard':
      iconType = <Icon {...props} name="keyboard" />;
      break;
    case 'more-vert':
      iconType = <Icon {...props} name="more-vert" />;
      break;
    case 'keyboard-arrow-down':
      iconType = <Icon {...props} name="keyboard-arrow-down" />;
      break;
    case 'keyboard-arrow-up':
      iconType = <Icon {...props} name="keyboard-arrow-up" />;
      break;
    case 'search':
      iconType = <Icon {...props} name="search" />;
      break;
    case 'refresh':
      iconType = <Icon {...props} name="refresh" />;
      break;
    case 'comment':
      iconType = <Icon {...props} name="comment" />;
      break;
    case 'expand-more':
      iconType = <Icon {...props} name="expand-more" />;
      break;
    case 'expand-less':
      iconType = <Icon {...props} name="expand-less" />;
      break;
    case 'place':
      iconType = <Icon {...props} name="place" />;
      break;
    case 'chevron-right':
      iconType = <Icon {...props} name="chevron-right" />;
      break;
    default:
      break;
  }
  return iconType;
};

const IconFactory = props => getIcon(props);

export default IconFactory;
