/**
 * k means algorithm
 * @param data
 * @param k
 * @return {Object}
 */

function kmeans(data, k) {
  var centroids = [];
  var iterations = 10;

  var min = 0.0, max = 1.0, amountValues = 3;

  // Set min and max values
  for (var i = 0; i < data.length; ++i) {
    for (var j = 0; j < Object.values(data[i]).length; ++j) {
      var value = Object.values(data[i])[j];
      min = (value < min) ? value : min;
      max = (value > max) ? value : max;
    }
  }

  // The keys of a data item
  var dataKeys = Object.keys(data[0]);

  var centroids = [];

  // Randomly set values within range and determine initial centroids
  for (var i = 0; i < k; ++i) {
    var dim = {}

    for (var j = 0; j < dataKeys.length; ++j) {
      var value = Math.random() * (max - -min) - min; //random value in range
      dim[ dataKeys[j] ] = value;
    }
    centroids.push( new Centroid(dim, i));
  }

  console.log(centroids);

  // initialize items from data
  var items = data.map(function(values) { return new Item(values) });

  items[0].print();

  // Assign each data item to closest cluster
  //for (var i = 0; i < data.length; ++i) {
  //  var value = 0;
  //  for (var j = 0; j < amountValues; ++j) {
  //    value += Object.values(data[i])[j] - Object.values(centroids[j])
  //  }
  //}

  for (var it = 0; it < 1; ++it) {
    items.forEach(function(item) {
      item.updateClosestCentroid(centroids);
    });
  }

};

function Item(values) {
  var self = this;
  this.dimValues = values;
  this.closestCentroidIndex = -1;
  this.print = function() {
    console.log(this.dimValues);
  };
  this.updateClosestCentroid = function(centroids) {
    var euqDistances = centroids.map(function(centroid) {
      var diffs = [], sum = 0.0;

      for (var key in self.dimValues) {
        var itemValue = self.dimValues[key];
        var centroidValue = centroid.dimValues[key];
        diffs.push( Math.pow(itemValue - centroidValue, 2));
      }

      diffs.forEach(function(diff) {
        sum += diff;
      });

      return Math.sqrt(sum);
    });

    //console.log('euq distances:');
    //console.log(euqDistances);

    var currentVal = euqDistances[0];
    var nearestIdx = 0;
    for (var i in euqDistances) {
      if (euqDistances[i] < currentVal) {
        currentVal = euqDistances[i];
        nearestIdx = i;
      }
    }

    //console.log(nearestIdx);
    self.closestCentroidIndex = nearestIdx;
  };
}

function Centroid(initialValues, index) {
  var self = this;
  this.dimValues = initialValues;
  this.index = index;
  this.updateValues = '';
  this.print = function() {
    console.log(this.dimValues);
  };
}
