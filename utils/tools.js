

let tools = {
  shuffle() {
    var array = this;
    var m = array.length,
      t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }
}


export default tools