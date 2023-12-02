// Set up the D3.js force layout
var width = window.innerWidth;
var height = window.innerHeight;

var list_nodes = [
    {
        'id': 'n1',
        'name': 'test1',
        'description': 'This is a test',
        'image': 'https://api.robsweb.site/image/test_image?as_image=true',
        'html': 'test'
    },
    {
        'id': 'n2',
        'name': 'actionTest',
        'buttons': [
            {
                'name': 'test',
                'description': 'This is a test',
                'actions': ['test', 'log']
            }
        ]
    },
    {
        'id': new_ID(),
        'name': 'testInput',
        'html': 'input'
    }
];


var list_links = [
    { 'source': 'n1', 'target': 'n2' },
    { 'source': 'n2', 'target': 'n1' },
]


var nodes = [];
var links = [];

// Loop through the list_nodes array and create nodes for each object
list_nodes.forEach(function (node) {
    nodes.push({
        id: node.id,
        name: node.name,
        description: node.description,
        image: node.image,
        html: node.html,
        buttons: node.buttons
    });
});

// Loop through the links array and create links for each object
list_links.forEach(function (link) {
    links.push({
        source: nodes.find(function (node) { return node.id === link.source; }),
        target: nodes.find(function (node) { return node.id === link.target; })
    });
});

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

// Select the list element
var list = d3.select("#list");
var content = d3.select("#content").append("svg");

// set the content width to fit the #content div
content.attr("width", document.getElementById("content").offsetWidth);
content.attr("height", document.getElementById("content").offsetHeight);

for (let i = 0; i < list_nodes.length; i++) {
    addItemToList(list_nodes[i]);
}

// var items = list.selectAll()
// .data([list_nodes[0]])
// .enter()
// .append("h3")
// .classed("list-group-item", true)
// .on("click", function(d, item) {
//     createItem(d, item);
// });
// items.text(function(d) { return d.name; });

function API_promptAI(action) {
    fetch("https://api.robsweb.site/chat/prompt?key=public-user&text=" + action)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const item = {
                'name': data.result,
                'description': data.result,
            }
            const node = createItem(data, item);
            addHTML(node, HTML_TEMPLATES['formatA'].replace('?content?', data.result));
            adjustRectText(node, node.select("rect").attr("x"), node.select("rect").attr("y"));
        });
}

function API_loadNote(note) {
    fetch("https://api.robsweb.site/notes/load?name=" + note)
        .then(response => response.json())
        .then(data => {
            if (data.result.length) {
                data = data.result[0];
                const item = {
                    'name': data.name,
                    'description': data.content,
                }

                const node = createItem(data, item);
                addHTML(node, HTML_TEMPLATES['formatA'].replace('?content?', data.content));
                adjustRectText(node, node.select("rect").attr("x"), node.select("rect").attr("y"));
            }
        });
}

function addItemToList(item) {
    // Bind the data to the list element
    const list_item = list.append("h3").data([item])
        .classed("list-group-item", true)
        .on("click", function (d, item) {
            createItem(d, item);
        });

    // // Add text to each list item
    list_item.text(function (d) { return d.name; });
}

function addInput(node, x, y, w, h) {
    const input = node.append("foreignObject")
        .style("pointer-events", "none")
        .attr("x", x)
        .attr("y", y)
        .attr("width", w)
        .attr("height", 10);

    const form = input.append("xhtml:form")
        .style("font", "10px 'Calibri'")
        .on("submit", function (e) {
            e.preventDefault();
            const value = input.select("input").node().value;
            // API_promptAI(value);
            API_loadNote(value);
            input.select("input").node().value = "";
        });

    form.append("xhtml:input")
        .attr("type", "text")
        .attr("value", "test")
        .attr("width", w)
        .attr("height", 10)
        .style("font", "10px 'Calibri'")
    return input;
}

function addText(node, text, x, y) {
    const nodeText = node.append("text")
        .attr("class", "label")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle") // center the text horizontally
        .attr("alignment-baseline", "middle") // center the text vertically
        .style("pointer-events", "none")
        .text(text);

    return nodeText;
}

function addButton(node, x, y, w, h, actions) {
    const button = node.append("g")
        .attr("class", "button")
        .attr("x", x)
        .attr("y", y)
        .attr("width", w)
        .attr("height", h)
        .style("fill", "red")
        .style("cursor", "pointer")
        .on("click", function (d, item) {
            console.log(d, item)
            // run the action
            if (actions && actions.length > 0) {
                for (let i = 0; i < actions.length; i++) {
                    let action = actions[i];
                    if (action == "log") {
                        console.log("Logging: " + action);
                    }
                    else if (action == "test") {
                        console.log("Testing: " + action);
                        loadItemAPI("test");
                    }
                }
            }
        });

    let button_rect = button.append("circle")
        // button_rect.attr("x", rectx + (rectw / 2))
        // button_rect.attr("y", recty + (recth / 2))
        // button_rect.attr("width", rectw/4)
        // button_rect.attr("height", recth/4)
        // button_rect.style("fill", "red")
        // button_rect.style("cursor", "pointer")
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', w / 8)
        .attr('stroke', 'black')
        .attr('fill', '#69a3b2')

    return button;
}

function addHTML(node, html) {
    const nodeHTML = node.append("foreignObject")
        .style("pointer-events", "none")
        .attr("width", node.attr("width"))
        .attr("height", node.attr("height"))
        .append("xhtml:div")
        .style("font", "10px 'Calibri'")
        .html(html)

    return nodeHTML;
}

