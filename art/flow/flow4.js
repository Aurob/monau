let c;
let redraw;
let cgrid = [];
let width = 500;
let height = 500;
let resolution = width * 0.05;

function loadCGrid() {
    for (let x = 0; x < resolution; x++) {
        cgrid[x] = [];
        for (let y = 0; y < resolution; y++) {
            cgrid[x][y] = {'a': random(360), 'rgb': color(random(255), random(255), random(255))}
        }
    }
}

function setup() {
    createCanvas(width, height);
    loadCGrid();
    redraw = true;
}

function draw() {

    if(redraw) {
        background(255);
        
        cgrid.forEach((row, x) => {
            row.forEach((col, y) => {
                let x1 = x * (width / resolution);
                let y1 = y * (height / resolution);
                let x2 = (x + 1) * (width / resolution);
                let y2 = (y + 1) * (height / resolution);
                
                push();
                translate(x1, y1);
                rotate(radians(col.a));
                fill(col.rgb);
                rect(x1, y1, x2, y2);
                pop();
           
            })
        })

        redraw = false;
    }
}


window.addEventListener('resize', () => {
    resizeCanvas(window.innerWidth, window.innerHeight);
    redraw = true;
});


