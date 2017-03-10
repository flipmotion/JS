import trips from './trips';

Object.find = function(path, obj) {
  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj || this);
};

const tripsNew = trips.slice(0);

const compare = (a, b, reverse) => {
  return reverse === 'ASC' ? a >= b : a <= b;
}

const createComporator = (path, key) => (prev, current) => {
  return(compare(
    Object.find(path, prev),
    Object.find(path, current),
    key, 
  ))
}


trips.sort(createComporator('price.value', 'ASC'));
console.log(`Sort ASC: ${trips.map(item=>item.price.value)}`);

tripsNew.sort(createComporator('price.value', 'DESC'));
console.log(`Sort DESC: ${tripsNew.map(item=>item.price.value)}`);
