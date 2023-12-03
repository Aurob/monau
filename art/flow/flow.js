// Flow field
let redraw;
let cgrid = [];
let resolution, margin, cellSize, num_rows, left_x, right_x, left_y, right_y;

let ready = false;

function loadCGrid(width, height) {
    // let width = 500;
    // let height = 500;
    resolution = parseFloat(document.getElementById('resolution').value);
    margin = 0;
    cellSize = (width * resolution);
    num_rows = (width / cellSize) + (width * margin);
    left_x = width - margin;
    right_x = width + margin;
    left_y = height - margin;
    right_y = height + margin;
    let defaultAngle = 45;
    noiseSeed((new Date()).getTime());
    cgrid = [];
    for (let x = 0; x < num_rows; x++) {
        cgrid[x] = [];
        for (let y = 0; y < num_rows; y++) {
            // let angle = (y / (num_rows)) * PI;
            // let angle = noise(x * resolution / 100, y * resolution / 100) * 360;
            let angle = noise(x / 100, y / 100, frameCount / 1000);
            angle *= sqrt(x / 100) * noise(x / 100, y / 100, frameCount / 1000);
            // angle *= sin(y / 100);
            angle *= 360;
            // angle *= noise(x * resolution / 100, y * resolution / 100) * 360;
            // angle *= noise(x * resolution / 100, y * resolution / 100) * 360;
            cgrid[x][y] = {
                'angle': angle,
                'delta': 0
            }
        }
    }

    return cgrid;
}

let curves = [];
function makeCurve() {


    let cx = random(width);
    let cy = random(height);
    let num_steps = random(10, 100);
    let step_resolution = .1; //random(0.01, 0.1);
    let step_length = (width * step_resolution);
    let col_index = parseInt(cx / cellSize);
    let row_index = parseInt(cy / cellSize);
    let cx_step = 0;
    let cy_step = 0;

    let curve = {
        'start': [cx, cy],
        'steps': num_steps,
        'resolution': step_resolution,
        'length': step_length,
        'color': [random(255), random(255), random(255)]
    }

    curves.push(curve);
}


function getPointsAlongLine(x1, y1, x2, y2, numPoints) {
    var points = [];

    for (var i = 1; i <= numPoints; i++) {
        var t = i / (numPoints + 1);
        var x = lerp(x1, x2, t);
        var y = lerp(y1, y2, t);
        points.push({ x: x, y: y });
    }

    return points;
}

function drawCurve() {
    curves.forEach(curve => {
        let points = [];
        let fx = 0;
        let fy = 0;
        let lx = 0;
        let ly = 0;
        for (let n = 0; n < curve.steps; n++) {
            let cx = curve.start[0];
            let cy = curve.start[1];
            if (n == 0) {
                fx = cx;
                fy = cy;
            }
            let col_index = parseInt(cx / cellSize);
            let row_index = parseInt(cy / cellSize);
            let cx_step = 0;
            let cy_step = 0;
            noFill();
            stroke(curve.color);
            strokeWeight(5);


            beginShape();

            for (let nn = 0; nn < curve.steps; nn += .5) {
                curveVertex(cx, cy);

                let cell_angle = cgrid[col_index][row_index].angle;

                cx_step = cos(cell_angle) * curve.length;
                cy_step = sin(cell_angle) * curve.length;

                let tx = cx;
                let ty = cy;
                cx += cx_step;
                cy += cy_step;

                col_index = parseInt(cx / cellSize);
                row_index = parseInt(cy / cellSize);

                if (col_index < 0 || col_index > cgrid.length - 1 || row_index < 0 || row_index > cgrid.length - 1) {
                    break;
                }

                // points.push([cx, cy]);
                // let line_points = getPointsAlongLine(tx, ty, cx, cy);
                // point(tx, ty);

            }
            endShape();

            if (n == curve.steps - 1) {
                lx = cx;
                ly = cy;
            }
        }

        // points = getPointsAlongLine(fx, fy, lx, ly, 100);
        // // console.log(points);
        // noFill();
        // // stroke(curve.color);
        // strokeWeight(5);
        // beginShape();
        // for (let p = 0; p < points.length; p++) {

        //     let x = points[p].x;
        //     let y = points[p].y;
        //     vertex(x, y);
        //     // console.log(window.originalImageData.imgdata[parseInt(x) * 4 + parseInt(y) * window.originalImageData.size[0] * 4]);
        //     const r = window.originalImageData.imgdata[parseInt(x) * 4 + parseInt(y) * window.originalImageData.size[0] * 4];
        //     const g = window.originalImageData.imgdata[parseInt(x) * 4 + parseInt(y) * window.originalImageData.size[0] * 4 + 1];
        //     const b = window.originalImageData.imgdata[parseInt(x) * 4 + parseInt(y) * window.originalImageData.size[0] * 4 + 2];

        //     if(!r || !g || !b) continue;
        //     console.log(r, g, b);
        //     stroke(r, g, b);
        //     if (p % 2 == 0) {
        //         endShape();
        //         beginShape();
        //     }
        // }
        // endShape();

    })
}


