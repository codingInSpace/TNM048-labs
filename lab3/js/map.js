function map(data) {
    let points;
    let isClustered = false;

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));

    //Sets the colormap
    var colors = colorbrewer.Set3[10];

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([8.25, 56.8])
            .scale(700);

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};

    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    //Formats the data in a feature collection
    function geoFormat(array) {
        const data = []

        array.map(d => {
          const { lat, lon, id, time, mag } = d
          const feature = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat]
            },
            id,
            time,
            mag,
            filteredTime: false,
            filteredMag: false
          }
          data.push(feature)
        })

        return data;
    }

    //Draws the map and the points
    function draw(countries)
    {
        //draw map
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path)
                .style('stroke-width', 1)
                .style("fill", "lightgray")
                .style("stroke", "white");

        //draw point        
        points = g.selectAll("path")
          .data(geoData.features)
          .enter()
          .append("path")
          .classed("point", true)
          .attr("d", path);
    };

    //Filters data points according to the specified magnitude
    function filterMag(value) {
      svg.selectAll('.point')
        .style('display', d => {
          const mag = parseFloat(d.mag)
          const shouldShow = mag >= value
          d.filteredMag = shouldShow ? false : true
          return (!d.filteredTime && !d.filteredMag) ? null : 'none'
        })
    }
    
    //Filters data points according to the specified time window
    this.filterTime = function (value) {
      const t1 = value[0]
      const t2 = value[1]

      if (isClustered)
        clearColors()

      svg.selectAll('.point')
        .style('display', d => {
          const time = format.parse(d.time)
          const shouldShow = time > t1 && time <= t2
          d.filteredTime = shouldShow ? false : true
          return (!d.filteredTime && !d.filteredMag) ? null : 'none'
        })
    };

    function clearColors() {
      points.each(function(d) {
        d3.select(this).style("fill", null);
      })
    }

    //Calls k-means function and changes the color of the points  
    this.cluster = function () {
      const k = parseInt(document.getElementById('k').value)
      const filteredData = []
      const dataPoints = geoData.features

      for (var i in dataPoints) {
        if (!dataPoints[i].filteredMag && !dataPoints[i].filteredTime)
          filteredData.push(dataPoints[i])
      }

      const clusteredData = kmeans(filteredData, k)
      const colors = d3.scale.category20();

      // Update colors
      points.each(function(d) {
        for (var i in clusteredData) {
          if (d.id === clusteredData[i].id) {
            d3.select(this).style("fill", colors(clusteredData[i].colorIndex));
          }
        }
      })

      isClustered = true;
    }

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style('stroke-width', 1 / s).attr(`transform, translate(${t}) scale(${s})`);
    }

    //Prints features attributes
    function printInfo(value) {
        const elem = document.getElementById('info');
        const { place, depth, mag } = value
        elem.innerHTML = `Place: ${place} / Depth: ${depth} / Magnitude: ${mag} &nbsp;`;
    }

}
