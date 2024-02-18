
// Set up the data for the nodes and links
var nodes = [
    { name: "Node 1" },
    { name: "Node 2" },
    { name: "Node 3" },
    { name: "Node 4" }
];

var links = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 1, target: 3 },
    { source: 2, target: 3 }
];

// Set up the D3.js force layout
var width = window.innerWidth;
var height = window.innerHeight;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(100))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", tick);

// Add the links
var link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link");

// Add the nodes
var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .style("stroke", "black")
    .style("fill", "white")
    .style("border", "1px solid black")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

// Add the labels
var label = svg.selectAll(".label")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .text(function (d) { return d.name; });

// Define the tick function
function tick() {
    link.attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

    node.attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });

    label.attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y + 5; });
}

// Define the drag functions
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
