
const loadModule = async () => {
    // const urlParams = new URLSearchParams(window.location.search);
    // const paramValue = urlParams.get('l') || urlParams.get('level');
    const paramValue = window.location.search.substring(1).split('&');

    let modulePath = '';
    if (paramValue) {
        modulePath = `./levels/${paramValue}.js`;
        
        try {
            const module = await import(modulePath);
            
            if (module && Level) {

                fetch('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json')
                .then(response => response.json())
                .then(fontJson => {
                    var font = new THREE.Font(fontJson);
                    Engine.font = font;
                    Engine.load();
                    Level.load();
                    Engine.run();
                })
                .catch(err => {
                    console.error('Error loading font:', err);
                })
                .finally((font) => {
                });
        
            }
            
        } catch (error) {
            console.error('Error loading module:', error);
        }
    }

  };

loadModule();