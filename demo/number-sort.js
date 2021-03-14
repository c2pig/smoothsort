const SmoothSort = require('../SmoothSort');
const { generator } = require('./utils');

const arr = generator(8, false).reverse();
console.log(`Unsorted List: ${arr}`);
SmoothSort(arr);
console.log(`Sorted List: ${arr}`);