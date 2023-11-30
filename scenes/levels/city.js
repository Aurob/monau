(function () {

    var Level = {};
    Level.name = 'Level One';

    if(!Engine) {
        console.error('Engine not loaded');
        return;
    }
    else {
        var THREE = Engine.THREE;
    }
    
    // Attach your library to the global scope
    if (typeof window !== 'undefined') {
        window.Level = Level;
    }
    else if (typeof global !== 'undefined') {
        global.Level = Level;
    }

    Level.load = function () {
            
        let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
        let cameraHeight = 68;

        camera.rotation.order = "YXZ";
        camera.position.set(0, cameraHeight, 0);


        Engine.cameraHeight = cameraHeight;
        Engine.movespeed = 21;
        Engine.rotspeed = 3;
        Engine.camera = camera;

        let scene = new THREE.Scene();

        // Directional light
        let ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);


        const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
        const skyboxMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.BackSide,
        });
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

        scene.add(skybox);

        // Grid
        let gridHelper = new THREE.GridHelper(10000, 100, 0x000000, 0x000000);
        scene.add(gridHelper);

        let buildings = 10;
        let side = 1;
        for(let i = 1; i < buildings+1; i++) {
            // box
            let boxGeometry = new THREE.BoxGeometry(200, 1000, 400);
            let boxMaterial = new THREE.MeshLambertMaterial({
                color: 0x666666,
                side: THREE.DoubleSide,
            });
            let box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(side*600, 500, -i*500);
                
            // Create the outline geometry using EdgesGeometry
            const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);

            // Create the outline material
            const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

            // Create the outline mesh using LineSegments
            const outlineMesh = new THREE.LineSegments(edgesGeometry, outlineMaterial);
            box.add(outlineMesh);

            scene.add(box);

            if(side==1 && i >= buildings) {
                side*=-1;
                i = 0;
            }
        }

        Engine.scene = scene;
        Engine.load();
        Engine.run();
            
    };


})();