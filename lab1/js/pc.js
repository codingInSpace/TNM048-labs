function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];

    var selectedCountry = {};
    
    //initialize color scale
    var c20c = d3.scale.category20c();

    //initialize a color country object
    var cc = {};

    //initialize tooltip
    //...

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};
        

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        if (error) console.log(error);

        //console.log(data)
        self.data = data;

        data.forEach(function(d) {
            cc[d.Country] = c20c(d.Country);
        })

        // Extract the list of dimensions and create a scale for each.
        //...
        x.domain(dimensions = d3.keys(data[0]).filter(function(i) {
            if (i !== "Country")
                return [(y[i] = d3.scale.linear()
                    .domain(d3.extent(data, function(d) { return +d[i]; }))
                    .range([height, 0]))];
        }));

        draw();
    });

    function draw(){
        // Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            //add the data and append the path
            .data(self.data)
            .enter().append("path")
            .attr("d", path)
            .on("mousemove", function(d){})
            .on("mouseout", function(){});

        // Add blue foreground lines for focus.
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            //add the data and append the path
            .data(self.data)
            .enter().append("path")
            .attr("d", path)
            .attr("style", function(d) {
                return "stroke: " + cc[d.Country];
            })
            .on("mousemove", function(){})
            .on("mouseout", function(){});

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
            
        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            //add scale
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });

        sp1.filterDots({actives: actives, extents: extents});
    }

    /**
     * Public method for selecting the polyline for a country in the data range
     * @param {string} value - The name of the country selected
     */
    this.selectLine = function(value){
        selFeature(value);
    };

    /**
     * Method for selecting the polyline for a country in the data range
     * @param {string} value - The name of the country selected
     */
    function selFeature(value){

        // Reset if same selection
        if (value === selectedCountry) {
            selectedCountry = "";

            foreground
                .style("display", null)
            return;
        }

        selectedCountry = value;

        foreground
            .style("display", function(d) { return d["Country"] === value ? null : "none"})
    };

}
