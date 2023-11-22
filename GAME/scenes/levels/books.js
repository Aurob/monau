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

    Level.add_book = function(x, y, z, w, h, d, color = 0xffffff, boxMaterial = null, textGeometry, textMaterial) {
        // Create a box
        var boxGeometry = new THREE.BoxGeometry(w, h, d);
        if (boxMaterial == null) {
            var boxMaterial = new THREE.MeshBasicMaterial({ color: color });
        }
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = x - w;
        box.position.y = y - h;
        box.position.z = z - d;
        box.objType = 'book';
        Engine.scene.add(box);

        // if(!font) return box;

        var text = new THREE.Mesh(textGeometry, textMaterial);

        // Scale the text down based on the computed width
        textGeometry.computeBoundingBox();
        // var textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        // text.scale.set(textScale, textScale, textScale);


        // text.scale.set(d, h, w);
        text.scale.x = w * .5;
        text.scale.y = h / 14;
        text.scale.z = d;


        text.position.x = x - (w * 1.2);
        text.position.y = y - (h * 1.4);
        text.position.z = (-z - d / 2) - .001;
        Engine.scene.add(text);


        return box;
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
        let grid = new THREE.GridHelper(100, 100, 0x000000, 0x000000);
        grid.material.opacity = 1;
        grid.material.transparent = true;
        scene.add(grid);



        ////////////////////////////
        let sections = 10;
        let minbookw = .25;
        let maxbookw = .4;
        let minbookd = .75;
        let maxbookd = 1;
        let sw = 1;
        let sw_remaining = sw * sections;
        let sh = 1;
        let sh_remaining = sh * sections;
        let startx = 0;
        let starty = 1;
        let i = 0;
        let hovered_book = null;
        let last_hb = null;

        // Create a plane
        var planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        var planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.x = 5
        plane.position.y = 5;
        scene.add(plane);

        // Create a plane for each shelf
        for (let i = 0; i < sections; i++) {
            let _plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 1, 10, 10), planeMaterial);
            _plane.position.x = 5
            _plane.position.y = (i * 1);
            _plane.position.z = -.5;
            _plane.rotateX(Math.PI / 2);
            scene.add(_plane);
        }

        var loader = new THREE.FontLoader();

        // Add text to the front of the box
        console.log( Engine.font);
        var textGeometry = new THREE.TextGeometry('Ubik | Philip K. Dick', {
            font: Engine.font,
            size: 1,
            height: .01,
        });

        textGeometry.rotateZ(-Math.PI / 2);
        textGeometry.rotateX(Math.PI);
        var textMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

        let first_box = Level.add_book(0, 0, 0, 1, .2, 1, null, null, textGeometry, textMaterial);
        // const mergedGeometry = new THREE.BufferGeometry()
        var mesh = new THREE.InstancedMesh(first_box.geometry, first_box.material, sections*sections);
        // var test_geo = new THREE.BoxGeometry(10, 10, 10);
        // var test_mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        // var mesh = new THREE.InstancedMesh(test_geo, test_mat, sections*sections);

        var boxes = {}
        while (true) {
            let w = (Math.random() * (maxbookw - minbookw) + minbookw) - .1;
            if (i % 2 == 0)
                w = .05 + Math.random() * .2;

            let h = 1;
            let d = (Math.random() * (maxbookd - minbookd) + minbookd) - .1;
            if (w > sw_remaining) {
                w = sw_remaining;
            }
            // create the books each section
            let color = Math.floor(Math.random() * 16777215);
            let x = (startx + w / 2);
            let y = (starty + h / 2);
            let z = d / 2;

            let box;
            if (i % 2 == 0) {
                let box = {
                    x: x,
                    y: y,
                    z: z,
                    w: w,
                    h: h,
                    d: d,
                    color: color,
                };
                boxes[i] = box;
            }
            sw_remaining -= w;
            startx += w;

            // console.log(w, sw_remaining, color)
            if (sw_remaining <= 0) {
                sw_remaining = sw * sections;
                startx = 0;
                starty += h;
                i++;
            }

            if (starty > sh * sections) {
                break;
            }

            i++;

        }

        for(let i = 0; i < sections; i++) {
            for(let j = 0; j < sections; j++) {
                let box = boxes[i];
                if(!box) continue;
                console.log(box)
                let x = box.x;
                let y = box.y;
                let z = box.z;
                let w = box.w;
                let h = box.h;
                let d = box.d;
                let color = box.color;

                const matrix = new THREE.Matrix4();
                matrix.setPosition(x, y, z);
                

                mesh.setMatrixAt(i * (sections*sections) + j, matrix);
                mesh.instanceMatrix.needsUpdate = true;
                mesh.frustumCulled = false;
                mesh.instanceMatrix.needsUpdate = true;
                Engine.scene.add(mesh);
            }
        }
        mesh.material.vertexColors = true;
        
        // update mesh
        mesh.instanceMatrix.needsUpdate = true;
        mesh.frustumCulled = false;
        mesh.instanceMatrix.needsUpdate = true;
        scene.add(mesh);

        ////////////////////////////

    };


})();