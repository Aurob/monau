const pnf_translations = {
    "English": "Page Not Found",
    "Arabic": "صفحة غير موجودة",
    "German": "Seite nicht gefunden",
    "Spanish": "Página no encontrada",
    "French": "Page non trouvée",
    "Hebrew": "עמוד לא נמצא",
    "Italian": "Pagina non trovata",
    "Japanese": "ページが見つかりません",
    "Dutch": "Pagina niet gevonden",
    "Polish": "Strona nie znaleziona",
    "Portuguese": "Página não encontrada",
    "Romanian": "Pagina nu a fost găsită",
    "Russian": "Страница не найдена",
    "Swedish": "Sidan hittades inte",
    "Turkish": "Sayfa Bulunamadı",
    "Ukrainian": "Сторінку не знайдено",
    "Chinese": "页面未找到",
}

function create_language_switcher() {
    let l_step = 0;
    setInterval(function () {
        let translation = Object.keys(pnf_translations)[l_step];
        document.querySelectorAll('.pnf').forEach(e=>{
            e.innerHTML = pnf_translations[translation];
        });
        l_step++;
        if (l_step >= Object.keys(pnf_translations).length) l_step = 0;

    }, 100);
}

function create_language_banner() {
    for(let l in pnf_translations) {
        // document.querySelector('.pnf').innerHTML += `<span>${pnf_translations[l]}</span>`;
        document.querySelectorAll('.pnf').forEach(e=>{
            e.innerHTML += `<span>${pnf_translations[l]}</span>`;
        });
    }
}

let bg = document.querySelector('#bg');
let body = document.querySelector('body');
let tileSize;
let gridSize;
let t;

function setup() {
    createCanvas(body.offsetWidth, body.offsetHeight);
    textSize(15);
    tileSize = 20;
    gridSize = width / tileSize;
    t = 0;
    // create_language_switcher();
    create_language_banner();
}

function draw() {
    background(255, 255, 255);
    fill(0);
    textAlign(CENTER, CENTER);

    let yOffset = 0;
    for (let y = 0; y < gridSize; y++) {
        let xOffset = 0;
        for (let x = 0; x < gridSize; x++) {
            let noiseValue = noise(xOffset, yOffset, t);
            // let charIndex = int(noiseValue * 10);
            // let asciiValue = 33 + charIndex;
            // let char = String.fromCharCode(asciiValue);
            let is4 = (noiseValue < .4);
            char = (is4) ? 4 : 0;
            fill((is4) ? color(255, 0, 0) : color(0, 0, 255));
            text(char, x * tileSize, y * tileSize);
            xOffset += 0.1;
        }
        yOffset += 0.1;
    }

    t += 0.1;
}

// onresize
window.addEventListener('resize', function () {
    width = body.offsetWidth;
    height = body.offsetHeight;
    resizeCanvas(width, height);
    gridSize = width / tileSize;
});
