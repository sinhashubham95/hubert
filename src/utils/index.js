import Restart from 'react-native-restart';
import authService from './authService';
import userInformationService from './userInformationService';

export const formatCurrency = value => {
  let split = `${value}`.split('.');
  let [l, r] = split;
  if (!r) {
    r = '0';
  }
  const lLength = l.length;
  let fl = '';
  for (let i = 0; i < lLength; i += 1) {
    if ((lLength - i) % 3 === 0 && i > 0 && l[i - 1] !== '-') {
      fl = fl + '.';
    }
    fl = fl + l[i];
  }
  return `R$ ${fl},${r}`;
};

export const formatPercentage = value => {
  let split = `${value}`.split('.');
  let [l, r] = split;
  if (!r) {
    return `${l}%`;
  }
  return `${l},${r}%`;
};

export const restart = async () => {
  await authService.clear();
  Restart.restart();
  await userInformationService.clear();
};
