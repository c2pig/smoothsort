const SmoothSort = require("../SmoothSort");

const arr = ["peach", "straw", "apple", "spork"];
console.log(`Unsorted List: ${arr}`);
SmoothSort(arr, (el1, el2) => el1.localeCompare(el2));
console.log(`Sorted List: ${arr}`);