function drawTestCurve(seed, cx=0, cy=0) {
    // randomSeed(seed);
    let num_steps = 100;
    let step_resolution = 1; //random(0.01, 0.1);
    let step_length = 1;//(width * step_resolution);
    
    noFill();
    stroke(0);
    strokeWeight(5);
    
    for (let n = 0; n < num_steps; n++) {
        // cx = random(width);
        // cy = random(height);
        let col_index = parseInt(cx / cellSize);
        let row_index = parseInt(cy / cellSize);
        let cx_step = 0;
        let cy_step = 0;
        beginShape();
        let alt = 0;
        for (let nn = 0; nn < num_steps; nn += 1) {

            if (col_index < 0 || col_index > cgrid.length - 1 || row_index < 0 || row_index > cgrid.length - 1) {
                break;
            }
            
            let cell_angle = cgrid[col_index][row_index].angle;

            cx_step = cos(cell_angle) * step_length;
            cy_step = sin(cell_angle) * step_length;

            let tx = cx;
            let ty = cy;
            cx += cx_step;
            cy += cy_step;

            col_index = parseInt(cx / cellSize);
            row_index = parseInt(cy / cellSize);

            if (col_index < 0 || col_index > cgrid.length - 1 || row_index < 0 || row_index > cgrid.length - 1) {
                break;
            }

            if(alt >= num_steps / random(1, 10)) {
            
                const r = window.originalImageData.imgdata[parseInt(cx) * 4 + parseInt(cy) * window.originalImageData.size[0] * 4];
                const g = window.originalImageData.imgdata[parseInt(cx) * 4 + parseInt(cy) * window.originalImageData.size[0] * 4 + 1];
                const b = window.originalImageData.imgdata[parseInt(cx) * 4 + parseInt(cy) * window.originalImageData.size[0] * 4 + 2];
                stroke(r, g, b);
    
                endShape();
                beginShape();
                alt = 0;
            }
            
            // fill(r, g, b);
            // ellipse(tx, ty, 5, 5);
            alt += 1;
            curveVertex(cx, cy);
        }
        endShape();
    }
    
}

function setup() {
    let curves = 2;
    image_load()
        .then((img) => {
            pixelateImage(img)
                .then((originalImageData) => {
                    window.originalImageData = originalImageData;

                    createCanvas(originalImageData.size[0], originalImageData.size[1]);
                    // angleMode(DEGREES);
                    loadCGrid(originalImageData.size[0], originalImageData.size[1]);
                    for (let i = 0; i < curves; i++) {
                        makeCurve();
                    }
                    ready = true;
                });
        });

    redraw = true;

}

function draw() {
    if (!ready) return;
    if (redraw) {
        background(255);

        cgrid.forEach((row, x) => {
            row.forEach((col, y) => {
                let x1 = (x * cellSize) - (width * margin);
                let y1 = (y * cellSize) - (height * margin);

                translate(x1 + cellSize / 2, y1 + cellSize / 2);
                rotate(col.angle);
                const r = window.originalImageData.imgdata[parseInt(x1) * 4 + parseInt(y1) * window.originalImageData.size[0] * 4];
                const g = window.originalImageData.imgdata[parseInt(x1) * 4 + parseInt(y1) * window.originalImageData.size[0] * 4 + 1];
                const b = window.originalImageData.imgdata[parseInt(x1) * 4 + parseInt(y1) * window.originalImageData.size[0] * 4 + 2];
                stroke(r, g, b);
                strokeWeight(cellSize);
                // line(-cellSize / 4, 0, cellSize / 4, 0);
                line(-cellSize / 2, 0, cellSize / 2, 0);
                resetMatrix();
                
                const mdist = dist(mouseX, mouseY, x1, y1);
                if(mdist - cellSize / 2 < cellSize)
                    col.delta = 0.1;
                
                
                // col.angle += noise(frameCount * 0.01, x * resolution / 100, y * resolution / 100) / 10;
                if(col.delta > 0) {
                    col.angle += col.delta;
                    col.delta -= 0.002;
                }
            })
        })

        // for(let i = 0; i < width/cellSize; i++) {
        //     drawTestCurve(i, i * cellSize, 0);
        // }

        // for(let i = 0; i < height/cellSize; i++) {
        //     drawTestCurve(i, 0, i * cellSize);
        // }

        // redraw = false;
    }
}


window.addEventListener('resize', () => {
    // resizeCanvas(window.innerWidth, window.innerHeight);
    redraw = true;
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        redraw = true;
    }
    else if (e.code === 'KeyG') {
        loadCGrid();
        redraw = true;
    }
});

document.getElementById('resolution').addEventListener('change', (e) => {
    cgrid = loadCGrid(window.originalImageData.size[0], window.originalImageData.size[1], e.target.value);
});
