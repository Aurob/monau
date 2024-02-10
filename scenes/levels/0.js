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

    Level.load = function () {

        let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100000);
        let cameraHeight = 33.8;

        camera.rotation.order = "YXZ";
        camera.position.set(15, cameraHeight, 0);
        camera.lookAt(0, cameraHeight, 100);


        Engine.cameraHeight = cameraHeight;
        Engine.movespeed = 0.09;
        Engine.rotspeed = 3;
        Engine.camera = camera;

        let scene = new THREE.Scene();

        // Ambient light
        let ambientLight = new THREE.AmbientLight(0xffffff, 1);
        // scene.add(ambientLight);

        // Point light
        let pointLight = new THREE.PointLight(0xffffff, 2, 400);
        pointLight.castShadow = true;
        pointLight.shadow.bias = -0.001;
        scene.add(pointLight);
        Engine.light = pointLight;


        const fogColor = 0x343434;
        const fogDensity = 0.009;
        // scene.fog = new THREE.FogExp2(fogColor, fogDensity);

        // Test

        
        // let test_options = {
        //     id: 'test',
        //     position: { x: 0, y: 0, z: 0 },
        //     size: { w: 100, h: 100, d: 100 },
        //     color: 0x00ff00,
        //     shadows: 2
        // };
        // scene.add(Level.Objects.new(test_options));
        // Skybox
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

        Engine.scene = scene;

        Engine.load();



        // Define the size and segments of the plane
        var planeSize = 100;
        var planeSegments = 50;



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
        // texture.repeat.set(220, 220);

        var material = new THREE.MeshLambertMaterial({
            // color: 0x00ff00,
            vertexColors: true,
            side: THREE.DoubleSide,
            // wireframe: true,
            map: texture
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

            // vertex.z += Math.sin(vertex.x * 0.05) * 5;
            vertex.z += Math.sin(vertex.y * 0.05) * 5;

            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);

            let color = new THREE.Color();
            let g = perlin(vertex.x / 100, vertex.y / 100, vertex.z / 100);
            color.setRGB(0, g, 0);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

        }

        console.log(colors)

        geometry.attributes.copyPositions = geometry.attributes.position.clone();
        
        // Set the colors attribute
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        // Create the mesh with the geometry and material
        planeMesh.rotation.x = -Math.PI / 2; // Rotate the plane to make it horizontal

        planeMesh.castShadow = true;
        scene.add(planeMesh);

        Engine.planeMesh = planeMesh;

        Engine.run();

        Engine.customFunctions.movement.pop();
        Engine.customFunctions.movement.push({ func: ()=> {
            
            
            if (Engine.keyboard[65]) {
                // A turns left
                Engine.camera.setRotateY(Engine.camera.getRotateY() + Engine.rotspeed);
            }
    
            if (Engine.keyboard[68]) {
                // D turns right
                Engine.camera.setRotateY(Engine.camera.getRotateY() - Engine.rotspeed);
            }
    
            // Q and E
            if (Engine.keyboard[69]) {
                Engine.camera.setRotateX(Engine.camera.getRotateX() - Engine.rotspeed);
            }
    
            if (Engine.keyboard[81]) {
                Engine.camera.setRotateX(Engine.camera.getRotateX() + Engine.rotspeed);
            }
    
            if (Engine.scrollDelta) {
                Engine.camera.setRotateX(Engine.camera.getRotateX() - Engine.rotspeed * Engine.scrollDelta / 100);
                Engine.scrollDelta = 0;
            }
        }});

        Level.speedFraction = Math.PI * 100;

        Engine.customFunctions.postEvents.push({ func: ()=> {
            var direction = Engine.camera.getWorldDirection(new THREE.Vector3());
            var positions = Engine.planeMesh.geometry.attributes.position;
            var colors = new Float32Array(positions.count * 3);
            for(var i = 0; i < positions.count; i++) {

                var vertex = new THREE.Vector3();
                vertex.fromBufferAttribute(geometry.attributes.copyPositions, i);

                // vertex.x += (Engine.keyboard[68]) ? -Engine.movespeed/10 : (Engine.keyboard[65]) ? Engine.movespeed/10 : 0;
                // vertex.y += (Engine.keyboard[87]) ? -Engine.movespeed/10 : (Engine.keyboard[83]) ? Engine.movespeed/10 : 0;

                let xoffset = Engine.camera.getRotateY() * Math.PI / 180;
                let yoffset = Engine.camera.getRotateX() * Math.PI / 180;

                // vertex.x += (Engine.keyboard[87]) ? -Engine.movespeed * Math.cos(xoffset) : (Engine.keyboard[83]) ? Engine.movespeed * Math.cos(xoffset) : 0;
                // vertex.y += (Engine.keyboard[87]) ? -Engine.movespeed * Math.sin(xoffset) : (Engine.keyboard[83]) ? Engine.movespeed * Math.sin(xoffset) : 0;
                
                vertex.x += (Engine.keyboard[87]) ? direction.x * Engine.movespeed : (Engine.keyboard[83]) ? -direction.x * Engine.movespeed : 0;
                vertex.y -= (Engine.keyboard[87]) ? direction.z * Engine.movespeed : (Engine.keyboard[83]) ? -direction.z * Engine.movespeed : 0;

                geometry.attributes.copyPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);

                var meshvertex = new THREE.Vector3();
                meshvertex.fromBufferAttribute(positions, i);

                // meshvertex.z = Math.sin(vertex.y * 0.05) + Math.sin(vertex.x * 0.005) * 5;
                // Mountain-like terrain
                let h1 = perlin(vertex.x, vertex.y, 0.005) * 25;
                let h2 = perlin(vertex.x, vertex.y, 0.05) * 5;
                meshvertex.z = h1 + h2;
                meshvertex.z += Math.sin(vertex.y * 0.05) * 5;

                positions.setXYZ(i, meshvertex.x, meshvertex.y, meshvertex.z);


                // let color = new THREE.Color();
                // let g = perlin(vertex.x, vertex.y) * 0.1 + 0.4;
                // color.setRGB(0, g, 0);
                // colors[i * 3] = color.r;
                // colors[i * 3 + 1] = color.g;
                // colors[i * 3 + 2] = color.b;
            }

            // Engine.planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.attributes.copyPositions.needsUpdate = true;
            geometry.attributes.position.needsUpdate = true;
        } });

        Engine.customFunctions.postEvents.push({ func: updateHeight });
        Engine.customFunctions.postEvents.push({ func: updatePlaneTexture });
        Engine.customFunctions.postEvents.push({ func: updateLightPosition });

    };

    function updateHeight() {
        // Cast a ray straight down to find the height
        // of the terrain at the player position
        var originPoint = Engine.camera.position.clone();
        originPoint.y += 1000;
        var down = new THREE.Vector3(0, -1, 0);
        var ray = new THREE.Raycaster(originPoint, down);
        var intersects = ray.intersectObject(Engine.planeMesh);
        if (intersects.length > 0) {
            Engine.camera.position.y = intersects[0].point.y + Engine.cameraHeight;
        }

    }

    function updatePlaneTexture() {
        var direction = Engine.camera.getWorldDirection(new THREE.Vector3());
        
        // Engine.planeMesh.material.map.offset.x += (Engine.keyboard[87]) 
        //     ? direction.x * Engine.movespeed : (Engine.keyboard[83]) 
        //     ? -direction.x * Engine.movespeed : 0;
        // Engine.planeMesh.material.map.offset.y -= (Engine.keyboard[87]) 
        //     ? direction.z * Engine.movespeed : (Engine.keyboard[83]) 
        //     ? -direction.z * Engine.movespeed : 0;

        if(Engine.keyboard[87]) {
            Engine.planeMesh.material.map.offset.x += direction.x * Engine.movespeed/Level.speedFraction;
            Engine.planeMesh.material.map.offset.y -= direction.z * Engine.movespeed/Level.speedFraction;
        } else if(Engine.keyboard[83]) {
            Engine.planeMesh.material.map.offset.x -= direction.x * Engine.movespeed/Level.speedFraction;
            Engine.planeMesh.material.map.offset.y += direction.z * Engine.movespeed/Level.speedFraction;
        }
    }

    function updateLightPosition() {
        Engine.light.position.x = Engine.camera.position.x;
        Engine.light.position.y = Engine.camera.position.y + 100;
        Engine.light.position.z = Engine.camera.position.z;
    }

    Level.test = function () {
        console.log(Objects);
    };


})();