var Module = {
  initialized: false,
  c_kv_data: {},
  canvas: (function () { return document.getElementById('canvas'); })(),
  
  onRuntimeInitialized: function () {
    window.addEventListener('contextmenu', event => event.preventDefault());
    console.log("Runtime initialized");
  }
}