function new_ID() {
    return "n" + Math.random().toString(36).substr(2, 9);
}

function createItem(d, item) {
    // create a new node with the item data and add it to the content

    let node = content.append('g')
        .attr("class", "node-item")
        .attr("class", "root")
        .style("cursor", "move")

    if (item.id) {
        node.attr("id", item.id);
    }

    const rectw = 100;
    const recth = 100;
    const rectx = (content.attr("width") / 2) - (rectw / 2);
    const recty = (content.attr("height") / 2) - (recth / 2);
    let rect = node.append("rect")
        .attr("x", rectx)
        .attr("y", recty)
        .attr("width", rectw)
        .attr("height", recth)
        .style("stroke", "black")
        .style("fill", "white")
        .style("border", "1px solid black")

    if (item.html) {
        if (item.html in HTML_TEMPLATES) {
            if (item.html == "input") {
                addInput(node, rectx, recty, rectw, recth);
            }
            else {
                addHTML(node, HTML_TEMPLATES[item.html]);
            }
        }
        else {
            addHTML(node, item.html);
        }
    }

    if (item.buttons && item.buttons.length > 0) {
        console.log(item.buttons)
        // add buttons
        for (let i = 0; i < item.buttons.length; i++) {
            console.log(item.buttons[i])
            let button = item.buttons[i];
            addButton(node, rectx + (rectw / 2), recty + (recth / 2), rectw, recth, button.actions);
        }
    }


    rect.on("mousedown", mousedown);
    rect.datum(item)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

    // const text = addText(node, item.name, rectx + rectw / 2, recty + recth / 4);
    // const description = addText(node, item.description, rectx + rectw / 2, recty + recth / 2);

    // var desc_width = description.node().getComputedTextLength();
    // var desc_height = description.node().getBBox().height;

    // // increase the rect size to fit the text
    // rect.attr("width", desc_width + 20)
    // rect.attr("height", desc_height + 40)    

    adjustRectText(node, rectx, recty);

    // updateConnections(rect);

    return node;
}

function updateConnections(node = null) {

    if (node) {
        const nodeg = d3.select(node.node().parentNode);
        const nid = nodeg.attr("id");

        if (nid in node_connections) {
            const rect = nodeg.select("rect");
            const nx1 = rect.attr("x");
            const ny1 = rect.attr("y");

            let connections = node_connections[nid];
            for (let i = 0; i < connections.length; i++) {
                const cnode = content.select("#" + connections[i]);
                if (cnode.empty()) {
                    continue;
                }

                const cid = cnode.attr("id");
                const crect = cnode.select("rect");

                if (cid in node_connections) {

                }


                const nx2 = crect.attr("x");
                const ny2 = crect.attr("y");

                let cline = content.select("#" + nid + connections[i]);

                if (cline.empty()) {
                    cline = content.append("line")
                        .attr("id", nid + connections[i])
                        .attr("class", "link")
                }

                updateLine(cline, nx1, ny1, nx2, ny2);
            }
        }

    }
}

function updateLine(line, x1, y1, x2, y2) {
    line
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
}

function adjustRectText(node, x, y) {
    let text = node.selectAll(`text, circle, foreignObject`);
    let nodeHeight = 0;
    let nodeWidth = node.select("rect").attr("width");
    for (let i = 0; i < text._groups[0].length; i++) {
        let t = text._groups[0][i];
        const ttype = t.nodeName;
        // const tw = t.getBBox().width;
        const tw = node.select("rect").attr("width") / text._groups[0].length;
        const th = node.select("rect").attr("height") / text._groups[0].length;

        if (ttype == "circle") {
            t.setAttribute("cx", x + tw / 2)
            t.setAttribute("cy", y + th / 2)

        }
        else {
            t.setAttribute("x", x);
            t.setAttribute("y", y);
        }

        if (ttype == "foreignObject") {
            t.setAttribute("width", node.select("rect").attr("width"))
            t.setAttribute("height", node.select("rect").attr("height"))

        }
    }

    d3.selectAll("foreignObject input").style("pointer-events", "auto");
    // adjust the rect size to fit the text
    node.select("rect").attr("width", nodeWidth)

}

function mousedown(event, d) {
    // let node = d3.select(this);
    // let initialX = node.attr("x");
    // let initialY = node.attr("y");

    // let offsetX = event.screenX + initialX;
    // let offsetY = event.screenY + initialY;

    // // add these values to the event object
    // // node.attr("offsetX", offsetX)
    // // node.attr("offsetY", offsetY)

}

function dragstarted(event, d) {
}

function dragged(event, data) {
    let rect = d3.select(this)
    rect.attr("x", event.x - rect.attr("width") / 2)
    rect.attr("y", event.y - rect.attr("height") / 2)
    // rect.attr("x", event.x - rect.attr("offsetX"))
    // rect.attr("y", event.y - rect.attr("offsetY"))
    console.log(rect.attr("width"))
    adjustRectText(d3.select(this.parentNode), event.x - rect.attr("width") / 2, event.y - rect.attr("height") / 2);

    // updateConnections(rect);
}

function dragended(event, d) {
    d3.select(this).classed("active", false);
    // d3.select(this.parentNode).select("text").raise();
}


function exportSVGString() {
    // first remove any input elements
    d3.selectAll("foreignObject input").remove();
    // then get the svg string
    let svgString = d3.select("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    // then add the input elements back
    d3.selectAll("foreignObject").each(function (d) {
        let node = d3.select(this);
        let html = node.select("div").html();
        addHTML(node, html);
    });

    return svgString;
}