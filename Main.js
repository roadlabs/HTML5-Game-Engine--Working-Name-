/*
 * File Name: Main.js
 * Date Written: February 28, 2011.
 * Date Last Updated: March 2, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Implementations: Main.Constant.js,
 *   Main.Default.js, Main.Browser.js,
 *   Main.Loader.Script.js, Main.Loader.Image.js
 */

// This is the primary class that will be used by the library. It is a
// singleton that defines some globally-important functions, constants,
// methods, and variables.

var Main = {

   /*
    * Implementations of various, useful variables and pseudo-properties
    * for the Main class.
    */
    
  // Read-only.
  get directory()
  {
    var path = window.location.href.split("/");
    path.length --;
    return path.join("/") + "/";
  },

  // User-written.
  onready : null,

  /* 
   * Inner class implementations. The next three are actually implemented
   * in other files.
   */

  Init : function ()
  {
    this.Preloader.LoadBasicFiles();
  },

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

  // This is used to implement three dynamic-content loaders, for Javascript
  // scripts, images, and sound.

  Loader : {
    Script : null,     // Implemented in Main.Loader.Script.js.
    Stylesheet : null, // Implemented in Main.Loader.Stylesheet.js.
    Image : null,      // Implemented in Main.Loader.Image.js
    Sound : null       // Implemented in Main.Loader.Sound.js
  },

  // This indicates files that are to be loaded when the page is finished
  // loading. By default, the Loader.Script class and the Constant class
  // are *always* loaded first, and then the Loader.Script class are used
  // to load the other classes.

  Preloader : {
    // The three basic files needed.

    $_Main_Constants                 : "Main.Extensions/Main.Constant.js",
    $_Main_Loader_Script             : "Main.Extensions/Main.Loader.Script.js",
    $_Main_Loader_Script_QueueObject : "Main.Extensions/Main.Loader.Script.QueueObject.js",

    LoadBasicFiles : function ()
    {
      // First, we load the $Main_Constants, $_Main_Constants, $_Main_Loader_Script, and
      // $_Main_Loader_Script_QueueObject files, as they are the most important here.

      var head = document.getElementsByTagName("head")[0]; // The head element.
      var script_Constant = document.createElement("script");
      var script_Loader = document.createElement("script");
      var script_QueueObject = document.createElement("script");

      // Generic function we'll use for the OnLoad function of the above.
      // Now try and load the files.

      script_Constant.type = "text/javascript";
      script_Constant.onload = function () { alert("foo"); };
      script_Constant.url = this.$_Main_Constants;
      head.appendChild(script_Constant);

      script_Loader.type = "text/javascript";
      script_Loader.onload = null;
      script_Loader.url = this.$_Main_Loader_Script;
      head.appendChild(script_Loader);

      script_QueueObject.type = "text/javascript";
      script_QueueObject.id = "foo";
      script_QueueObject.onload = null;
      script_QueueObject.url = this.$_Main_Loader_Script_QueueObject;
      head.appendChild(script_QueueObject);

      // If, after five seconds, these haven't loaded, assume something has failed.

      setTimeout(function ()
        {
          alert(Main.Loader);
        }, 500);

      /*
      setTimeout( function ()
        {
          if(loaded < 3)
          {
            loaded = -1;
            alert("Files failed to load.");
          }
        }, 5000); */
    },

    LoadOtherFiles : function ()
    {
      if(Main.onready)
        Main.onready();
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
  }
}

if(((typeof $_NO_INITIALIZE_ON_WINDOW_ONLOAD) == "undefined") || $_NO_INITIALIZE_ON_WINDOW_ONLOAD)
// If the variable $_NO_BEGIN_ON_WINDOW_ONLOAD is defined, then
// window.onload will not automatically be set to begin Main.Init.
// Otherwise, once the document loads, Main.Init will be called. This
// is to allow something like jQuery to use $(document).ready() if the
// user wants to. If this is the case, then Main.Init will have to be
// called manually.
{
  window.onload = Main.Init.bind(Main);
}