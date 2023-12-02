3
function run(paths) {

    var width = window.innerWidth, height = window.innerHeight;

    var projection = d3.geoOrthographic()
        .translate([width / 2, height / 2])
        .scale((width < height ? width : height) / 2 - 20)
        // .rotate([-10, -10]) // rotate the globe to focus on the node at [10,10]
        .rotate([0.4, 1])
        .clipAngle(90)
        .precision(.1);

    var path = d3.geoPath()
        .projection(projection);

    var graticule = d3.geoGraticule();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)

    svg.append("defs").append("path")
        .datum({ type: "Sphere" })
        .attr("id", "sphere")
        .attr("d", path);

    svg.append("use")
        .attr("class", "glow")
        .attr("xlink:href", "#sphere");

    svg.append("filter")
        .attr("id", "glow")
        .append("feGaussianBlur")
        .attr("stdDeviation", "2.5")
        .attr("result", "coloredBlur");

    svg.selectAll(".glow")
        .style("filter", "url(#glow)");

    svg.append("use")
        .attr("class", "stroke")
        .attr("xlink:href", "#sphere");

    svg.append("use")
        .attr("class", "fill")
        .attr("xlink:href", "#sphere");

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("use")
        .attr("xlink:href", "#sphere");

    var links = {};
    paths.forEach(path => {
        links[path] = {
            "link": '/' + path,
            "point": {
                "lon": Math.random() * 360 - 180,
                "lat": Math.random() * 180 - 90
            }
        };
    });


    var titles = Object.keys(links);
    var points = Object.values(links).map(function (d) { return d.point; });
    let drag_div = 5;

    var texts = svg.selectAll(".dot-text")
        .data(points)
        .enter()
        .append("text")
        .attr("class", "dot-text")
        .attr("fill", "red")
        .attr("font-size", "5vw")
        .html((d, i) => `<a href="${links[titles[i]].link}">${titles[i]}</a>`)
        // shift text half of the font size to the left
        .attr("dx", function (d) { return -this.getBBox().width / 2; })

    var drag = d3.drag()
        .on("start", function (event) {
            var proj = projection.rotate();
            var startPoint = {
                x: proj[0] - event.x / drag_div,
                y: proj[1] + event.y / drag_div
            }
            event.on("drag", function (event) {
                projection.rotate([startPoint.x + event.x / drag_div, startPoint.y - event.y / drag_div]);
                svg.selectAll("path").attr("d", path);
                svg.selectAll(".dot-text")
                    .attr("x", function (d) { return projection([d.lon, d.lat])[0]; })
                    .attr("y", function (d) { return projection([d.lon, d.lat])[1]; });

                update();
            });
        });
    svg.call(drag);

    var onresize = function () {
        width = window.innerWidth, height = window.innerHeight;
        svg.attr("width", width).attr("height", height);
        projection.translate([width / 2, height / 2]).scale((width < height ? width : height) / 2 - 20);
        svg.selectAll("path").attr("d", path);
        svg.selectAll(".dot-text")
            .attr("x", function (d) { return projection([d.lon, d.lat])[0]; })
            .attr("y", function (d) { return projection([d.lon, d.lat])[1]; });
        update();
    }

    function update() {
        texts.each(function (d) {
            var c = projection([d.lon, d.lat]);
            d3.select(this)
                .attr("x", c[0])
                .attr("y", c[1]);

            // hide if the point is on the back of the globe
            // first find the latitude at the center of the screen
            // if the point is more than 90 degrees away from the center latitude
            // then it is on the back side of the globe
            let center = projection.invert([width / 2, height / 2]);
            let pointVisible = d3.geoDistance([d.lon, d.lat], center) <= Math.PI / 2;

            d3.select(this).style("display", (pointVisible) ? "block" : "none");
            if (!pointVisible) {
            }
            else {
            }

        });
    }

    update();
    d3.select(window).on("resize", onresize);

}


window.addEventListener('load', function () {
    fetch('/dump/topics.json')
        .then(res => res.json())
        .then(d => {
            // choose 10 random topics to run
            let topics = [];
            for (let i = 0; i < 10; i++) {
                topics.push(d[Math.floor(Math.random() * d.length)]);
            }
            fetch(`/api/llm/test?prompt=${topics}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.result);
            });
            run(topics);
        })
});