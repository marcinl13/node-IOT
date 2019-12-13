let averageArr = arr => {
  let sum = arr.reduce((a, b) => {
    return a + b;
  });

  return sum / arr.length;
};

module.exports = averageArr;
