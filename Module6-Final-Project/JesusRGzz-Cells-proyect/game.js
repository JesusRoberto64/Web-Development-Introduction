
var Module;

if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'game.data';
    var REMOTE_PACKAGE_BASE = 'game.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                              Module['locateFile'](REMOTE_PACKAGE_BASE) :
                              ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onload = function(event) {
        var packageData = xhr.response;
        callback(packageData);
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', 'hump-master', true, true);
Module['FS_createPath']('/hump-master', 'docs', true, true);
Module['FS_createPath']('/hump-master/docs', '_static', true, true);
Module['FS_createPath']('/hump-master', 'spec', true, true);
Module['FS_createPath']('/', 'loveblobs', true, true);
Module['FS_createPath']('/', 'maps', true, true);
Module['FS_createPath']('/', 'Simple-Tiled-Implementation-master', true, true);
Module['FS_createPath']('/Simple-Tiled-Implementation-master', '.vscode', true, true);
Module['FS_createPath']('/Simple-Tiled-Implementation-master', 'sti', true, true);
Module['FS_createPath']('/Simple-Tiled-Implementation-master/sti', 'plugins', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        Module['removeRunDependency']('fp ' + that.name);

        this.requests[this.name] = null;
      },
    };

        var files = metadata.files;
        for (i = 0; i < files.length; ++i) {
          new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio).open('GET', files[i].filename);
        }

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
        // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
        // (we may be allocating before malloc is ready, during startup).
        if (Module['SPLIT_MEMORY']) Module.printErr('warning: you should run the file packager with --no-heap-copy when SPLIT_MEMORY is used, otherwise copying into the heap may fail due to the splitting');
        var ptr = Module['getMemory'](byteArray.length);
        Module['HEAPU8'].set(byteArray, ptr);
        DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
  
          var files = metadata.files;
          for (i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }
              Module['removeRunDependency']('datafile_game.data');

    };
    Module['addRunDependency']('datafile_game.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

 }
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 129, "filename": "/conf.lua"}, {"audio": 0, "start": 129, "crunched": 0, "end": 1192, "filename": "/LICENSE"}, {"audio": 0, "start": 1192, "crunched": 0, "end": 8578, "filename": "/main.lua"}, {"audio": 0, "start": 8578, "crunched": 0, "end": 14645, "filename": "/hump-master/camera.lua"}, {"audio": 0, "start": 14645, "crunched": 0, "end": 17711, "filename": "/hump-master/class.lua"}, {"audio": 0, "start": 17711, "crunched": 0, "end": 21244, "filename": "/hump-master/gamestate.lua"}, {"audio": 0, "start": 21244, "crunched": 0, "end": 23463, "filename": "/hump-master/README.md"}, {"audio": 0, "start": 23463, "crunched": 0, "end": 26125, "filename": "/hump-master/signal.lua"}, {"audio": 0, "start": 26125, "crunched": 0, "end": 32658, "filename": "/hump-master/timer.lua"}, {"audio": 0, "start": 32658, "crunched": 0, "end": 36416, "filename": "/hump-master/vector-light.lua"}, {"audio": 0, "start": 36416, "crunched": 0, "end": 41935, "filename": "/hump-master/vector.lua"}, {"audio": 0, "start": 41935, "crunched": 0, "end": 56411, "filename": "/hump-master/docs/camera.rst"}, {"audio": 0, "start": 56411, "crunched": 0, "end": 65498, "filename": "/hump-master/docs/class.rst"}, {"audio": 0, "start": 65498, "crunched": 0, "end": 74834, "filename": "/hump-master/docs/conf.py"}, {"audio": 0, "start": 74834, "crunched": 0, "end": 83957, "filename": "/hump-master/docs/gamestate.rst"}, {"audio": 0, "start": 83957, "crunched": 0, "end": 85259, "filename": "/hump-master/docs/index.rst"}, {"audio": 0, "start": 85259, "crunched": 0, "end": 86564, "filename": "/hump-master/docs/license.rst"}, {"audio": 0, "start": 86564, "crunched": 0, "end": 93965, "filename": "/hump-master/docs/Makefile"}, {"audio": 0, "start": 93965, "crunched": 0, "end": 98421, "filename": "/hump-master/docs/signal.rst"}, {"audio": 0, "start": 98421, "crunched": 0, "end": 111241, "filename": "/hump-master/docs/timer.rst"}, {"audio": 0, "start": 111241, "crunched": 0, "end": 121587, "filename": "/hump-master/docs/vector-light.rst"}, {"audio": 0, "start": 121587, "crunched": 0, "end": 132393, "filename": "/hump-master/docs/vector.rst"}, {"audio": 0, "start": 132393, "crunched": 0, "end": 139367, "filename": "/hump-master/docs/_static/graph-tweens.js"}, {"audio": 0, "start": 139367, "crunched": 0, "end": 242203, "filename": "/hump-master/docs/_static/in-out-interpolators.png"}, {"audio": 0, "start": 242203, "crunched": 0, "end": 338967, "filename": "/hump-master/docs/_static/interpolators.png"}, {"audio": 0, "start": 338967, "crunched": 0, "end": 394443, "filename": "/hump-master/docs/_static/inv-interpolators.png"}, {"audio": 0, "start": 394443, "crunched": 0, "end": 407868, "filename": "/hump-master/docs/_static/vector-cross.png"}, {"audio": 0, "start": 407868, "crunched": 0, "end": 420974, "filename": "/hump-master/docs/_static/vector-mirrorOn.png"}, {"audio": 0, "start": 420974, "crunched": 0, "end": 434742, "filename": "/hump-master/docs/_static/vector-perpendicular.png"}, {"audio": 0, "start": 434742, "crunched": 0, "end": 464649, "filename": "/hump-master/docs/_static/vector-projectOn.png"}, {"audio": 0, "start": 464649, "crunched": 0, "end": 477331, "filename": "/hump-master/docs/_static/vector-rotated.png"}, {"audio": 0, "start": 477331, "crunched": 0, "end": 478960, "filename": "/hump-master/spec/timer_spec.lua"}, {"audio": 0, "start": 478960, "crunched": 0, "end": 479127, "filename": "/loveblobs/init.lua"}, {"audio": 0, "start": 479127, "crunched": 0, "end": 483220, "filename": "/loveblobs/softbody.lua"}, {"audio": 0, "start": 483220, "crunched": 0, "end": 489221, "filename": "/loveblobs/softsurface.lua"}, {"audio": 0, "start": 489221, "crunched": 0, "end": 490694, "filename": "/loveblobs/util.lua"}, {"audio": 0, "start": 490694, "crunched": 0, "end": 653001, "filename": "/maps/prueba..lua"}, {"audio": 0, "start": 653001, "crunched": 0, "end": 653238, "filename": "/maps/spr_Orbe_Morado_Magia_1.png"}, {"audio": 0, "start": 653238, "crunched": 0, "end": 661434, "filename": "/Simple-Tiled-Implementation-master/.DS_Store"}, {"audio": 0, "start": 661434, "crunched": 0, "end": 662736, "filename": "/Simple-Tiled-Implementation-master/LICENSE.md"}, {"audio": 0, "start": 662736, "crunched": 0, "end": 662815, "filename": "/Simple-Tiled-Implementation-master/.vscode/settings.json"}, {"audio": 0, "start": 662815, "crunched": 0, "end": 662995, "filename": "/Simple-Tiled-Implementation-master/.vscode/tasks.json"}, {"audio": 0, "start": 662995, "crunched": 0, "end": 664994, "filename": "/Simple-Tiled-Implementation-master/sti/graphics.lua"}, {"audio": 0, "start": 664994, "crunched": 0, "end": 702011, "filename": "/Simple-Tiled-Implementation-master/sti/init.lua"}, {"audio": 0, "start": 702011, "crunched": 0, "end": 706710, "filename": "/Simple-Tiled-Implementation-master/sti/utils.lua"}, {"audio": 0, "start": 706710, "crunched": 0, "end": 714628, "filename": "/Simple-Tiled-Implementation-master/sti/plugins/box2d.lua"}, {"audio": 0, "start": 714628, "crunched": 0, "end": 720235, "filename": "/Simple-Tiled-Implementation-master/sti/plugins/bump.lua"}], "remote_package_size": 720235, "package_uuid": "bdbf656a-50e2-4a12-8f23-6c62ee7cc88a"});

})();
