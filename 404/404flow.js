
const tileSize = 30;
let noiseDetailSlider;
let c;
let redraw;
let words = ["404", "PAGE", "NOT", "FOUND"];
function setup() {
    createCanvas(window.innerWidth, window.innerHeight); 
    redraw = true;
}

function draw() {

    if(redraw) {
        background(255, 255, 255, 0);
        for (let x = -tileSize; x < width + tileSize; x += tileSize) {
            for (let y = -tileSize; y < height + tileSize; y += tileSize) {
                
                let md = dist(x, y, width/2, height/2);
                
                let n = noise(x / 100, y / 100) / md * 150;
                c = map(n, 0, 1, 0, 360);
                
                // arrow(x, y, 10, c);
                // rect(x, y, tileSize, tileSize);
                let str = words[Math.floor(Math.random() * words.length)];
                // let rgb = (random(0, 1) > 0.5 ? color(255, 0, 0) : color(0, 0, 255));
                let rgb = (str == "404" ? color(255, 0, 0) : 0);

                let size = tileSize/2;
                // if(md < 100) {
                size = map(md, width/2, 0, tileSize/4, tileSize);
                // }

                textEx(str, x, y, size, c, rgb);
            }
        }
        redraw = false;
    }
}

function textEx(str, x, y, size, angle, rgb) {
    push();

    // Translate to the position
    translate(x, y);

    // // Rotate by the specified angle
    rotate(angle * (PI / 180));

    // draw the text
    textSize(size);
    textAlign(CENTER, CENTER);
    fill(rgb);
    text(str, 0, 0);

    pop();
}

window.addEventListener('resize', () => {
    resizeCanvas(window.innerWidth, window.innerHeight);
    redraw = true;
})

