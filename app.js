
function makeResponsive() {
  // Step 1: Set up our chart
  //= ================================
  var svgWidth = 1000;
  var svgHeight = 600;

  var margin = {
    top: 50,
    right: 40,
    bottom: 60,
    left: 50
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Step 2: Create an SVG wrapper,
  // append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  // =================================
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Step 3:
  // Import data from the donuts.csv file
  // =================================
  d3.csv("data.csv").then(function(smokerData) {
  // Step 4: Parse the data
  // Format the data and convert to numerical and date values

  // Format the data
    smokerData.forEach(function(data) {
      data.abbr === data.abbr;
      data.age= +data.age;
      data.smokes = +data.smokes;
    });


    var abbr = smokerData.abbr
    // Step 5: Create Scales
    //= ============================================
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(smokerData, d => d.age))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(smokerData, d => d.smokes)])
      .range([height, 0]);

  // create axes
    var xAxis = d3.axisBottom(xLinearScale).ticks(6);
    var yAxis = d3.axisLeft(yLinearScale).ticks(6);
      
  // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
   
    chartGroup.append("g")
       .call(yAxis);
   
     // append circles
       var circlesGroup = chartGroup.selectAll("circle")
         .data(smokerData)
         .enter()
         .append("circle")
         .attr("cx", d => xLinearScale(d.age))
         .attr("cy", d => yLinearScale(d.smokes))
         .attr("r", "15")
         .attr("fill", "gray")
         .attr("stroke-width", "1")
         .attr("opacity", ".5"); 

       var circlesText = chartGroup.selectAll("states")
        .data(smokerData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.age)- 10)
        .attr("y", d => yLinearScale(d.smokes) + 5)
        .text((d)=> d.abbr);
 

         chartGroup.append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 0 - margin.left)
         .attr("x", 0 - (height / 2))
         .attr("dy", "1em")
         .classed("axis-text", true)
         .text("% Smokers");

         chartGroup.append("text")
         .attr("x", (width / 2))
         .attr("y", height + 40)
         .attr("dx", "1em")
         .classed("axis-text", true)
         .text("Avg Smoker Age");
      

     //  Initialize Tooltip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([10, 10])
        .html(function(d) {
        return (`<strong>${d.abbr}<br>${d.smokes} % smokers<br>${d.age} avg age`);
  });

// Step 2: Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

// Step 3: Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
  toolTip.show(d, this);
  })
// Step 4: Create "mouseout" event listener to hide tooltip
  .on("mouseout", function(d) {
    toolTip.hide(d);
  });
  }).catch(function(error) {
  console.log(error);
});
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);