function map(){

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

    // Initialize countries
    var country;

    var selectedCountry = "";

    //initialize color scale
    var c20c = d3.scale.category20c();

    //initialize a color country object
    var cc = {};

    //initialize tooltip
    //...

    var projection = d3.geo.mercator()
        .center([50, 60 ])
        .scale(250);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var path = d3.geo.path()
        .projection(projection);

    g = svg.append("g");

    // load data and draw the map
    d3.json("data/world-topo.topojson", function(error, world) {
        
        var countries = topojson.feature(world, world.objects.countries).features;

        //load summary data
        d3.csv("data/OECD-better-life-index-hi.csv", function(err, data) {
            if (err) console.log(err);
            draw(countries, data);
        });
    });

    function draw(countries,data)
    {

        data.forEach(function (d) {
            cc[d["Country"]] = c20c(d["Country"]);
        })

        country = g.selectAll(".country").data(countries);

        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            //country color
            .style("fill", function(d) {
                return cc[d.properties.name];
            })
            //tooltip
            .on("mousemove", function(d) {
                //...
            })
            .on("mouseout",  function(d) {
                //...
            })
            //selection
            .on("click",  function(d) {
                selFeature(d.properties.name);
                pc1.selectLine(d.properties.name);
                sp1.selectDot(d.properties.name);
            });

    }
    
    //zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    /**
     * Public method for selecting a country in the data
     * @param {string} value - The name of the country selected
     */
    this.selectCountry = function(value) {
        selFeature(value);
    }

    /**
     * Method for selecting a country in the data
     * @param {string} value - The name of the country selected
     */
    function selFeature(value){

        // Reset if same selection
        if (value === selectedCountry) {
            selectedCountry = "";

            country
                .style("fill", function(d) {
                    return cc[d.properties.name];
                })
            return;
        }

        selectedCountry = value;

        country
            .style("fill", function(d) {
                return d.properties.name === value ? cc[d.properties.name] : "#d5d5d5";
            })
    }
}

