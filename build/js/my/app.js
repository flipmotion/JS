import trips from './trips';

const findPath = (path, obj) => {
  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj || this); 
}

const tripsNew = trips.slice(0);
const tripsCustom = trips.slice(0);

const compare = (a, b, reverse = false) => {
  if(a === b || a === undefined || b === undefined) return 0;
  if(reverse) {
    return a > b ? -1 : 1;
  } else {
    return a > b ? 1 : -1;
  }
}

const createComporator = (path, key) => (prev, current) => {
  return(compare(
    findPath(path, prev),
    findPath(path, current),
    key,
  ))
}

console.log(Object.prototype);

trips.sort(createComporator('price.value', false));
console.log(`Sort ASC: ${trips.map(item=>item.price.value)}`);

tripsNew.sort(createComporator('price.value', true));
console.log(`Sort DESC: ${tripsNew.map(item=>item.price.value)}`);

tripsCustom.sort(createComporator('carrier-name'));
console.log(tripsCustom);
//console.log(`Sort DESC: ${tripsCustom.map(item=>item.price.value)}`);