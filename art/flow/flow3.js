let c;
let redraw;
let cgrid = [];
let width = 500;
let height = 500;
let resolution = 0.05;
let cellSize = (width * resolution);

function loadCGrid() {
    for (let x = 0; x < width/cellSize; x++) {
        cgrid[x] = [];
        for (let y = 0; y < width/cellSize; y++) {
            let rnx = noise(x * 0.01, y * 0.01, 0);
            let rny = noise(x * 0.01, y * 0.01, 1);
            let gnx = noise(x * 0.01, y * 0.01, 2);
            let gny = noise(x * 0.01, y * 0.01, 3);
            let bnx = noise(x * 0.01, y * 0.01, 4);
            let bny = noise(x * 0.01, y * 0.01, 5);


            cgrid[x][y] = {
                // 'angle': random(360), 
                'angle': noise(x * 0.01, y * 0.01) * 360,
                // 'rgb': color(random(255), random(255), random(255))
                'rgb': color(noise(x * rnx, y * rny) * 255, noise(x * gnx, y * gny) * 255, noise(x * bnx, y * bny) * 255),
                'angleDelta': random(-2, 2)
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

                cgrid[x][y].angle += noise(x * 0.01, y * 0.01);
                //cgrid[x][y].angleDelta;
           
            })
        })

        // redraw = false;
    }
}


window.addEventListener('resize', () => {
    resizeCanvas(window.innerWidth, window.innerHeight);
    redraw = true;
});


