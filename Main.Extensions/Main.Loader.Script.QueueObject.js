/*
 * File Name: Main.Loader.ScriptQueue.js
 * Date Written: March 2, 2011.
 * Date Last Updated: March 3, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Extends: Main.Loader.Script.js
 * Dependencies: Main.js, Main.Loader.Script.js,
 *   Main.Constant.js
 */

Main.Loader.Script.QueueObject = function (url)
{
  this.url = url;
  this.timeout = this.Master.timeout;
}

Main.Loader.Script.QueueObject.prototype = {

  onload : null,
  ontimeout : null,

  // A few basic getters, which are aliases for properties of
  // the Main.Loader.Script class.
  get Master()  { return Main.Loader.Script;  },

  /*
   * The basic variables of the object.
   */

  url : null,
  timeout : 7500,
  state : Main.Constant.LOAD.NONE,
  script : null,

  // Read-only pseudo-properties that relate to the state variable.

  get processing() { return this.state == Main.Constant.LOAD.PROCESSING; },
  get loaded()     { return this.state == Main.Constant.LOAD.LOADED;     },
  get timed_out()  { return this.state == Main.Constant.LOAD.TIMED_OUT;  },

  get processed()  { return this.loaded || this.timed_out; },

  /*
   * The class functions for Main.Loader.Script.QueueObject.
   */

  Load : function ()
  // The Load function creates a new <script> element with the relevant data for
  // the script to be loaded, and then attempts to load it. If it loads successfully,
  // the onload function is called. If not, the ontimeout function is called.
  {
    var _this = this; // To keep the local object in accessible.
    var head = document.getElementsByTagName("head")[0];

    // Create the script element and load the relevant variables for it.

    this.script = document.createElement("script");
    this.script.type = "text/javascript";
    this.script.src = this.url;

    // Upon loading, the this.onload function will be called, in addition to the
    // Processed function.
    this.script.onload = function ()
    {
      if(!_this.timed_out)
      {
        if(_this.onload)
          _this.onload();
        _this.Processed(Main.Constant.LOAD.LOADED);
      }
    }

    // Now attempt to load the script.
    head.appendChild(this.script);

    // If the file failed to load within the timeout period, then we're going to
    // assume that, for whatever reason, the file can not be loaded and it timed
    // out.

    setTimeout( function ()
      {
        if(!_this.loaded)
        {
          if(_this.ontimeout)
            _this.ontimeout();
          _this.Processed(Main.Constant.LOAD.TIMED_OUT);
        }
      }, this.timeout);
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
      this.Master.ontimeout(this);

    this.Master.Processed();
  }
}