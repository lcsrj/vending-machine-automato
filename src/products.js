/** Catálogo visual da Automata Soda. O AFD continua definido separadamente. */
export const products = Object.freeze([
  Object.freeze({
    id: 'fagulha',
    name: 'Fagulha Fizz',
    flavor: 'cereja elétrica',
    price: 30,
    route: Object.freeze([5, 25]),
    className: 'product--fagulha'
  }),
  Object.freeze({
    id: 'nebula',
    name: 'Nébula Nox',
    flavor: 'uva cósmica',
    price: 35,
    route: Object.freeze([10, 25]),
    className: 'product--nebula'
  }),
  Object.freeze({
    id: 'solaris',
    name: 'Solaris Splash',
    flavor: 'cítrico solar',
    price: 40,
    route: Object.freeze([5, 10, 25]),
    className: 'product--solaris'
  }),
  Object.freeze({
    id: 'violeta',
    name: 'Violeta Volt',
    flavor: 'ameixa neon',
    price: 45,
    route: Object.freeze([10, 10, 25]),
    className: 'product--violeta'
  })
]);

export function productById(id) {
  return products.find((product) => product.id === id) ?? products[0];
}

export function productChange(product, credit) {
  return Math.max(0, credit - product.price);
}

export function canRelease(product, snapshot) {
  return snapshot.accepted && snapshot.credit >= product.price;
}
