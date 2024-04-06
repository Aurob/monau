import Objects from '/scenes/libs/Objects.js';

(function () {

    var Level = {};
    Level.name = 'Level Zero';

    if (!Engine) {
        console.error('Engine not loaded');
        return;
    }
    else {
        var THREE = Engine.THREE;
        document.title = Level.name;
        Level.Objects = new Objects(Engine);
    }

    // Attach your library to the global scope
    if (typeof window !== 'undefined') {
        window.Level = Level;
    }
    else if (typeof global !== 'undefined') {
        global.Level = Level;
    }

    Level.clouds = null;

    Level.load = function () {

        let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100000);
        let cameraHeight = -14;

        camera.rotation.order = "YXZ";
        camera.position.set(15, cameraHeight, 0);
        camera.lookAt(-100, cameraHeight, 0);


        Engine.cameraHeight = cameraHeight;
        Engine.movespeed = 0.9;
        Engine.rotspeed = 3;
        Engine.camera = camera;

        let scene = new THREE.Scene();

        // Ambient light
        let ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);

        // Point light
        const fogColor = 0x343434;
        const fogDensity = 0.009;
        // scene.fog = new THREE.FogExp2(fogColor, fogDensity);


        const skyboxLoader = new THREE.CubeTextureLoader();
        const skyboxGeometry = new THREE.BoxGeometry(100000, 10000, 100000);
        const skyboxMaterial = new THREE.MeshBasicMaterial({
            color: 0x77a9da,
            side: THREE.BackSide,
        });
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

        // const skybox = skyboxLoader.load([
        //     // '/assets/front.png',
        //     // '/assets/back.png',
        //     // '/assets/top.png',
        //     // '/assets/bottom.png',
        //     // '/assets/left.png',
        //     // '/assets/right.png',
        //     '/assets/nx.png',
        //     '/assets/px.png',
        //     '/assets/py.png',
        //     '/assets/ny.png',
        //     '/assets/nz.png',
        //     '/assets/pz.png',
        // ]);

        // scene.background = skybox;
        scene.add(skybox);

        var planeX = 500;
        var planeY = 500;
        var planeSegments = 50;
        // Create the plane geometry
        var geometry = new THREE.PlaneGeometry(planeX, planeY, planeSegments, planeSegments);


        var material = new THREE.MeshLambertMaterial({
            color: 0x5c990b,
            vertexColors: true,
            side: THREE.DoubleSide,
            // wireframe: true,
        });

        // Create the mesh with the geometry and material
        let planeMesh = new THREE.Mesh(geometry, material);

        planeMesh.castShadow = true;
        planeMesh.receiveShadow = true;


        // Get the position attribute
        var positions = geometry.attributes.position;
        var colors = new Float32Array(positions.count * 3);

        // Manipulate the vertices of the plane geometry to create height variation
        for (var i = 0; i < positions.count; i++) {
            var vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positions, i);

            vertex.z += Math.sin(vertex.x * 0.05) * (perlin(vertex.x * 0.05, vertex.y * 0.05) * Math.random() * 10);
            vertex.z += Math.sin(vertex.y * 0.05) * (perlin(vertex.x * 0.05, vertex.y * 0.05) * Math.random() * 10);

            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);

            let color = new THREE.Color();
            let g = Math.sin(vertex.x * 0.05) * 0.05 + 0.421123;
            color.setRGB(0, g, 0);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

        }

        geometry.attributes.copyPositions = geometry.attributes.position.clone();
        
        // Set the colors attribute
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        // Create the mesh with the geometry and material
        planeMesh.rotation.x = -Math.PI / 2; // Rotate the plane to make it horizontal

        planeMesh.castShadow = true;
        planeMesh.position.x = -100;
        planeMesh.position.y = -15;

        scene.add(planeMesh);
        Engine.planeMesh = planeMesh;

        // Cloud
        let cloudGeometry = new THREE.SphereGeometry(2, 32, 32);
        cloudGeometry.scale(3.5, 2, 6);
        let cloudMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.5,
        });
        let cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

        var cloudPositions = cloudGeometry.attributes.position;
        var cloudColors = new Float32Array(cloudPositions.count * 3);

        for (var i = 0; i < cloudPositions.count; i++) {
            var vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(cloudPositions, i);

            vertex.x += Math.sin(i) + perlin(vertex.x, vertex.y/666, vertex.z) * 10;

            cloudPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        cloudMesh.position.x = -40;
        cloudMesh.position.y = -1;
        scene.add(cloudMesh);
        Level.clouds = cloudMesh;


        Engine.customFunctions.postEvents.push({ func: updateClouds, args: [] });

        Engine.scene = scene;
        Engine.load();
        Engine.run();

    };

    function updateClouds() {
        if (Level.clouds) {
            Level.clouds.position.x += 0.01;
        }

        var cloudPositions = Level.clouds.geometry.attributes.position;
        
        for (var i = 0; i < cloudPositions.count; i++) {
            var vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(cloudPositions, i);

            vertex.x += perlin(vertex.x, vertex.y, vertex.z);

            cloudPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
    }

})();