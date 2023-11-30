(function () {

    var Level = {};

    // Attach your library to the global scope
    if (typeof window !== 'undefined') {
        window.Level = Level;
    }
    else if (typeof global !== 'undefined') {
        global.Level = Level;
    }

    if (!Engine) {
        console.error('Engine not loaded');
        return;
    }
    else {
        var THREE = Engine.THREE;
    }

    Level.grids = [];
    Level.load = function () {

        let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100000);
        let cameraHeight = 3;

        camera.rotation.order = "YXZ";
        camera.position.set(0, cameraHeight, -8);
        camera.lookAt(0, cameraHeight, 100);
        // -4.476062667796176e-17, _y: 0.6823812024608391, _z: 0.7309965078768156, _w: 4.178379776959943e-17
        camera.quaternion.set(-4.476062667796176e-17, 0.6823812024608391, 0.7309965078768156, 4.178379776959943e-17);


        Engine.cameraHeight = cameraHeight;
        Engine.movespeed = 0.09;
        Engine.rotspeed = 3;
        Engine.camera = camera;

        let scene = new THREE.Scene();

        // ambient light
        let ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        // Engine.camera.lookAt(torusMesh.position);


        const skyboxLoader = new THREE.CubeTextureLoader();
        const skyboxGeometry = new THREE.BoxGeometry(100000, 10000, 100000);
        const skybox = skyboxLoader.load([
            '/assets/front.png',
            '/assets/back.png',
            '/assets/top.png',
            '/assets/bottom.png',
            '/assets/left.png',
            '/assets/right.png',
        ]);

        scene.background = skybox;

        //grid
        let grid = new THREE.GridHelper(1000, 1000);
        grid.position.y = 0;
        grid.position.x = 0;
        grid.position.z = 0;
        // scene.add(grid);

        let loader = new THREE.TextureLoader();
        let texture = loader.load('assets/grass.bmp');

        // Create a billboard material using the texture
        const material = new THREE.SpriteMaterial({ map: texture });

        // Create a billboard sprite
        const sprite = new THREE.Sprite(material);


        Level.getImages().then(images => {

            const radius = 40;
            const sections = 20;
            const scale = 10;
            const sprites = [];
            const _rings = [];

            let imgI = 0;
            for (let i = 0; i < sections; i++) {
                const phi = i / sections * Math.PI * 2;


                const ring = [];
                for (let j = 0; j < sections; j++) {

                    let loader = new THREE.TextureLoader();
                    let texture = loader.load('https://robsweb.site/files/photos/thumbnails/' + images[imgI]);
                    const _sprite = sprite.clone();
                    _sprite.material = new THREE.SpriteMaterial({ map: texture });


                    _sprite.scale.set(scale, scale, scale);
                    const theta = j / sections * Math.PI;

                    _sprite.position.x = Math.sin(theta) * Math.cos(phi) * radius;
                    _sprite.position.y = Math.sin(theta) * Math.sin(phi) * radius;
                    _sprite.position.z = Math.cos(theta) * radius;

                    scene.add(_sprite);

                    // sprite click event
                    // _sprite.onClick = function () {
                    //     console.log(imgI);
                    //     window.open('https://robsweb.site/files/photos/' + images[imgI], '_blank');
                    // }

                    imgI++;
                    if (imgI >= images.length) imgI = 0;

                    ring.push(_sprite);
                }

                _rings.push(ring);
            }

            Level._rings = _rings;

            Engine.customFunctions.postEvents.push({ func: updateRings });

            Engine.scene = scene;
            Engine.load();
            Engine.run();

            clickActions();
        });

    };

    Level.getImages = function () {
        return fetch('https://api.robsweb.site/photos/all_photos_metadata')
            .then(response => response.json())
            .then(data => {
                return data.result.map(photo => photo.type + '/' + photo.name);
            });
    }

    let camDirection = true;
    function updateRings() {
        // for (let ring of Level._rings) {
        //     for (let sprite of ring) {
        //         sprite.position.x += Math.sin(sprite.position.y / 100) * 0.1;
        //     }
        // }
        // ASCII S is 83
        Engine.keyboard[83] = camDirection;
        if(Engine.camera.position.z > 8) camDirection = false;
    }

    function clickActions() {

        // Set up the raycaster
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Click event listener
        window.addEventListener('click', onClick);

        function onClick(event) {
            const mouse = new THREE.Vector2();
            // Calculate normalized device coordinates
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Cast a ray from the camera through the mouse position
            raycaster.setFromCamera(mouse, Engine.camera);

            // Check for intersections with sprites
            const intersects = raycaster.intersectObjects(Engine.scene.children, true);

            if (intersects.length > 0) {
                // Get the first intersected sprite
                const clickedSprite = intersects[0].object;

                // clickedSprite.onClick();
            }
        }
    }


})();