var Module = {
  initialized: false,
  c_kv_data: {},
  canvas: (function () { return document.getElementById('canvas'); })(),
  sound_playing: false,
  tile_sound_enabled: false,
  mobile: false,
  socket: null,
  ws: null,
  kvdata_titles: [
    "GlobalX", "GlobalY", "TileGX", "TileGY",
    "XOffset", "YOffset", "XMod", "YMod",
    "SizeX", "SizeY", "ScaledSizeX", "ScaledSizeY", "Tile Size"
  ],
  onRuntimeInitialized: function () {
    window.addEventListener('contextmenu', event => event.preventDefault());
    console.log("Runtime initialized");

    Module.mobile = Module.ismobile();
    Module.ws_connect();

    let url_params = new URLSearchParams(window.location.search);
    // if scene is specified in url, load it
    let fetch_path = 'scene2.json';
    if (url_params.has("scene")) {
      fetch_path = url_params.get("scene") + ".json";
    }
    fetch(`page/${fetch_path}?${Math.random()}`)
      .then(res=>res.json())
      .then(json=>{
        Module.js_to_c(JSON.stringify(json));
      })
  },
  ismobile: function () {
    return /Mobi/i.test(navigator.userAgent);
  },
  setkv: function (key, value) {
    Module.c_kv_data[key] = value;

    if (!Object.keys(Module.c_kv_data).includes(key)) {
      Module.c_kv_data[key] = value;
    }
  },

  reui: function () {
    var ui_data = document.querySelector('#data');
    ui_data.innerHTML = "";
    for (var key in Module.c_kv_data) {
      var value = Module.c_kv_data[key];
      let el = document.createElement('div');
      el.className = "data";
      el.innerHTML = `${Module.kvdata_titles[parseInt(key) - 1]}: ${value}`;
      ui_data.appendChild(el);
    }
  },

  refresh: function () {
    window.location.reload();
  },
  ws_connect: function () {
    async function websocket(url) {
      Module.ws = new WebSocket(url)

      if (!Module.ws) {
        throw new Error("server didn't accept ws")
      }

      Module.ws.onopen = function (event) {
        console.log("Connected to the WebSocket server");
      }

      Module.ws.onmessage = function (event) {
        let msg = JSON.parse(event.data);
        console.log(msg);

      };

      Module.ws.onclose = function (event) {
        console.log("Disconnected from the WebSocket server");
      };

      Module.ws.onerror = function (event) {
        console.log("Error with the WebSocket connection: " + event);
      };
    }

    websocket('wss://ws.rau-6fb.workers.dev')
  },

  ws_emit: function (msg) {
    if (typeof (msg) != "string") {
      msg = JSON.stringify(msg);
    }
    console.log(msg)
    Module.ws.send(msg);
  },

  js_to_c: function (str) {
    var strPtr = Module._malloc(str.length + 1);
    Module.stringToUTF8(str, strPtr, str.length + 1);
    Module._js_test(strPtr);
    Module._free(strPtr);
  },

}