/**
 * k means algorithm
 * @param data
 * @param k
 * @return {Object}
 */

function kmeans(data, k) {

  // The keys of a data item
  var dataKeys = Object.keys(data[0]);

  var centroids = [];

  // Randomly set values within range and determine initial centroids
  for (var i = 0; i < k; ++i) {
    const dataItem = data[Math.floor(Math.random() * data.length)];
    const dim = dataItem.geometry.coordinates
    for (var j in dim) {
      const parsedVal = parseFloat(dim[j])
      dim[j] = parsedVal
    }
    centroids.push( new Centroid(dim, i));
  }

  // initialize items from data
  const items = data.map(d => {
    //const values = d.geometry.coordinates
    return new Item(d)
  })

  var qualityMeasure = 99999999999999;

  // Main loop
  var iterations = 0;
  while(true) {
    var prevQualityMeasure = qualityMeasure;
    for (var item of items) {
      item.updateClosestCentroid(centroids);
    };
    qualityMeasure = 0.0;
    for (var centroid of centroids) {
      centroid.updateValues(items);
      qualityMeasure += centroid.sumOfConnectedItemDistances;
    };

    //console.log('current: ' + qualityMeasure + ', prev: ' + prevQualityMeasure);
    //console.log(qualityMeasure < prevQualityMeasure);
    if (qualityMeasure > prevQualityMeasure && iterations > 2) break;

    iterations++;

    // Max value base case
    if (iterations > 7) break;
  }

  var newData = [];
  for (let item of items) {
    var values = {};
    for (let key in item.dimValues) {
      values[key] = item.dimValues[key];
    }
    values.colorIndex = item.colorIndex;
    values.id = item.id;
    newData.push(values);
  }

  console.log('Centroid iterations: ' + iterations);
  return newData;
};

function Item(d) {
  var self = this;
  this.id = d.id;

  const values = d.geometry.coordinates
  for (var i in values) {
    const parsedVal = parseFloat(values[i])
    values[i] = parsedVal
  }

  this.dimValues = values;
  this.nearestCentroidIndex = -1;
  this.distToNearestCentroid = 0.0;
  this.colorIndex = 0;
  this.print = function() {
    console.log(this.dimValues);
  };
  this.updateClosestCentroid = function(centroids) {
    var euqDistances = centroids.map(function(centroid) {
      var diffs = [], sum = 0.0;

      for (var key in self.dimValues) {
        var itemValue = self.dimValues[key];
        var centroidValue = centroid.dimValues[key];
        diffs.push( Math.pow(itemValue - centroidValue, 2) );
      }

      diffs.forEach(function(diff) {
        sum += diff;
      });

      self.distToNearestCentroid = sum;

      return Math.sqrt(sum);
    });

    var currentVal = euqDistances[0];
    var nearestIdx = 0;
    for (var i in euqDistances) {
      if (euqDistances[i] < currentVal) {
        currentVal = euqDistances[i];
        nearestIdx = i;
      }
    }

    self.nearestCentroidIndex = parseFloat(nearestIdx);
    self.colorIndex = parseFloat(nearestIdx)+1;
  };
}

function Centroid(initialValues, index) {
  var self = this;
  this.dimValues = initialValues;
  this.index = parseFloat(index);
  this.sumOfConnectedItemDistances = 0.0;
  this.print = function() {
    console.log(this.dimValues);
  };
  this.updateValues = function(items) {
    var itemsWithThisCentroid = items.filter(function(item) {
      return item.nearestCentroidIndex === self.index
    });

    if (itemsWithThisCentroid.length > 0) {

      // Compute new average dim values for this centroid
      var initialObject = {};
      for (var key in items[0].dimValues) {
        initialObject[key] = 0;
      }

      self.sumOfConnectedItemDistances = 0.0; // Reset distances
      var clusterDimValues = itemsWithThisCentroid.map(function(item) {

        // Update distances of all clustered items while at it
        self.sumOfConnectedItemDistances += item.distToNearestCentroid;
        return item.dimValues
      });

      var dataKeys = Object.keys(clusterDimValues[0]);
      var newValues = {};

      for (var i in dataKeys) {
        newValues[dataKeys[i]] = 0;
      }

      var itemValues = [];
      for (var j in dataKeys) {
        itemValues.push(0);
      }

      for (var i in clusterDimValues) {
        for (var j in dataKeys) {
          itemValues[j] += parseFloat(Object.values(clusterDimValues[i])[j]);
        }
      }

      for (var i in itemValues) {
        itemValues[i] = itemValues[i]/itemsWithThisCentroid.length;
      }

      for (var i in dataKeys) {
        newValues[dataKeys[i]] = itemValues[i];
      }

      self.dimValues = newValues;
    }
  };
}
