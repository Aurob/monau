(function () {
    //console.log(window.THREE)

    var Utils = {};

    Utils.perlin = function(x, y) {
        let n = 0.0,
            a = 1.0,
            f = 0.005;
        for (let o = 0; o < 8; o++) {
            let v = a * Noise2D(x * f, y * f);
            n += v;
            a *= 0.5;
            f *= 2.0;
        }

        n += 1.0;
        n *= 0.5;
        return n;
    }

    Utils.randid = function() {
        return Math.random().toString(36).substr(2, 9);
    }
    Utils.randColor = function() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    Utils.mapRange = function(value, min1, max1, min2, max2) {
        return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
    }
    Utils.generateRandomArray = function(length, min, max) {
        return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    }

    // Attach your library to the global scope
    if (typeof window !== 'undefined') {
        window.Utils = Utils;
    } else if (typeof global !== 'undefined') {
        global.Utils = Utils;
    }

})();