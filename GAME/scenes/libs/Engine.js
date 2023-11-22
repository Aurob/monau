
// Immediately Invoked Function Expression (IIFE) to encapsulate the library
(function () {
    var Engine = {};
    Engine.THREE = THREE;
    console.log(THREE)

    var keyboard = {};
    Engine.keyboard = keyboard;
    Engine.scrollDelta = 0;
    Engine.initialized = false;

    Engine.renderer, Engine.camera, Engine.scene;
    Engine.movespeed = .5, Engine.rotspeed = 1.4;
    Engine.unpausedUpdates = [];
    Engine.pausedUpdates = [];
    Engine.autoWalk = false;
    Engine.gravity = -9.8;
    Engine.lastTime = 0;
    Engine.deltaTime = 0;

    Engine.last_pos = null;
    Engine.onMesh = null;
    Engine.started = false;

    THREE.PerspectiveCamera.prototype.setRotateX = function (deg) {
        // if ( typeof( deg ) == 'number' && parseInt( deg ) == deg ){
        this.rotation.x = deg * (Math.PI / 180);
        // }
    };
    THREE.PerspectiveCamera.prototype.setRotateY = function (deg) {
        // if ( typeof( deg ) == 'number' && parseInt( deg ) == deg ){
        this.rotation.y = deg * (Math.PI / 180);
        // }
    };
    THREE.PerspectiveCamera.prototype.setRotateZ = function (deg) {
        if (typeof (deg) == 'number' && parseInt(deg) == deg) {
            this.rotation.z = deg * (Math.PI / 180);
        }
    };
    THREE.PerspectiveCamera.prototype.getRotateX = function () {
        return Math.round(this.rotation.x * (180 / Math.PI));
    };
    THREE.PerspectiveCamera.prototype.getRotateY = function () {
        return this.rotation.y * (180 / Math.PI);
    };
    THREE.PerspectiveCamera.prototype.getRotateZ = function () {
        return Math.round(this.rotation.z * (180 / Math.PI));
    };
    Engine.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    var paused = false;

    var keydown = function (event) {
        keyboard[event.keyCode] = true;
        // actionEvents();
    };

    var keyup = function (event) {
        keyboard[event.keyCode] = false;
    };

    var scroll = function (event) {
        Engine.scrollDelta = event.deltaY;
    };

    var actionEvents = function () {

    }

    var movementEvents = function () {

        var direction = Engine.camera.getWorldDirection(new THREE.Vector3());

        if (keyboard[87]) {
            // W
            Engine.camera.position.x += direction.x * Engine.movespeed;
            Engine.camera.position.z += direction.z * Engine.movespeed;
        }


        if (keyboard[83]) {
            // S
            Engine.camera.position.x -= direction.x * Engine.movespeed;
            Engine.camera.position.z -= direction.z * Engine.movespeed;
        }

        if (keyboard[65]) {
            // A turns left
            Engine.camera.setRotateY(Engine.camera.getRotateY() + Engine.rotspeed);
        }

        if (keyboard[68]) {
            // D turns right
            Engine.camera.setRotateY(Engine.camera.getRotateY() - Engine.rotspeed);
        }

        // Q and E
        if (keyboard[69]) {
            Engine.camera.setRotateX(Engine.camera.getRotateX() - Engine.rotspeed/2);
        }

        if (keyboard[81]) {
            Engine.camera.setRotateX(Engine.camera.getRotateX() + Engine.rotspeed/4);
        }

        if (Engine.scrollDelta) {
            Engine.camera.setRotateX(Engine.camera.getRotateX() - Engine.rotspeed * Engine.scrollDelta / 100);
            Engine.scrollDelta = 0;
        }

    }

    Engine.load = function () {

        // Renderer
        Engine.renderer = new THREE.WebGLRenderer();
        
        // Set the pixel ratio for high-density displays
        Engine.renderer.setPixelRatio(window.devicePixelRatio);


        Engine.renderer.setSize(window.innerWidth, window.innerHeight);
        Engine.renderer.shadowMap.enabled = true;
        Engine.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.body.appendChild(Engine.renderer.domElement);

        // Add event listener for keyboard input
        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);
        window.addEventListener('wheel', scroll);
        
        Engine.initialized = true;
    }

    function animate() {

        Engine.preAnimation();
        requestAnimationFrame(animate);

        
        Engine.preEvents();
        actionEvents();
        Engine.postEvents();
 
        if (!paused) {

            Engine.preMovement();

            Engine.deltaTime = Date.now() - Engine.lastTime;
            Engine.lastTime = Date.now();

            Engine.movement();
        }

        Engine.preRender();
        Engine.renderer.render(Engine.scene, Engine.camera);
    };

    Engine.customFunctions = {
        preAnimation: [],
        preEvents: [],
        postEvents: [],
        preMovement: [],
        movement: [{ func:movementEvents}],
        preRender: []
    };

    Engine.preAnimation = function () {};
    Engine.preEvents = function () {};
    Engine.postEvents = function () {
        Engine.customFunctions.postEvents.forEach(f => {
            let args = f.args || [];
            f.func(...args);

        });
    };
    Engine.preMovement = function () {};
    Engine.movement = function () {
        Engine.customFunctions.movement.forEach(f => {
            let args = f.args || [];
            f.func(...args);
            
        });
    };

    Engine.preRender = function () {};


    Engine.run = function () {
        animate();
    };


    // Attach your library to the global scope
    if (typeof window !== 'undefined') {
        window.Engine = Engine;
    } else if (typeof global !== 'undefined') {
        global.Engine = Engine;
    }

})();