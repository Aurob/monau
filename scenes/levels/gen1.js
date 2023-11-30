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
        let cameraHeight = 12.8;

        camera.rotation.order = "YXZ";
        camera.position.set(0, cameraHeight, 0);


        Engine.cameraHeight = cameraHeight;
        Engine.movespeed = .4;
        Engine.rotspeed = 0;
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

        // Ring created with grids
        // let ring = new THREE.Object3D();
        // let ringRadius = 10;
        // let ringHeight = 1;
        // let ringSegments = 64;
        // let ringGridHelper = new THREE.GridHelper(ringRadius, ringSegments);
        // ringGridHelper.rotation.x = Math.PI / 2;
        // ringGridHelper.position.y = ringHeight / 2;
        // ring.add(ringGridHelper);

        // let ringMaterial = new THREE.MeshBasicMaterial({
        //     color: 0x123abc,
        //     side: THREE.DoubleSide
        // });

        // let ringGeometry = new THREE.CylinderGeometry(ringRadius, ringRadius, ringHeight, ringSegments);
        // let ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        // ringMesh.rotation.x = Math.PI / 2;
        // ringMesh.position.y = ringHeight / 2;

        // ringMesh.receiveShadow = true;
        // ringMesh.castShadow = true;
        // ring.add(ringMesh);
        // scene.add(ring);


        let segments = 40;
        let gw = 1000;
        let gh = 1000;
        let gridRot = (Math.PI / 2) * Math.sin(Math.PI / segments);
        for(let i = 0; i < segments; i++) {
            let grid = new THREE.GridHelper(gw, segments);
            
            grid.position.y = cameraHeight;
            grid.position.z = -400;

            grid.rotation.x = gridRot;
            grid.rotation.y = i * (Math.PI / segments);
            scene.add(grid);

            Level.grids.push(grid);
        }

        Engine.scene = scene;
        Engine.customFunctions.postEvents.push({ func:auto});
        Engine.load();
        Engine.run();
            
    };

    let cdz = 1;
    let autoSpeed = .4;
    let rotSpeed = .01;
    function auto() {
        for(let i = 0; i < Level.grids.length; i++) {
            let grid = Level.grids[i];

            grid.rotation.y += rotSpeed * perlin(grid.rotation.z, 0, 0)
            grid.rotation.x = (Math.PI / 2) * Math.sin(grid.rotation.y) * perlin(grid.rotation.y, 0, 0)
            grid.rotation.z += rotSpeed * perlin(grid.rotation.z, 0, 0)
            grid.position.z += autoSpeed * cdz;
        }

        Engine.camera.position.z -= autoSpeed * cdz;
        
        if(Engine.camera.position.z < -400 || Engine.camera.position.z > 0) {
            cdz *= -1;
        }
    }


})();