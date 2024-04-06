// Immediately Invoked Function Expression (IIFE) to encapsulate the library
(function () {
    // Your library code goes here

    if (!Engine) {
        console.error("Engine not loaded");
        return;
    }

    Sounds = {};

    audios = {};
    misc_sounds = [];

    Sounds.audios = audios;
    Sounds.misc_sounds = misc_sounds;
    
    Sounds.load = function (name, path, add=true) {
        var audio = new Audio();
        audio.src = path;
        
        audio.load();

        Sounds.audios[name] = audio;
        
        if(add)
            Sounds.misc_sounds.push(name);
        
        return audio;
    };

    Sounds.play = function (name) {
        var audio = Sounds.audios[name];
        if(!audio || !audio.paused) 
            return;

        if (audio) {
            //console.log(1234);

            audio.play();
            
            audio.addEventListener('ended', function() {
            
            });
        }
        
    };

    Sounds.stop = function (name) {
        var audio = audios[name];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    };

    Sounds.stopAll = function () {
        for (var name in Sounds.audios) {
            var audio = Sounds.audios[name];
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    };

    Sounds.misc_noise = function () {

        // if any of the movement keys are pressed, play a random sound
        //
        // if (!Engine.keyboard[87] && !Engine.keyboard[83] && !Engine.keyboard[65] && !Engine.keyboard[68])
        //     return;

        let n = Math.random()
        // if(Engine.tick < 4000)
        //     return;

        if(n > .9){
            let rand_sound = Math.floor(Math.random() * Sounds.misc_sounds.length);
            Sounds.play(Sounds.misc_sounds[rand_sound]);
        }
    };


    // Attach your library to the global scope
    if (typeof window !== 'undefined') {
        window.Sounds = Sounds;
    } else if (typeof global !== 'undefined') {
        global.Sounds = Sounds;
    }

    //console.log("Sounds loaded");
})();
