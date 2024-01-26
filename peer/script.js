var Module = {
  initialized: false,
  c_kv_data: {},
  canvas: (function () { return document.getElementById('canvas'); })(),
  start: function () {
      console.log("Starting...");
      Module.load_peerjs();
  },
  onRuntimeInitialized: function () {
    // window.addEventListener('contextmenu', event => event.preventDefault());
    console.log("Runtime initialized");

    Module.start();
  },
  setkv: function (key, value) {
    Module.c_kv_data[key] = value;

    if (!Object.keys(Module.c_kv_data).includes(key)) {
      Module.c_kv_data[key] = value;
    }
  },
  js_to_c: function (str) {
    if (typeof str === 'object') {
      str = JSON.stringify(str);
    }
    var strPtr = Module._malloc(str.length + 1);
    Module.stringToUTF8(str, strPtr, str.length + 1);
    Module._load_json(strPtr);
    Module._free(strPtr);
  },

  hashid: function (str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },
  load_peerjs: function () {
    // Check for saved ID
    const savedId = localStorage.getItem('peerId');

    const peer = new Peer(savedId || null);
    var lastPeerId = null;

    peer.on('open', id => {
      // Save new ID if not retrieved from localStorage
      if (!savedId) {
        localStorage.setItem('peerId', id);
      }

      // Display peer ID on the page
      document.getElementById('peerIdDisplay').textContent = `My peer ID is: ${id}`;

      // Ready to connect
      console.log(`My peer ID is: ${id}`);

      // Pass data into C
      // peer, id, x, y, r, g, b, a, width, height

      let data = {
        peer: "join",
        id: Module.hashid(conn.peer),
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
        a: 255,
        width: Math.floor(Math.random() * 100) + 10,
        height: Math.floor(Math.random() * 100) + 10,
      };

      Module.js_to_c(data);
    });

    // Example connection to another peer
    const anotherPeerId = 'target-peer-id';
    const conn = peer.connect(anotherPeerId);

    conn.on('open', () => {
      conn.send('hi!');
    });

    // Receiving connections
    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        // Display received message on the page
        const messagesDiv = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = `Message from ${conn.peer}: ${data}`;
        messagesDiv.appendChild(messageElement);

        console.log('Received', data);

        // Pass data into C
        // peer, id, x, y, r, g, b, a, width, height
        let _data = {
          peer: "join",
          id: Module.hashid(conn.peer),
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100),
          r: Math.floor(Math.random() * 255),
          g: Math.floor(Math.random() * 255),
          b: Math.floor(Math.random() * 255),
          a: 255,
          width: Math.floor(Math.random() * 100) + 10,
          height: Math.floor(Math.random() * 100) + 10,
        };

        Module.js_to_c(_data);
      });
    });

    // Connect to ID
    document.getElementById('connectToIdButton').addEventListener('click', () => {
      const connectToId = document.getElementById('connectToId').value;
      const conn = peer.connect(connectToId);

      conn.on('open', () => {
        lastPeerId = connectToId;
        conn.send('hiw!');
      });
    });

    // Send message
    document.getElementById('sendMessageButton').addEventListener('click', () => {
      const messageToSend = document.getElementById('messageToSend').value;
      const connectToId = lastPeerId;
      const conn = peer.connect(connectToId);

      conn.on('open', () => {
        conn.send(messageToSend);
      });
    });

    // Log errors
    peer.on('error', (err) => {
      console.error(err);
    });

    // Close connection
    conn.on('close', () => {
      console.log('Connection closed');
    });

  },

}