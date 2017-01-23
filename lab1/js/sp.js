function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 75, left: 60},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...
    
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

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(data) {
      //if (error) console.log(error);

      return {
          country: data.Country,
          householdIncome: +data["Household income"]
      };
    }, function(data) {
        self.data = data;
        
        //define the domain of the scatter plot axes
        //var yMax = d3.max(data, function(d) {
        //  return d[0];
        //})
        //var xMax = d3.max(data, function(d) {
        //  return d[1];
        //})
        //y.domain([0, yMax]);
        //x.domain([0, xMax]);

        x.domain(data.map(function(d) { return d.country; }));
        y.domain([
            d3.min(data, function(d) { return d.householdIncome; }),
            d3.max(data, function(d) { return d.householdIncome; })
        ]);

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
            .attr("cx", function(d) {
              return x(d.country);
            })
            .attr("cy", function(d) {
              return y(d.householdIncome);
            })
            .attr("r", 3)
            //Define the x and y coordinate data values for the dots
            //...
            //tooltip
            .on("mousemove", function(d) {
                //...    
            })
            .on("mouseout", function(d) {
                //...   
            })
            .on("click",  function(d) {
                //...    
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        //...
    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}




