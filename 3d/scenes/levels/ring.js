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

        // Array to hold the planes
        const planes = [];

        const planeCount = 100;
        const planeSize = 10;
        const planeSegments = 6;
        const ringRadius = Math.sqrt(planeCount * planeSize * planeSize / Math.PI) + 10;

        let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100000);
        let cameraHeight = -ringRadius + .1;

        camera.rotation.order = "YXZ";
        camera.position.set(0, cameraHeight, 0);
        camera.lookAt(0, cameraHeight, -100);

        const movespeed = 0.0009;
        Engine.cameraHeight = cameraHeight;
        Engine.movespeed = movespeed
        Engine.rotspeed = 3;
        Engine.camera = camera;

        let scene = new THREE.Scene();

        // ambient light
        let ambientLight = new THREE.AmbientLight(0x404040, 3);
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

        
        // Create the plane geometry
        var geometry = new THREE.PlaneGeometry(planeSize, planeSize, planeSegments, planeSegments);

        // Update the normals and compute the faces' normals for proper shading
        // geometry.computeVertexNormals();
        // geometry.computeFaceNormals();

        // Create a material for the plane
        var loader = new THREE.TextureLoader();
        var texture = loader.load('assets/grass.bmp');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(220, 220);

        var material = new THREE.MeshLambertMaterial({
            // color: 0x00ff00,
            vertexColors: true,
            side: THREE.DoubleSide,
            wireframe: true,
            // map: texture
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
            // vertex.z += Math.random() * 10;
            let h1 = perlin(vertex.x, vertex.y, 0) * .1;
            vertex.z = h1;

            // Set the new z value of the vertex
            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);

            let color = new THREE.Color();
            color.setRGB(0, 1, 0);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

        }

        geometry.attributes.copyPositions = geometry.attributes.position.clone();

        // Set the colors attribute
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        // Create the mesh with the geometry and material
        planeMesh.rotation.x = -Math.PI / 2; // Rotate the plane to make it horizontal
        planeMesh.position.y = -ringRadius*2;

        planeMesh.castShadow = true;

        // scene.add(planeMesh);


        const planesParent = new THREE.Object3D();
        // Create the planes
        for (let i = 0; i < planeCount; i++) {
            // const geometry = new THREE.PlaneGeometry(Math.PI, Math.PI, planeSegments, planeSegments);
            // const material = new THREE.MeshBasicMaterial({ 
            //     color: 0x00ff00,
            //     wireframe: true,
            //  }); // Adjust the material properties as needed
            // const plane = new THREE.Mesh(geometry, material);
            const plane = planeMesh.clone();


            // Position and rotate the plane in a circle
            const angle = (Math.PI * 2 * i) / planeCount;
            const posX = Math.cos(angle) * ringRadius;
            const posZ = Math.sin(angle) * ringRadius;
            plane.position.set(posX, 0, posZ);

            // Rotate the plane to face the center
            plane.lookAt(new THREE.Vector3(0, 0, 0));

            // Add the plane to the scene
            planesParent.add(plane);
            // planes.push(plane);
        }

        planesParent.rotation.x = Math.PI / 2;
        planesParent.rotation.z = Math.PI / 2;
        scene.add(planesParent);

        Level.planesParent = planesParent;

        Engine.scene = scene;


        // Engine.customFunctions.movement.pop();
        Engine.customFunctions.postEvents.push({ func: rotateRing });

        Engine.load();
        Engine.run();

    };

    function rotateRing() {
        // Level.planesParent.rotation.x += 0.001;

        if (Engine.keyboard[87]) {
            Level.planesParent.rotation.x -= Engine.movespeed
            console.log(Level.planesParent.rotation.x)
        }
        if (Engine.keyboard[83]) {
            Level.planesParent.rotation.x += Engine.movespeed
        }
    }

})();