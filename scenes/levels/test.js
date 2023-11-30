(function () {

    var Level = {};
    
    // Attach your library to the global scope
    if (typeof window !== 'undefined') {
        window.Level = Level;
    }
    else if (typeof global !== 'undefined') {
        global.Level = Level;
    }

    Level.load = function () {
            
        let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100000);
        let cameraHeight = 120.8;

        camera.rotation.order = "YXZ";
        camera.position.set(0, cameraHeight, 0);
        camera.rotation.set(0, -1.5, 0);


        Engine.cameraHeight = cameraHeight;
        Engine.movespeed = 21;
        Engine.rotspeed = 3;
        Engine.camera = camera;

        let scene = new THREE.Scene();

        // Ambient light
        let ambientLight = new THREE.AmbientLight(0xffffff, 5);
        scene.add(ambientLight);

        const skyboxGeometry = new THREE.BoxGeometry(100000, 10000, 100000);
        const skyboxMaterial = new THREE.MeshStandardMaterial({
            color: 0x87ceeb,
            side: THREE.BackSide,
        });
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

        scene.add(skybox);

        // Grid
        let grid = new THREE.GridHelper(10000, 100, 0x000000, 0x000000);
        grid.material.opacity = 1;
        grid.material.transparent = true;
        scene.add(grid);


        Engine.scene = scene;
        Engine.load();
        Engine.run();
            
    };


})();