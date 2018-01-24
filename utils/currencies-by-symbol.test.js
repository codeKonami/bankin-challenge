const currenciesBySymbol = require('./currencies-by-symbol');

test('Test Euro', () => {
  expect(currenciesBySymbol['€'].code).toBe('EUR');
});
