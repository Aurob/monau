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


    Level.load = function () {
        // console.log(Engine.THREE.PerspectiveCamera);
        // let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100000);
        let camera = Engine.camera;
        camera.rotation.order = "YXZ";
        camera.rotation.set(0, -Math.PI, 0);
        camera.position.x = 5;
        camera.position.y = 5;
        camera.position.z = -8.999999999999982;

        Engine.cameraHeight = camera.position.y;
        Engine.movespeed = .1;
        Engine.rotspeed = 1;
        Engine.camera = camera;

        let scene = new THREE.Scene();
        Engine.scene = scene;

        // Ambient light
        // let ambientLight = new THREE.AmbientLight(0xffffff, 5);
        // scene.add(ambientLight);

        //
        const fogColor = 0x343434;
        const fogDensity = 0.009;
        scene.fog = new THREE.FogExp2(fogColor, fogDensity);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 0, 0);
        scene.add(pointLight);


        const skyboxGeometry = new THREE.BoxGeometry(100000, 10000, 100000);
        const skyboxMaterial = new THREE.MeshStandardMaterial({
            color: 0x87ceeb,
            side: THREE.BackSide,
        });
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

        scene.add(skybox);

        // floor box
        const floor = new THREE.Mesh(
            new THREE.BoxGeometry(100, 1, 100),
            new THREE.MeshStandardMaterial({
                color: 0x808080,
                side: THREE.BackSide,
            })
        );
        floor.position.y = -5;
        floor.receiveShadow = true;
        scene.add(floor);


        // Create a box geometry
        var geometry = new THREE.BoxGeometry(1, 1, 12);

        // Create a basic material
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        // Create an instanced mesh with the geometry, material, and the total count of instances
        var count = 10 * 1000; // total count of instances
        var mesh = new THREE.InstancedMesh(geometry, material, count);

        // Create a grid of instances
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 1000; j++) {
                // Create a temporary matrix for this instance's transform
                var matrix = new THREE.Matrix4();

                // Set the position for this instance
                matrix.setPosition(i*1.1, j, 0);

                // Set random color
                mesh.material.color.setRGB(Math.random(), Math.random(), Math.random());

                // Update the instanced mesh with this transformation matrix at index i * 100 + j
                mesh.setMatrixAt(i * 1000 + j, matrix);
            }
        }   

        mesh.material.vertexColors = true;
        
        // update mesh
        mesh.instanceMatrix.needsUpdate = true;
        mesh.frustumCulled = false;
        // Add the instanced mesh to the scene
        scene.add(mesh);

        ////////////////////////////

    };


})();