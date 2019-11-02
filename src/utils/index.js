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
