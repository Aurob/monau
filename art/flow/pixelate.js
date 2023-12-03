
$ = document.querySelectorAll.bind(document);

function image_load() {
    return new Promise((res, rej) => {
        let images = ['fruit.jpg', 'skin-3358873_960_720.jpg', 'animals-8080446_960_720.jpg', 'hamburger-1238246_960_720.jpg', 'berries-2277_960_720.jpg', 'vegetables-1085063_960_720.jpg', 'HONDA_ASIMO.jpg', 'vegetables-1584999_960_720.jpg', 'oranges-1995056_960_720.jpg', 'duckling-8062337_960_720.jpg', 'eat-2834549_960_720.jpg']
        let image = images[Math.floor(Math.random() * images.length)];

        img = new Image();
        img.src = "/mosaic2/images/"+image;
        console.log(img.src)
        img.onload = function() {
            window.img = img;
            res(img);
        };
    });
}

var colors = {};
function pixelateImage(originalImage, pixelationFactor) {

    return new Promise((res, rej) => {
        const _canvas = document.createElement("canvas");
        const context = _canvas.getContext("2d");
        const originalWidth = originalImage.width;
        const originalHeight = originalImage.height;
        const _canvasWidth = originalWidth;
        const _canvasHeight = originalHeight;
        _canvas.width = _canvasWidth;
        _canvas.height = _canvasHeight;
        context.drawImage(originalImage, 0, 0, originalWidth, originalHeight);
        const originalImageData = context.getImageData(
            0,
            0,
            originalWidth,
            originalHeight
        ).data;

        res({'imgdata': originalImageData, 'size': [originalWidth, originalHeight]});
    }); 
}
