/**
 * k means algorithm
 * @param data
 * @param k
 * @return {Object}
 */

function kmeans(data, k) {
  var centroids = [];

  var min = 0.0, max = 1.0, amountValues = 3;

  // Set min and max values
  for (var i = 0; i < data.length; ++i) {
    for (var j = 0; j < Object.values(data[i]).length; ++j) {
      var value = Object.values(data[i])[j];
      min = (value < min) ? value : min;
      max = (value > max) ? value : max;
    }
  }

  // Set amount of values in each dimension
  amountValues = Object.keys(data[0]).length;

  // Randomly set values within range to determine initial centroids
  for (var i = 0; i < k; ++i) {
    var cent = {};
    for (var j = 0; j < amountValues; ++j) {
      var value = Math.random() * (max - -min) - min;
      cent[ ['A','B','C'][j] ] = value;
    }
    centroids.push(cent);
  }

  console.log(centroids);

  
};
    
    