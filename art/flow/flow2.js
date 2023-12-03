let c;
let redraw;
let cgrid = [];
let width = 500;
let height = 500;
let resolution = width * 0.05;
let cellSize = width / resolution;

function loadCGrid() {
    for (let x = 0; x < resolution; x++) {
        cgrid[x] = [];
        for (let y = 0; y < resolution; y++) {
            cgrid[x][y] = {
                // 'angle': random(360), 
                'angle': noise(x * 0.01, y * 0.01) * 360,
                'rgb': color(random(255), random(255), random(255))
            }
        }
    }
}

function setup() {
    createCanvas(width, height);
    angleMode(DEGREES);
    loadCGrid();
    redraw = true;
}

function draw() {

    if(redraw) {
        background(255);
        
        cgrid.forEach((row, x) => {
            row.forEach((col, y) => {
                let x1 = x * cellSize;
                let y1 = y * cellSize;
                
                translate(x1 + cellSize / 2, y1 + cellSize / 2);
                rotate(col.angle);
                fill(col.rgb);
                rectMode(CENTER);
                rect(0, 0, cellSize, cellSize);
                
                resetMatrix();
           
            })
        })

        redraw = false;
    }
}


window.addEventListener('resize', () => {
    resizeCanvas(window.innerWidth, window.innerHeight);
    redraw = true;
});


