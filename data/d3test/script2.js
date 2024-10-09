// Set up the D3.js force layout
var width = window.innerWidth;
var height = window.innerHeight;

var child_nodes = [

];

// var data = {
// }

const HTML_TEMPLATES = {
    'test': `
        <h1>Test</h1>
        <h3>Testing Template</h3>
        <p>Testing the template</p>
    `,
    'formatA': `
        <div class="card">
            <div class="card-body">
                ?content?
            </div>
        </div>
    `,
    'input': `
        <div class="card">
            <div class="card-body">
                <input type="text" class="form-control" placeholder="Enter text">
            </div>
        </div>
    `,
}

// set the content width to fit the #content div
var width = document.getElementById("content").offsetWidth;
var height = document.getElementById("content").offsetHeight;

// Create a zoom behavior
const zoom = d3.zoom()
    .extent([[0, 0], [width / 2, height / 2]]) // set the zoom extent to the size of the container
    .scaleExtent([.1, 10]) // set the minimum and maximum zoom level
    .on("zoom", zoomed); // attach a zoom event listener

var content = d3.select("#content").append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(zoom)
    .call(d3.drag().on("drag", function (event) {
        console.log(123);
        // get the current viewBox attributes
        const viewBox = content.attr("viewBox").split(" ");

        // calculate the new viewBox coordinates based on the drag event
        const newX = +viewBox[0] - event.dx;
        const newY = +viewBox[1] - event.dy;

        // update the viewBox attribute with the new coordinates
        content.attr("viewBox", `${newX} ${newY} ${viewBox[2]} ${viewBox[3]}`);
    }))


content.attr("width", width);
content.attr("height", height);

function zoomed(event) {
    content.attr("transform", event.transform);
}


var root = null;
var nodes = null;
var links = null;
var selectedNode = null;

function ticked() {
    const _link = d3.selectAll('.linkroot').selectAll('.link');
    link._groups = [Array.from(_link._groups[0])]
    const _node = d3.selectAll('.noderootmain').selectAll('.noderoot');
    _node._groups = [Array.from(_node._groups[0])]

    if (!_node.node() || !_node.node().getBBox) return;

    _node_bbox = _node.node().getBBox();

    _link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    _node.selectAll('rect')
        .attr("x", d => d.x - _node_bbox.width / 2)
        .attr("y", d => d.y - _node_bbox.height / 2)
        .style("fill", d => getNodeFillColor(d));

    _node.selectAll('circle')
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .style("fill", d => getNodeFillColor(d));

    _node.selectAll('text')
        .attr("x", d => d.x)
        .attr("y", d => d.y);

    _node.selectAll('foreignObject')
        .attr("x", d => d.x - _node_bbox.width / 2)
        .attr("y", d => d.y - _node_bbox.height / 2);
}

// Define the zoomed function to update the transform attribute of the container element
function zoomed(event) {
    if (event.sourceEvent && ["mousemove"].includes(event.sourceEvent.type)) {
        return;
    }
    const { x, y, k } = event.transform;
    const newViewBox = [
        -width / 2 / k + -x,
        -height / 2 / k + -y,
        width / k,
        height / k
    ];
    content.attr("viewBox", newViewBox);
}


function newId() {
    return Math.random().toString(36).substr(2, 9);
}

var t = 3;
function addNode(newNodeData, parentNode = null) {

    let newLinks, newNodes;

    let newRoot = null;
    if (!root && !nodes && !links) {
        root = d3.hierarchy(newNodeData);
        links = root.links();
        nodes = root.descendants();

        newRoot = root;
        newLinks = links;
        newNodes = nodes;

    } else {
        newRoot = d3.hierarchy(newNodeData);
        newLinks = newRoot.links();
        newNodes = newRoot.descendants();
    }

    // If parentNodeData is provided, add the new node as a child of the parent
    if (parentNode) {
        parentNode.children = (parentNode.children || []).concat(newRoot);
        newRoot.parent = parentNode;

        let newLink = {
            id: newId(),
            source: parentNode,
            target: newRoot
        };
        links.push(newLink);


        // Add new nodes to the nodes array
        newNodes.forEach(node => {
            node.id = newId();
            nodes.push(node);
        });

        // Add new links to the links array
        newLinks.forEach(link => {
            link.id = newId();
            links.push(link);
        });
    }


    // Update the simulation with the new nodes and links
    simulation.nodes(nodes);
    simulation.force("link").links(links);

    // Restart the simulation
    simulation.alpha(1).restart();

    // Update the links
    link = link.data(links, d => d.id);
    link.exit().remove();

    link = link.enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", 4)
        .merge(link);

    // Update the nodes
    nodeGroup = node.data(nodes, d => d.id);
    nodeGroup.exit().remove();

    const newNodeGroup = nodeGroup.enter().append("g")
        .attr("class", "noderoot")
        .on("mousedown", mousedown)
        .call(drag(simulation))
        .merge(node)
        .on("click", function (event, d) {
            console.log(d);
            // fetch(`https://api.rau.lol/words?word=${d.data.name}&c=1`)
            //     .then(response => response.json())
            //     .then(data => {;
            //         let word = data.result.relations[Math.floor(Math.random() * data.result.relations.length)];
            //         const newNodeData = {
            //             name: word,
            //             html: word,
            //         }

            //         addNode(newNodeData, d);
                    
            //     });
        });

    newNodeGroup.append("rect")
        .attr("class", "node")
        .attr("fill", d => getNodeFillColor(d))
        .attr("stroke", d => '#000')
        .attr("x", width)
        .attr("y", height)
        .attr("width", 50)
        .attr("height", 50);

    newNodeGroup.append("title")
        .text(d => d.data.name);

    nodeGroup = newNodeGroup.merge(nodeGroup);


    // node.append("circle")
    //     .attr("class", "node")
    //     .attr("fill", d => getNodeFillColor(d))
    //     .attr("stroke", d => '#000')
    //     .attr("r", 25)

    // node.append("text")
    //     .attr("dx", 12)
    //     .attr("dy", ".35em")
    //     .attr("text-anchor", "middle")
    //     .attr("dominant-baseline", "central")
    //     .attr("font-size", "1.5em")
    //     .text(d => d.data.name);

    // if(newNodeData.html) {
    //     if (newNodeData.html) {

    //         const _node = node.filter(d => d.data.name == newNodeData.name);
    //         if (newNodeData.html in HTML_TEMPLATES) {
    //             if (newNodeData.html == "input") {
    //                 addInput(_node);
    //             }
    //             else {
    //                 addHTML(_node, HTML_TEMPLATES[newNodeData.html]);
    //             }
    //         }
    //         else {
    //             addHTML(_node, newNodeData.html);
    //         }
    //     }
    // }

    // Add HTML for any nodes that have it
    newNodeGroup.filter(d => d.data.html).each(function (d) {
        if (d.data.html in HTML_TEMPLATES) {
            if (d.data.html == "input") {
                addInput(d3.select(this));
            }
            else {
                addHTML(d3.select(this), HTML_TEMPLATES[d.data.html]);
            }
        }
        else {
            addHTML(d3.select(this), d.data.html);
        }
    });

}

