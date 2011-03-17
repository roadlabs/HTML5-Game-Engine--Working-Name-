/*
 * File Name: Main.js
 * Date Written: February 28, 2011
 * Date Last Updated: March 16, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Implementations: Main.Constant.js,
 *   Main.Default.js, Main.Browser.js,
 *   Main.Loader.Script.js, Main.Loader.Image.js,
 *   Main.OS.js, Map.js, Player.js
 */

// This is the primary class that will be used by the library. It is a
// singleton that defines some globally-important functions, constants,
// methods, and variables.

var Main = {

   /*
    * Implementations of various, useful variables and pseudo-properties
    * for the Main class. Only Main.Preloader and Main.$ are defined here.
    */

  initialization_time : null, // The time at which Main was initialized.
  game_start_time     : null, // The time the game loop was started.

  // Read-only.

  // Time accessors. Made as accessors simply to make them read-only.
  get time()         { return (new Date()).getTime();             },
  get init_time()    { return this.initialization_time.getTime(); },
  get start_time()   { return this.game_start_time.getTime();     },
  get elapsed_time() { return this.time - this.init_time;         },
  get real_time()    { return this.time - this.start_time         }, // The number of milliseconds since the game began.
  get game_time()    { /* ... */                                  }, // The game time, which is going to be greater than
                                                                     // or equal to real_time. This value depends on the
                                                                     // latency of the game.

  get directory()
  {
    var path = window.location.href.split("/");
    path.length --;
    return path.join("/") + "/";
  },

  // These return the size, in pixels, of the window's height and width.
  get PageWidth()  { return window.innerWidth  || document.documentElement.clientWidth  || document.getElementsByTagName("body")[0].clientWidth;  },
  get PageHeight() { return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagNAme("body")[0].clientHeight; },

  // User-written.
  onready : null,

  // The Init function, used for initialization. By default, called by window.onload.
  Init : function ()
  {
    this.initialization_time = new Date();
    this.Preloader.LoadFirstFiles();
  },

  /* 
   * Inner class implementations. Many of the following are implemented
   * in different files. 
   */

  // Implements globally-necessarily constants. This is implemented in
  // the Main.Constant.js file.
  Constant : null,

  // This is a selection of default implementations of various functions
  // that can be used by classes to quickly implement actions. It is
  // implemented in the Main.Default.js file.
  Default : null,

  // This is used to detect browser information, such as the browser name,
  // rendering engine, and version. This is implemented in the file
  // Main.Browser.js.
  Browser : null,

  // Used to determine the user's operating system and version. Most useful
  // for distinguishing between mobile and desktop devices. This is implemented
  // in Main.OS.js
  OS : null,

  // This is used to implement four dynamic-content loaders, for Javascript
  // scripts, CSS stylesheets, images, and sound.

  Loader : {
    Script : null,     // Implemented in Main.Loader.Script.js.
    Stylesheet : null, // Implemented in Main.Loader.Stylesheet.js.
    Image : null,      // Implemented in Main.Loader.Image.js
    Sound : null       // Implemented in Main.Loader.Sound.js
  },

  // Used to access storage systems. Both are user-defined, and are simply
  // here to allow for a central way to access them. Local would presumably
  // use the localStorage feature of HTML5, and Server would make use of a
  // server to store and update information, either through AJAX queries or
  // through sockets.
  Storage : {
    Local  : null,
    Server : null
  },

  // WebSockets to connect to a server.
  Socket : null,

  Classes : { }, // Allows for an implementation of specific classes. This is
                 // expanded upon in various other files. It's made an object
                 // for simplicity.

  // This indicates files that are to be loaded when the page is finished
  // loading. By default, the Loader.Script class and the Constant class
  // are *always* loaded first, and then the Loader.Script class are used
  // to load the other classes. Main.Constant is included because the
  // Loader.Script classes make use of some constants defined there.

  Preloader : {
    /*
     * Preloader variables and constant arrays.
     */

    // Scripts that will be loaded in the LoadBasicFiles function.
    _Load_First : ["$_Main_Constants",
                   "$_Main_Loader_Script",
                   "$_Main_Loader_Script_QueueObject"
                  ],

    // A list of things to ignore, for the LoadBasicFiles and LoadOtherFiles
    // functions. These are things that are not scripts.
    _Ignore : ["_Load_First", "_Ignore", "LoadFirstFiles", "LoadOtherFiles", "timeout"],

    // Wait 5 seconds until it considers a timeout.
    timeout : 5000,

    /*
     * Files to be loaded.
     */

    // The three basic files needed.

    $_Main_Constants                 : "Main.Extensions/Main.Constant.js",

    $_Main_Loader_Script             : "Main.Extensions/Loader/Script/Main.Loader.Script.js",
    $_Main_Loader_Script_QueueObject : "Main.Extensions/Loader/Script/Main.Loader.Script.QueueObject.js",

    // Some other files that will also be loaded.

    $_Main_Browser                  : "Main.Extensions/Main.Browser.js",
    $_Main_Loader_Image             : "Main.Extensions/Loader/Image/Main.Loader.Image.js",
    $_Main_Classes_Map              : "Main.Classes/Map/Map.js",
    $_Main_Classes_Player           : "Main.Classes/Player/Player.js",

    // The basic functions used by the Preloader.

    LoadFirstFiles : function ()
    // This is used to to load the files listed in _Load_First, as they are the most
    // important ones to the functioning of the rest of the library.
    {
      // Get the <head> element of the document. This is where new script elements will
      // be placed.
      var head = document.getElementsByTagName("head")[0]; // The head elements

      var loaded_scripts = 0; // Stores the number of loaded scripts.
      function OnScriptLoad()
      // This will be the function assigned to the onload property of
      // the <script> elements.
      {
        if((loaded_scripts != -1) && ((++ loaded_scripts) >= 3))
          this.LoadOtherFiles();
      }

      OnScriptLoad_binded = OnScriptLoad.bind(this);

      for(var i in this)
      {
        if(this._Load_First.indexOf(i) != -1)
        // Load all the files indicated by _Load_First.
        {
          // Create the element and set its variables.
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.onload = OnScriptLoad_binded;
          script.src = this[i];

          // Now load it.
          head.appendChild(script);
        }
      }

      setTimeout( function ()
        // If it times out, then an exception is thrown. All files *must* be
        // loaded in order to continue, as they are essential.
        {
          if(loaded_scripts < 3)
          {
            loaded_scripts = -1;
            alert("FAILED TO LOAD SOME FILES"); // Change to throw an exception at some point.
          }
        }, this.timeout);
    },

    LoadOtherFiles : function ()
    // This is used to load the rest of the files, the ones not specified in _Load_First.
    // This is separated, as it makes use of the Main.Loader.Script class, which makes it
    // easier to load new files.
    {
      Main.Loader.Script.oncomplete = function () {
        // Once the files have finished loading, Main.onready will be called, if
        // it is defined. Additionally, Main.Loader.Script.oncomplete will be called
        // so that Main.onready will not be called additional times if new files are
        // loaded.
        if(Main.onready)
          Main.onready();

        Main.Loader.Script.oncomplete = null;
      };

      for(var i in this)
      // Look through the variables defined for Main.Preloader. If they are not in
      // the _Ignore array and not in the _Load_First array, then begin loading
      // them.
      {
        if((this._Ignore.indexOf(i) != -1) || (this._Load_First.indexOf(i) != -1))
          continue;

        Main.Loader.Script.Queue(this[i]);
      }

      // Once all the files have been queued up, being processing them.
      Main.Loader.Script.Process();
    }
  },

  // This includes functions to bind new functions and variables to
  // classes, as well as extend classes with class instances with other
  // objects.
  $ : {

    Variable : function (object, name, value)
    // This takes an object and binds are new variable to it.
    {
      if((object instanceof Object) && ((typeof name) == "string"))
      {
        if((typeof value) == "undefined")
          value = null;

        object[name] = value;
        return true;
      }

      return false;
    },

    Function : function (object, name, func)
    // This takes an object and binds a new function to it.
    {
      if((object instanceof Object) && ((typeof name) == "string") && (func instanceof Function))
      {
        object[name] = func;
        return true;
      }

      return false;
    },

    Extend : function (object, extendor)
    // This takes two arguments: object is an already-extant object, and extendor
    // is either a class definition or another, already-extant object. The properties
    // of extendor will be added to object. Note that only the values of
    // extendor.prototype can be added to object if it is a function (class definition).
    {
      if((object instanceof Object) && (extendor instanceof Object))
      {
        var j = false;
        for(var i in extendor)
        {
          if(i != "prototype")
          {
            object[i] = extendor[i];
            j = true;
          }
        }

        for(var i in extendor.prototype)
        {
          object[i] = extendor.prototype[i];
          j = true;
        }

        return j;
      }

      return false;
    }
  },

  /*
   * Miscellaneous class functions.
   */

  includes : function (file, callback)
  // This indicates a file to load upon the loading of another file.
  {
    if(!this.Loader.Script)
      return null;

    var QueueObject = this.Loader.Script.Queue(file);
    QueueObject.onload = callback;

    this.Loader.Script.Process(QueueObject);  
  },

  onfileload : function (f)
  // Places this at the bottom of a file to be loaded. When it is
  // reached, the function f will be processed. This is good for some
  // startup or maintenance code that needs to be run for that
  // particular file.
  {
    if(f instanceof Function)
      return f.call();

    return null;
  }
}

// Creates the bind function if it is currently unsupported. Taken from
// Mozilla Docs.
if ( !Function.prototype.bind ) {
  Function.prototype.bind = function( obj ) {
    var slice = [].slice,
      args = slice.call(arguments, 1), 
      self = this, 
      nop = function () {}, 
      bound = function () {
        return self.apply( this instanceof nop ? this : ( obj || {} ), 
                           args.concat( slice.call(arguments) ) );    
        };

    nop.prototype = self.prototype;

    bound.prototype = new nop();
    return bound;
  };
}

if(((typeof $_NO_INITIALIZE_ON_WINDOW_ONLOAD) == "undefined") || !$_NO_INITIALIZE_ON_WINDOW_ONLOAD)
// If the variable $_NO_BEGIN_ON_WINDOW_ONLOAD is defined, then
// window.onload will not automatically be set to begin Main.Init.
// Otherwise, once the document loads, Main.Init will be called. This
// is to allow something like jQuery to use $(document).ready() if the
// user wants to. If this is the case, then Main.Init will have to be
// called manually.
{
  window.onload = Main.Init.bind(Main);
}