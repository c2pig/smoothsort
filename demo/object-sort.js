const SmoothSort = require("../SmoothSort");
const { generator, createObject } = require("./utils");

const arr = generator(8, false)
  .reverse()
  .map(createObject);

console.log("UnsortedList:");
console.log(arr);
SmoothSort(arr, (el1, el2) => {
  return el1.id - el2.id;
});
console.log("Sorted List:");
console.log(arr);