function getNodeFillColor(node) {

    if (node === selectedNode) {
        return '#ff0000'
    }

    r = 255 - (node.depth * 33);
    g = 255 - (node.depth * 33);
    b = 255 - (node.depth * 33);

    return `rgb(${r}, ${g}, ${b})`;


}


function test() {
    addNode(newNodeData)
}

function testt() {
    addNode(newNodeData2)
}

function addHTML(node, html) {
    const bbox = node.node().getBBox();
    const nodeHTML = node.append("foreignObject")
        .style("pointer-events", "none")
        .attr("width", bbox.width)
        .attr("height", bbox.height)
        .append("xhtml:div")
        .style("font", "10px 'Calibri'")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("height", "100%")
        .html(html)

    return nodeHTML;
}

function addInput(node) {
    const bbox = node.node().getBBox();
    const w = bbox.width;
    const h = bbox.height;
    const x = bbox.x;
    const y = bbox.y;

    const input = node.append("foreignObject")
        .style("pointer-events", "none")
        .attr("x", x)
        .attr("y", y)
        .attr("width", w)
        .attr("height", h)
        // .attr("width", "100%")
        // .attr("height", "100%")

    const form = input.append("xhtml:form")
        .style("font", "10px 'Calibri'")

    const textarea = form.append("xhtml:textarea")
        .attr("value", "test")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("font", "10px 'Calibri'")
        .style("resize", "none")
        .on("keydown", function (e) {
            if (e.key == "Enter" && e.shiftKey) {
                e.preventDefault();

                const value = form.select("textarea").node().value;

                fetch("https://api.robsweb.site/chat/prompt?key=public-user&text=" + value)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);

                        const new_node = {
                            'name': `node${++t}`,
                            'html': `Output: ${data.result}`
                        };

                        // change the value of the source node's html
                        node.datum().data.html = `Input: ${value}`;

                        addNode(new_node, node.datum());
                    })
                    .catch(error => {
                        console.log(error);
                        rootNode();
                    })
                    .finally(() => {
                    });
            }
            else {
                const newHeight = this.scrollHeight;
                if (newHeight > h) {
                    textarea.style("height", newHeight + "px");
                }
            }
        })

    d3.selectAll("foreignObject textarea")
        .style("pointer-events", "auto")
        .style("width", "100%")
    

    return input;
}

function rootNode() {
    addNode({
        'name': new Date().toLocaleString(),
        'html': 'input',
        'children': [
            {
                'name': 'info',
                'html': `Type in the box and press shift+enter to submit.`
            }
        ]
    });
}

const mousedown = (event, d) => {
    // Select nodes when the ctrl key is pressed
    // console.log(d)
    if (event.ctrlKey) {
        if (selectedNode === d)
            selectedNode = null;
        else
            selectedNode = d;
        return;
    }
};

const drag = simulation => {
    const dragstarted = (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    };

    const dragged = (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
    };

    const dragended = (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    };

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
};


const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(150).strength(1))
    .force("charge", d3.forceManyBody().distanceMax(50).strength(-450))

link = content.append("g")
    .attr("class", "linkroot")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")

node = content.append("g")
    .attr("class", "noderootmain")
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .selectAll("circle")


simulation.on("tick", ticked);

let base_concepts = [
    "Ocean",
    "Adventure",
    "Technology",
    "Harmony",
    "Creativity",
    "Exploration",
    "Transformation",
    "Connection",
    "Discovery",
    "Imagination",
    "Serenity",
    "Diversity",
    "Innovation",
    "Growth",
    "Inspiration"
];

const newNodeData2 = {
    'name': 'Words',
    'children': []
};

for(let i = 0; i < base_concepts.length; i++) {
    newNodeData2['children'].push({
        'name': base_concepts[i],
        'html': base_concepts[i],
        'children': []
    });
}

addNode(newNodeData2);

document.querySelectorAll('g')
.forEach(node => {
    if('__on' in node) {
        console.log(node.__on[2].value(null, node.__data__))
    }
});