// Immediately Invoked Function Expression (IIFE) to encapsulate the library
(function () {
    // Your library code goes here

    if (!Engine) {
        console.error("Engine not loaded");
        return;
    }

    // Define your library object
    var Objects = {};
    Objects.load = function () {
    };

    Objects.add_object = function(type = null, x, y, z, w, h, d, color, texture, scale, shape = "box", add=true) {
        
        let obj = 1;
        let geometry;
        if (texture) {

            // Create a new texture loader
            const loader = new THREE.TextureLoader();
            depth = d;
            height = h;
            scaleY = h / height;
            scaleX = d / depth;
            // scale = 1;

            let object;
            
            if (shape == 'sphere') {
                // 	//console.log('sphere')L
                // 	geometry = new THREE.SphereGeometry( 10, 20, 20 );
                // }

                let geometry = new THREE.SphereGeometry(w, 20, 20);
                
                let material;
                object = new THREE.Mesh(geometry, material);
                //console.log(object)

                groundTexture = loader.load(texture);
                // Create a new material using the loaded texture
                groundTexture.rotation = Math.PI*3/2;
                material = new THREE.MeshStandardMaterial({ 
                    map: groundTexture,
                    side: THREE.DoubleSide
                 });
                
                material.map.wrapS = THREE.RepeatWrapping;
                material.map.wrapT = THREE.RepeatWrapping;
                material.map.repeat.set(scale.x, scale.y);

                object.material = material;
                // Set the texture repeat factor based on the scale
                // texture.repeat.set(scaleX, scaleY);

                // Create the mesh with the material and geometry

                // Set the position of the object
                object.position.set(x, y, z);

                if(add) {
                    // Add the object to the scene
                    console.log("adding object", type)
                    Engine.scene.add(object);
                }
                return object;
            }

            else if (shape == "box") {
                const geometry = new THREE.BoxGeometry(w, h, d);

                let material;
                object = new THREE.Mesh(geometry, material);

                //console.log(object)

                groundTexture = loader.load(texture);
                // Create a new material using the loaded texture
                groundTexture.rotation = Math.PI*3/2;
                material = new THREE.MeshStandardMaterial({ 
                    map: groundTexture,
                    side: THREE.DoubleSide
                 });
                
                material.map.wrapS = THREE.RepeatWrapping;
                material.map.wrapT = THREE.RepeatWrapping;
                material.map.repeat.set(scale.x, scale.y);

                object.material = material;
                // Set the texture repeat factor based on the scale
                // texture.repeat.set(scaleX, scaleY);

                // Create the mesh with the material and geometry

                // Set the position of the object
                object.position.set(x, y, z);

                if(add) {
                    // Add the object to the scene
                    console.log("adding object", type)
                    Engine.scene.add(object);
                }
                return object;
            }
            
            else if (shape == "cylinder") {
                const geometry = new THREE.CylinderGeometry(w, h, d, 32);
                material = new THREE.MeshStandardMaterial({ color: color });
                object = new THREE.Mesh(geometry, material);
                object.receiveShadow = true;

                //console.log(object)

                groundTexture = loader.load(texture);
                // Create a new material using the loaded texture
                groundTexture.rotation = Math.PI*3/2;
                material = new THREE.MeshStandardMaterial({ 
                    map: groundTexture,
                    side: THREE.DoubleSide
                });

                material.map.wrapS = THREE.RepeatWrapping;
                material.map.wrapT = THREE.RepeatWrapping;
                material.map.repeat.set(scale.x, scale.y);

                object.material = material;
                object.position.set(x, y, z);

                if(add)
                    // Add the object to the scene
                    Engine.scene.add(object);

                return object;

            }

            object.name = type;


        }
        else {
            if(shape == 'box') {
            	geometry = new THREE.BoxGeometry(w, h, d);
            }
            else if(shape == 'sphere') {
                geometry = new THREE.SphereGeometry(w, 32, 32);
            }
            else if(shape == 'cylinder') {
                geometry = new THREE.CylinderGeometry(w, h, d, 32);
            }


            let material = new THREE.MeshStandardMaterial({ 
                color: color,
                wireframe: false,
                side: THREE.DoubleSide,

            });
            object = new THREE.Mesh(geometry, material);

            object.position.x = x;
            object.position.y = y;
            object.position.z = z;
            object.name = type;

            if(add)
                Engine.scene.add(object);
        }

        return object;
    }

    // Attach your library to the global scope
    if (typeof window !== 'undefined') {
        window.Objects = Objects;
    } else if (typeof global !== 'undefined') {
        global.Objects = Objects;
    }

    //console.log("Objects loaded");
})();
