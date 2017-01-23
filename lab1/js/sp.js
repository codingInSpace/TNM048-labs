function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 75, left: 60},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    var selectedValue = {};

    //initialize color scale
    var c20c = d3.scale.category20c();

    //initialize a color country object
    var cc = {};

    //initialize tooltip
    //...

//    var x = d3.scale.linear()
 //       .range([0, width]);
    var x = d3.scale.ordinal()
           .rangeRoundBands([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(data) {
        //if (error) console.log(error);
        self.data = data;

        x.domain(data.map(function(d) { return d.Country; }));
        y.domain([
            d3.min(data, function(d) { return d["Household income"]; }),
            d3.max(data, function(d) { return d["Household income"]; })
        ]);

        data.forEach(function(d) {
            cc[d["Country"]] = c20c(d["Country"]);
        })
        draw();

    });

    function draw()
    {
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".1em")
                .attr("transform", function(d) {
                    return "rotate(-43)"
                });

        // X Title
        svg.append("text")
            .attr("transform",
                "translate(" + (width/2) + " ," +
                (height + margin.top + 50) + ")")
            .style("text-anchor", "middle")
            .text("Country");

        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em");

        // Y Title
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Household Income");

        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            .style("fill", function(d) {
                return cc[d.Country];
            })
            .attr("cx", function(d) {
              return x(d.Country);
            })
            .attr("cy", function(d) {
              return y(d["Household income"]);
            })
            .attr("r", 4)
            //Define the x and y coordinate data values for the dots
            //...
            //tooltip
            .on("mousemove", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 35) + "px");
                tooltip.html(d.Country);

                highlight(d, true);
            })
            .on("mouseout", function(d) {
                highlight(d, false);
            })
            .on("click",  function(d) {
                selFeature(d)
                pc1.selectLine(d)
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        svg.selectAll('.dot')
            .style('display', function(d) {
                return value.actives.every(function(p, i) {
                    return value.extents[i][0] <= d[p] && d[p] <= value.extents[i][1];
                }) ? null : "none";
            });
    };
    
    //method for selecting features of other components
    function selFeature(value){
        if (value === selectedValue) {
            selectedValue = {};
            svg.selectAll('.dot')
                .attr("opacity", 1)
            return
        }

        selectedValue = value;

        // Lower opacity for selected dots
        svg.selectAll('.dot')
            .attr("opacity", function(d) { return d.Country === value.Country ? 1 : 0.3 });
    }

    /**
     * Method for highlighting dot
     * @param {object} value - Object that was selected
     * @param {boolean} status - Whether highlight active or not
     */
    function highlight(value, status){
        if (status === true) {
            svg.selectAll('.dot')
                .style("fill", function(d) { return d.Country === value.Country ? "white" : cc[d.Country] })
                .attr("r", function(d) { return d.Country === value.Country ? 5 : 4 });
        } else {
            svg.selectAll('.dot')
                .style("fill", function(d) { return cc[d.Country]; })
                .attr("r", 4 );
        }
    }
}




