var years = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"].reverse();
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var width = 650;
var margin = ({ top: 50, right: 50, bottom: 50, left: 50 });
var w = width - margin.left - margin.right;
var xGridSize = Math.floor(w / (1.11 * months.length))
var yGridSize = Math.floor(w / (2.5 * months.length));
var h = yGridSize * years.length + margin.top + margin.bottom;

var data = [
    { "year": years.length - 0 - 1, "month": 3, "value": 1 },
    { "year": years.length - 0 - 1, "month": 4, "value": 4 },
    { "year": years.length - 0 - 1, "month": 5, "value": 2 },
    { "year": years.length - 0 - 1, "month": 6, "value": 1 },
    { "year": years.length - 0 - 1, "month": 8, "value": 1 },
    { "year": years.length - 0 - 1, "month": 10, "value": 2 },
    { "year": years.length - 1 - 1, "month": 6, "value": 1 },
    { "year": years.length - 1 - 1, "month": 11, "value": 1 },
    { "year": years.length - 2 - 1, "month": 1, "value": 1 },
    { "year": years.length - 2 - 1, "month": 2, "value": 1 },
    { "year": years.length - 2 - 1, "month": 5, "value": 1 },
    { "year": years.length - 2 - 1, "month": 9, "value": 1 },
    { "year": years.length - 2 - 1, "month": 10, "value": 1 },
    { "year": years.length - 3 - 1, "month": 6, "value": 1 },
    { "year": years.length - 4 - 1, "month": 0, "value": 1 },
    { "year": years.length - 4 - 1, "month": 3, "value": 1 },
    { "year": years.length - 4 - 1, "month": 5, "value": 2 },
    { "year": years.length - 4 - 1, "month": 8, "value": 1 },
    { "year": years.length - 4 - 1, "month": 9, "value": 1 },
    { "year": years.length - 5 - 1, "month": 0, "value": 1 },
    { "year": years.length - 5 - 1, "month": 2, "value": 1 },
    { "year": years.length - 5 - 1, "month": 8, "value": 1 },
    { "year": years.length - 5 - 1, "month": 10, "value": 1 },
    { "year": years.length - 5 - 1, "month": 11, "value": 1 },
    { "year": years.length - 6 - 1, "month": 0, "value": 2 },
    { "year": years.length - 6 - 1, "month": 1, "value": 1 },
    { "year": years.length - 6 - 1, "month": 2, "value": 2 },
    { "year": years.length - 6 - 1, "month": 4, "value": 1 },
    { "year": years.length - 6 - 1, "month": 5, "value": 3 },
    { "year": years.length - 6 - 1, "month": 7, "value": 1 },
    { "year": years.length - 6 - 1, "month": 9, "value": 2 },
    { "year": years.length - 6 - 1, "month": 10, "value": 1 },
    { "year": years.length - 7 - 1, "month": 1, "value": 1 },
    { "year": years.length - 7 - 1, "month": 6, "value": 1 },
    { "year": years.length - 7 - 1, "month": 7, "value": 2 },
    { "year": years.length - 7 - 1, "month": 9, "value": 1 },
];


// using <script src="https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.1.0/chroma.min.js">
// var colors = chroma.brewer.Blues.slice(0, -2);
//
// var color = d3.scaleQuantile()
//     .domain([d3.min(data, d => +d.value), d3.max(data, d => +d.value)])
//     .range(colors);
//
// https://github.com/d3/d3-scale-chromatic/blob/master/README.md
var color = d3.scaleSequential()
    .domain([0, d3.max(data, d => d.value)])
    .interpolator(d3.interpolateBlues);

var svg = d3.select(".heatmap")
    .append("svg")
    .classed("d3-svg-container", true)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + w + " " + h)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yearLabels = svg.selectAll(".year")
    .data(years)
    .enter()
    .append("svg:a").attr("xlink:href", function (d) { return "#" + d })
    .append("text")
    .text(d => d)
    .classed("year", true)
    .attr("x", -10)
    .attr("y", (d, i) => i * yGridSize)
    .attr("text-decoration", "underline")
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + yGridSize / 1.5 + ")")
    .attr("font-size", "10pt")
    .attr("fill", "#989898");

var monthLabels = svg.selectAll(".month")
    .data(months)
    .enter().append("text")
    .text(d => d)
    .classed("month", true)
    .attr("x", (d, i) => i * xGridSize)
    .attr("y", h - margin.bottom - margin.top / 2)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + xGridSize / 2 + ", -6)")
    .attr("font-size", "10pt")
    .attr("fill", "#989898");

var rectangles = svg.selectAll(".rectangle")
    .data(data)
    .enter().append("rect")
    .attr("x", d => d.month * xGridSize)
    .attr("y", d => d.year * yGridSize)
    .attr("width", xGridSize)
    .attr("height", yGridSize)
    .attr("fill", d => color(d.value))
    .attr("stroke", "#F7F7F7")
    .attr("stroke-width", "0.5px")
    .attr("rx", 4)
    .attr("ry", 4)
    .style("background-color", '#00000000')
    .append("title")
    .text(d => (d.value == 1) ? "1 post" : d.value + " posts");
