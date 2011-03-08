/*
 * File Name: Main.Loader.ScriptQueue.js
 * Date Written: March 2, 2011
 * Date Last Updated: March 3, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Extends: Main.Loader.Script.js
 * Dependencies: Main.Loader.Script.js,
 *   Main.Constant.js
 */

Main.Loader.Script.QueueObject = function (src)
{
  this.src = src;
  this.timeout = this.Master.timeout;
}

Main.Loader.Script.QueueObject.prototype = {

  onload : null,
  ontimeout : null,

  // Alias of Main.Loader.Script.
  get Master()  { return Main.Loader.Script;  },

  /*
   * The basic variables of the object.
   */

  src : null,
  timeout : 7500,
  state : Main.Constant.LOAD.NONE,
  script : null,

  // Read-only pseudo-properties that relate to the state variable.

  get processing() { return this.state == Main.Constant.LOAD.PROCESSING; },
  get loaded()     { return this.state == Main.Constant.LOAD.LOADED;     },
  get timedout()   { return this.state == Main.Constant.LOAD.TIME_OUT;   },

  // Multi-property checker. Indicates if the script has finished processing,
  // meaning either it loaded or it timed out.
  get processed()  { return (this.loaded || this.timedout);              },

  /*
   * The class functions for Main.Loader.Script.QueueObject.
   */

  Load : function ()
  // The Load function creates a new <script> element with the relevant data for
  // the script to be loaded, and then attempts to load it. If it loads successfully,
  // the onload function is called. If not, the ontimeout function is called.
  {
    this.state = Main.Constant.LOAD.PROCESSING; // The element is now being processed.

    var _this = this; // To keep the local object in accessible.
    var head = document.getElementsByTagName("head")[0];

    // Create the script element and load the relevant variables for it.

    this.script = document.createElement("script");
    this.script.type = "text/javascript";
    this.script.src = this.src;

    // Upon loading, the this.onload function will be called, in addition to the
    // Processed function.
    this.script.onload = function ()
    {
      if(!_this.timedout)
      {
        if(_this.onload)
          _this.onload(_this.src);
        _this.Processed(Main.Constant.LOAD.LOADED);
      }
    }

    // Fuckin' IE.
    this.script.onreadystatechange = function ()
    {
      if(!_this.timedout && !_this.loaded && ((_this.readyState == "loaded") || (_this.readyState == "complete")))
      {
        if(_this.onload)
          _this.onload(_this.src);
        _this.Processed(Main.Constant.LOAD.LOADED);
      }
    }

    // Now attempt to load the script.
    head.appendChild(this.script);

    // If the file failed to load within the timeout period, then we're going to
    // assume that, for whatever reason, the file can not be loaded and it timed
    // out. Upon timeout, the <script> element will be removed, and the file will
    // be unable to load at all.

    if(this.timeout > 0)
    {
      setTimeout( function ()
        {
          if(!_this.loaded)
          {
            if(_this.ontimeout)
              _this.ontimeout(_this.src);
            _this.Processed(Main.Constant.LOAD.TIME_OUT);
          }
        }, this.timeout);
    }

    return true; // The Load function was successfully called..
  },

  Processed : function (state)
  // This changes the value of the state variable, and then called the Master's
  // onload or ontimeout functions. After that, the Master's Processed function
  // is called, which will be used to determine if the Master's oncomplete function
  // should be called.
  {
    this.state = state;

    if(this.loaded && this.Master.onload)
      this.Master.onload(this);
    if(this.timedout && this.Master.ontimeout)
    {
      // If it timed out, remove the <script> element from the DOM.
      document.getElementsByTagName("head")[0].removeChild(this.script);
      this.Master.ontimeout(this);
    }

    this.Master.Processed();
  }
}