
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let content = document.querySelector('pre');
let csize = content.getBoundingClientRect();
let circle = {
    centerX: csize.left + csize.width / 2,
    centerY: 0,
    radius: csize.width / 2,
    r: 255,
    g: 0,
    b: 0,
    a: 0.5,
    ax: .0001,
    pointPulse: .1,
    hueShift: 1000
};
let numPoints = 100; // number of points to create the circle
let points = []; // array to hold the points

let mouseTrail = [];
let mouse = {
    x: 0,
    y: 0
};
let lastMouse = {
    x: 0,
    y: 0
};

// generate points for the circle
for (let i = 0; i < numPoints; i++) {
    let angle = i * 2 * Math.PI / numPoints;
    let x = circle.centerX + circle.radius * Math.cos(angle);
    let y = circle.centerY + circle.radius * Math.sin(angle);
    points.push({ x, y });
}

function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
};

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


function test() {
    requestAnimationFrame(test);
    ctx.clearRect(0, 0, width, height);

    // draw the circle using the points
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = `rgba(${circle.r}, ${circle.g}, ${circle.b}, ${circle.a})`;

    ctx.fill();

    circle.a -= circle.ax;

    if (circle.a <= 0.2 || circle.a >= 0.8) {
        circle.ax *= -1;
    }

    // make the points "pulse" with sin waves
    for (let i = 0; i < points.length; i++) {
        points[i].x += Math.cos(i + Date.now() / 1000) * circle.pointPulse;
        points[i].y += Math.sin(i + Date.now() / 1000) * circle.pointPulse;
    }

    // Color shifting over the rainbow
    let hue = (Date.now() / circle.hueShift) % 360;
    let rgb = hslToRgb(hue / 360, 1, 0.5);
    circle.r = rgb[0];
    circle.g = rgb[1];
    circle.b = rgb[2];

    //
    let inside = ctx.isPointInPath(mouse.x, mouse.y);
    if (inside && !radii_increased || !inside && radii_increased) {
        radii_increased = !radii_increased;

        // circle.pointPulse = (radii_increased ? 1 : 0.05);
        // circle.hueShift = (radii_increased ? 100 : 1000);
    }

    // Mouse trail emitter
    if (mouse.x !== lastMouse.x || mouse.y !== lastMouse.y) {
        mouseTrail.push({
            x: mouse.x,
            y: mouse.y,
            size: Math.random() * 5 + 1,
            life: 1
        });
    }

    // Update and draw particles
    for (let i = mouseTrail.length - 1; i >= 0; i--) {
        let particle = mouseTrail[i];

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${circle.r}, ${circle.g}, ${circle.b}, ${particle.life})`;
        ctx.fill();

        // Shrink particles and fade out
        particle.size -= 0.1;
        particle.life -= 0.01;

        // Remove dead particles
        if (particle.size <= 0 || particle.life <= 0) {
            mouseTrail.splice(i, 1);
        }
    }

    // Store the last mouse position
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    
}


window.addEventListener('resize', () => {
    console.log('resize');
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    csize = content.getBoundingClientRect();
    circle.centerX = csize.left + csize.width / 2;
    circle.centerY = 0;
    circle.radius = csize.width / 2;

    //update points
    for (let i = 0; i < numPoints; i++) {
        let angle = i * 2 * Math.PI / numPoints;
        let x = circle.centerX + circle.radius * Math.cos(angle);
        let y = circle.centerY + circle.radius * Math.sin(angle);
        points[i].x = x;
        points[i].y = y;
    }
});

window.addEventListener('load', (e) => {
    test();
});

let radii_increased = false;
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
