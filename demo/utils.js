const generator = (range, random = true) => {
    let data = [];
    for(i=0; i<range;i++) {
      data.push(random ? Math.ceil(Math.random() * 100) : i);
    }
    return data;
  }
  
const createObject = (x) => {
  return {
    id: Math.ceil(Math.random() * 1000000),
    name: [...Array(10)].map(() => Math.random().toString(36)[2]).join(''),
    age: x
  }
}

module.exports = {
  generator,
  createObject
}
