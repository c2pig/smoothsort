const log = require('util').debuglog('app');

const defComparator = (el1, el2) => {
  if(typeof el === "string") {
    return el1.localeCompare(el2);
  }
  return el1 - el2;
}

const sizeOfTree = (n) => {
  const s = n.toString(2).split('');
  return s.map((x,i) => ((x === "1") ? s.length - i - 1 : 0)).filter(x => x !== 0).map(x => LP[x]);
}


const findTrailingZeros = (bin) => {
  let c = 0;
  const binString = bin.toString(2);
  for(i=binString.length-1; i != 0; i--) {
    if(binString.charAt(i) === "0") {
      c++;
    } else {
      return c;
    }
  }
  return c;
}

const LP = [1, 1, 3, 5, 9, 15, 25, 41, 67, 109, 177, 287, 465, 
  753, 1219, 1973, 3193, 5167, 8361, 13529, 21891, 35421, 
  57313, 92735, 150049, 242785, 392835, 635621, 1028457, 1664079, 
  2692537, 4356617, 7049155, 11405773, 18454929, 29860703,
  48315633, 78176337, 126491971, 204668309, 331160281, 535828591,
  866988873];

const sift = (arr, pshift, head, comparator) => {
  const currNode = arr[head];
  while (pshift > 1) {
    let rt = head - 1;
    let lf = head - 1 - LP[pshift - 2];
    if(comparator(currNode, arr[lf]) >= 0 && comparator(currNode, arr[rt]) >= 0) {
      break
    }
    if (comparator(arr[lf], arr[rt]) >= 0) {
        arr[head] = arr[lf];
        head = lf;
        pshift -= 1;
    } else {
        arr[head] = arr[rt];
        head = rt;
        pshift -= 2;
    }
  }
  arr[head] = currNode;
}

const trinkle = (arr, bitmap, pshift, head, isTrusty, comparator) => {
  
  const currNode = arr[head];
  while (bitmap != 1) {
    const stepson = head - LP[pshift];

    if (comparator(arr[stepson], currNode) <= 0) {
      break; 
    }

    if (!isTrusty && pshift > 1) {
        let rt = head - 1;
        let lf = head - 1 - LP[pshift - 2];
        if (comparator(arr[rt], arr[stepson]) >= 0
          || comparator(arr[lf], (arr[stepson])) >= 0) {
          break;
        }
    }
    arr[head] = arr[stepson];
  
    head = stepson;
    const trail = findTrailingZeros(bitmap & ~1);
    bitmap >>>= trail;
    pshift += trail;
    isTrusty = false;
  }

  if (!isTrusty) {
    arr[head] = currNode;
    sift(arr, pshift, head, comparator);
  }
}

module.exports = SmoothSort = (arr, comparator = defComparator) => {
  let head = 0;
  let bitmap = 1;
  let pshift = 1;
  while (head < arr.length-1) {
   log(`[Insert]  Rep:(${bitmap.toString(2)}|${pshift}), TreeSize:(${sizeOfTree(bitmap << pshift)}), Arr:[${arr.slice(0, head)}] <- [${arr[head]}]`);
    if ((bitmap & 3) == 3) {
      // combine 2 stretch 
      sift(arr, pshift, head, comparator);
      bitmap >>>= 2; 
      pshift = pshift + 2;
    } else {
      // adding a new block of length 1
      if(LP[pshift - 1] >= arr.length - head) {
        // bubble down sort
        trinkle(arr, bitmap, pshift, head, false, comparator);
      } else {
        sift(arr, pshift, head, comparator);
      }
      // add a stretch of length 1
      if (pshift === 1) {
          // LP[1] is being used, so we add use LP[0]
          bitmap <<= 1;
          pshift--;
      } else {
          // shift out to position 1, add LP[1]
          bitmap <<= (pshift - 1);
          pshift = 1;
      }
    }
    bitmap |= 1;
    head++;
  }
  trinkle(arr, bitmap, pshift, head, false, comparator);
  while (pshift != 1 || bitmap != 1) {
    log(`[Dequeue]  Rep:(${bitmap.toString(2)}|${pshift}), TreeSize:(${sizeOfTree(bitmap << pshift)}), Arr:[${arr}]`);
    if (pshift <= 1) {
        const trail = findTrailingZeros(bitmap & ~1);
        bitmap >>>= trail;
        pshift += trail;
    } else {
        bitmap <<= 2;
        bitmap ^= 7;
        pshift -= 2;

        // TODO: more debug to find out what does it mean
        // This block gets broken into three bits. The rightmost
        // bit is a block of length 1. The left hand part is split into
        // two, a block of length LP[pshift+1] and one of LP[pshift].
        // Both these two are appropriately heapified, but the root
        // nodes are not necessarily in order. We therefore semitrinkle
        // both of them
        trinkle(arr, bitmap >>> 1, pshift + 1, head - LP[pshift] - 1, true, comparator);
        trinkle(arr, bitmap, pshift, head - 1, true, comparator);
    }
    head--;
  }
}
