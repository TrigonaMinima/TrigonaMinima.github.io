// Post dates are emitted by Jekyll at build time (see index.html) so this
// list, and the year range below, always match the actual published posts —
// no manual bookkeeping when a post goes out or a new year starts.
var postDates = JSON.parse(document.getElementById("heatmap-post-dates").textContent);

var counts = {};
postDates.forEach(function (ym) {
    counts[ym] = (counts[ym] || 0) + 1;
});

var yearNums = Object.keys(counts).map(function (ym) { return parseInt(ym.slice(0, 4), 10); });
var minYear = Math.min.apply(null, yearNums);
var maxYear = Math.max.apply(null, yearNums);
var years = [];
for (var y = maxYear; y >= minYear; y--) {
    years.push(String(y));
}
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var width = 650;
var margin = ({ top: 50, right: 50, bottom: 50, left: 50 });
var w = width - margin.left - margin.right;
var xGridSize = Math.floor(w / (1.11 * months.length))
var yGridSize = Math.floor(w / (2.5 * months.length));
var h = yGridSize * years.length + margin.top + margin.bottom;

var data = Object.keys(counts).map(function (ym) {
    return {
        "year": years.indexOf(ym.slice(0, 4)),
        "month": parseInt(ym.slice(5, 7), 10) - 1,
        "value": counts[ym],
    };
});

var dataMax = d3.max(data, d => d.value);

var svg = d3.select(".heatmap")
    .append("svg")
    .classed("d3-svg-container", true)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + w + " " + h)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.selectAll(".year")
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
    .attr("font-size", "10pt");

svg.selectAll(".month")
    .data(months)
    .enter().append("text")
    .text(d => d)
    .classed("month", true)
    .attr("x", (d, i) => i * xGridSize)
    .attr("y", h - margin.bottom - margin.top / 2)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + xGridSize / 2 + ", -6)")
    .attr("font-size", "10pt");

svg.selectAll(".rectangle")
    .data(data)
    .enter().append("rect")
    .attr("x", d => d.month * xGridSize)
    .attr("y", d => d.year * yGridSize)
    .attr("width", xGridSize)
    .attr("height", yGridSize)
    .attr("rx", 1)
    .attr("ry", 1)
    .attr("stroke-width", "2px")
    .classed("rectangle", true)
    .append("title")
    .text(d => (d.value == 1) ? "1 post" : d.value + " posts");

function draw() {
    var styles = getComputedStyle(document.documentElement);
    var brandColor = styles.getPropertyValue('--brand-color').trim();
    var bgColor = styles.getPropertyValue('--background-color').trim();
    var labelColor = styles.getPropertyValue('--grey-color').trim();

    var dimColor = d3.color(brandColor);
    dimColor.opacity = 0.2;

    var color = d3.scaleSequential()
        .domain([0.5, dataMax])
        .interpolator(d3.interpolateRgb(String(dimColor), brandColor));

    svg.selectAll(".year").attr("fill", labelColor);
    svg.selectAll(".month").attr("fill", labelColor);
    svg.selectAll(".rectangle")
        .attr("fill", d => color(d.value))
        .attr("stroke", bgColor);
}

draw();
window.addEventListener('themechange', draw);
