(function () {

    var Level = {};
    Level.name = 'Microscope Prototype';

    if (!Engine) {
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

        let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
        let cameraHeight = 68;
        camera.position.set(-3.028392933389026, 159, 45.700678437304344); // Set initial camera position above the model
        camera.rotation.order = "YXZ";
        camera.rotation.set(0, -6.324999999999996, 0);

        // Define waypoints for the track
        const waypoints = [
            new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z),
            new THREE.Vector3(-1.2584596993006691, 149, -21.602670863842558),
            new THREE.Vector3(-1.158459699300669, 148.29999999999998, -24.502670863842585),
        ];

        // Create a spline curve using the waypoints
        const track = new THREE.CatmullRomCurve3(waypoints);


        Engine.cameraHeight = cameraHeight;
        Engine.movespeed = 1;
        Engine.rotspeed = 1;
        Engine.camera = camera;

        let scene = new THREE.Scene();

        // Directional light
        let ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        // Point light
        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 20, 0);
        light.castShadow = true; // default false
        light.shadow.camera.left = -250; // Increase shadow camera width (left boundary)
        light.shadow.camera.right = 250; // Increase shadow camera width (right boundary)
        light.shadow.camera.top = 250; // Increase shadow camera height (top boundary)
        light.shadow.camera.bottom = -250; // Increase shadow camera height (bottom boundary)
        light.shadow.mapSize.width = 2096; // default 512
        light.shadow.mapSize.height = 2096; // default 512

        scene.add(light);

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

        // Load microscope.glb
        var gltfLoader = new Engine.GLTFLoader();
        gltfLoader.setPath('assets/');
        gltfLoader.load('microscope.glb', function (gltf) {
            Engine.microscope = gltf.scene;
            Engine.microscope.position.set(0, 0, -40.400000000000034);
            Engine.microscope.scale.set(20, 20, 20);

            Engine.microscope.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            Engine.microscope.rotation.set(0, -0.9299999999999998, 0);
            scene.add(Engine.microscope);
        });


        function loadSlideCanvas() {
            // let canvas = document.createElement('canvas');
            // let _canvas = document.querySelector('canvas');

            // canvas.width = _canvas.width;
            // canvas.height = _canvas.height;

            // let context = canvas.getContext('2d');
            // context.fillStyle = 'white';
            // context.fillRect(0, 0, canvas.width, canvas.height);
            // context.fillStyle = 'black';
            // context.font = '48px serif';
            // context.fillText('Slide 1', 100, 100);

            // canvas.style.position = 'absolute';
            // canvas.style.top = '0';
            // canvas.style.left = '0';
            // canvas.style.zIndex = '100';

            // document.body.appendChild(canvas);

            // do an iframe instead for /slides/1.html
            let iframe = document.createElement('iframe');
            iframe.src = 'https://rau.lol/orgm';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.zIndex = '100';
            iframe.style.border = 'none';
            document.body.appendChild(iframe);

        }


        Engine.scene = scene;
        Engine.load();
        Engine.run();

        document.body.addEventListener('mousedown', function () {

            // Initial t value
            let t = 0;
            const delta = 0.005; // Incremental change in t
            Engine.customFunctions.preAnimation.push({
                func: function () {

                    if (t >= 1) {
                        // t = 0; // Assuming this is commented out because the track should not reset to the start
                        Engine.stop();
                        loadSlideCanvas();
                    } else {
                        t += delta;
                    }

                    t = Math.min(1, Math.max(0, t));

                    let position = track.getPointAt(t);
                    let direction = track.getTangentAt(t);

                    camera.position.copy(position);
                    let targetRotation = new THREE.Euler(-1.1156144578747755, -6.324999999999996, 0);
                    let targetQuaternion = new THREE.Quaternion().setFromEuler(targetRotation);
                    camera.quaternion.slerp(targetQuaternion, delta);

                }
            });
        });
    };


})();