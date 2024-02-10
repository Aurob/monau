import Objects from 'https://0b.lol/scenes/scenes/libs/Objects.js';

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

    var planeX = 900;
    var planeY = 700;
    var planeSegmentsX = 50;
    var planeSegmentsY = 50;
    Level.load = function () {

        let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100000);
        let cameraHeight = 200;

        camera.rotation.order = "YXZ";
        camera.position.set(0, cameraHeight - 500, -planeY/2);
        camera.lookAt(0, 0, planeY);

        Engine.cameraHeight = cameraHeight;
        Engine.movespeed = 0.9;
        Engine.rotspeed = 3;
        Engine.camera = camera;

        let scene = new THREE.Scene();

        // Ambient light
        let ambientLight = new THREE.AmbientLight(0xffffff, .7);
        scene.add(ambientLight);

        // Sun
        // let sun = new THREE.DirectionalLight(0xffffff, 100);
        // sun.position.set(0, 200, 0);
        // sun.castShadow = true;
        // scene.add(sun);
        // Engine.sun = sun;

        let sun = new THREE.SpotLight(0xffffff, 2.3);
        sun.position.set(0, 300, 0);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 1096;
        sun.shadow.mapSize.height = 1096;
        sun.shadow.camera.near = 1;
        sun.shadow.camera.far = 10000;
        sun.shadow.bias = -0.1;
        scene.add(sun);
        Engine.sun = sun;


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
        scene.add(skybox);

        // Create the plane geometry
        var geometry = new THREE.PlaneGeometry(planeX, planeY, planeSegmentsX, planeSegmentsY);


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

            // Additional variation
            var frequency = 0.21123125123123; // Adjust the frequency for more or less detail
            var amplitude = 6; // Adjust the amplitude for more or less height variation
            var scale = 1; // Adjust the scale of the terrain

            // Create rolling hills in both directions
            vertex.z += (perlin(vertex.x * .5, vertex.y * .5) + Math.sin( vertex.x * frequency )) * amplitude;
            vertex.z += (perlin(vertex.x * .5, vertex.y * .5) + Math.sin( vertex.y * frequency )) * amplitude;

            vertex.z += Math.sin( vertex.x * frequency ) * amplitude;

            // Smooth offset
            // vertex.z += Math.sin( i );
            // Random offset
            var randomOffset = Math.random() * amplitude;
            // vertex.z += randomOffset;

            // Adjust the scale of the terrain
            vertex.z *= scale;

            // Set the new z value of the vertex
            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);


            let color = new THREE.Color();
            // let g = Math.sin(vertex.x * 0.05) * 0.1 + 0.321123;
            // let g = Math.cos(-vertex.x * 0.5) * 0.1 + 0.321123;
            let g = perlin(vertex.x * 0.05, vertex.z * 0.5) * 0.1 + 0.2721123;
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
        let cloudMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.7
        });
        let cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

        cloudMesh.castShadow = true;
        cloudMesh.receiveShadow = true;

        var cloudPositions = cloudGeometry.attributes.position;
        var cloudColors = new Float32Array(cloudPositions.count * 3);

        for (var i = 0; i < cloudPositions.count; i++) {
            var vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(cloudPositions, i);

            vertex.x += Math.sin(i) + perlin(vertex.x, vertex.y / 666, vertex.z) * 10;

            cloudPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);

            cloudMesh.castShadow = true;
            cloudMesh.receiveShadow = true;
        }

        cloudMesh.position.x = -40;
        cloudMesh.position.y = 150;
        scene.add(cloudMesh);
        Level.clouds = cloudMesh;

        // const testobj = Level.Objects.new(
        //     'other',
        //     0, 0, 0,
        //     1000, 1000, 1000,
        //     0xaaaaaa, null, null, 'box',
        //     2
        // );

        // scene.add(testobj);

        // Engine.customFunctions.movement.pop();
        Engine.customFunctions.movement.push({
            func: function () {
                // Camera Up and Down Space and Shift
                if (Engine.keyboard[32]) {
                    Engine.camera.position.y += 0.1;
                }
                if (Engine.keyboard[16]) {
                    Engine.camera.position.y -= 0.1;
                }
            }, args: []
        });

        Engine.customFunctions.postEvents.push({ func: updateHeight, args: [] });

        Engine.customFunctions.postEvents.push({ func: updateClouds, args: [] });

        Engine.scene = scene;
        Engine.load();
        Engine.run();

    };

    var cloudDirection = 1;

    let r = Math.random();
    function updateClouds() {
        if (Level.clouds) {
            Level.clouds.position.x += Math.sin(r) * 0.01;
        }

        var cloudPositions = Level.clouds.geometry.attributes.position;

        for (var i = 0; i < cloudPositions.count; i++) {
            var vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(cloudPositions, i);

            vertex.x += perlin(vertex.x, vertex.y, vertex.z) * cloudDirection;
            // vertex.y += perlin(vertex.x, vertex.y, vertex.z) * cloudDirection;
            if (vertex.x > planeX/2 || vertex.x < -planeX/2 || vertex.z > planeY/2 || vertex.z < -planeY/2) {
                cloudDirection *= -1;
            }

            cloudPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);

            // if(i === 0) {
            //     Engine.camera.lookAt(vertex);
            // }
        }

        cloudPositions.needsUpdate = true;
        Engine.planeMesh.needsUpdate = true;

        // Engine.sun.position.x = Engine.camera.position.x;
        // Engine.sun.position.y = Engine.camera.position.y;
        // Engine.sun.position.z = Engine.camera.position.z;

        // Engine.sun.target.position.x = Engine.camera.position.x;

    }

    function updateHeight() {
				
        // Create a raycaster
        var raycaster = new THREE.Raycaster();

        // Define the coordinate where you want to get the height
        var coordinate = new THREE.Vector3(Engine.camera.position.x, 1000, Engine.camera.position.z);

        // Set the direction of the raycaster (in this case, we want to cast downwards)
        var direction = new THREE.Vector3(0, -1, 0);

        // Set the origin of the raycaster to the coordinate you want to test
        raycaster.set(coordinate, direction);

        let offplane = true;
        for(let i = 0; i < Engine.scene.children.length; i++) {
            let child = Engine.scene.children[i];
            // Perform the raycasting
            var intersects = raycaster.intersectObject(child, true);

            // Check if the ray intersects with the plane
            if (intersects.length > 0) {
            // The height is the y-coordinate of the intersection point
                var height = intersects[0].point.y;
                Engine.camera.position.y = height + 11;
                
                // break;
            }
            
        }
    }


})();