/*
 * File Name: Main.Loader.Image.QueueObject.js
 * Date Written: March 3, 2011.
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Main.js
 * Extends: Main.Loader.Image.js
 * Dependencies: Main.Loader.Image.js,
 *   Main.Constant.js
 */

Main.Loader.Image.QueueObject = function (src)
{
  this.src = src;
  this.timeout = this.Master.timeout;
}

Main.Loader.Image.QueueObject.prototype = {

  /*
   * Event functions.
   */

  // Success state.
  onload : null,

  // Failure states.
  onabort : null,
  onerror : null,
  ontimeout : null,

  onfailure : null, // Called upon any failure, whether it is onabort,
                    // onerror, or ontimeout.

  // Alias of Main.Loader.Image.
  get Master() { return Main.Loader.Image; },

  /*
   * Basic class variables.
   */

  src : null,
  timeout : -1,
  state : Main.Constant.LOAD.NONE,
  image : null,

  // Read-only pseudo-properties that provide boolean information on the
  // current loading state.

  get processing() { return this.state == Main.Constant.LOAD.PROCESSING;     },

  get aborted()    { return this.state == Main.Constant.LOAD.ABORT;          },
  get errored()    { return this.state == Main.Constant.LOAD.ERROR;          },
  get timedout()   { return this.state == Main.Constant.LOAD.TIME_OUT;       },

  get loaded()     { return this.state == Main.Constant.LOAD.LOADED;         },

  // Multi-propertery checkers.

  // Indicates that the image failed to process, meaning either the user
  // aborted it, there was an error in retrieving it, or it timed out while
  // attempting to load.
  get failed()     { return (this.aborted || this.errored || this.timedout); },

  // Indicates the script finished processing, meaning it either failed (was
  // aborted, errored, or timed out) or loaded successfully. In either case,
  // it's done doing what it's doing.
  get processed()  { return (this.loaded || this.failed);                    },

  /*
   * Class functions.
   */

  Load : function ()
  {
    this.state = Main.Constant.LOAD.PROCESSING; // We've begun processing.

    var _this = this;
    var head = document.getElementsByTagName("head")[0];

    // Create the image.

    this.image = new Image;

    // Apply its state-based functions.

    this.image.onload = function ()
    // A successful load! The this.onload function will be
    // called if it exists.
    {
      if(!_this.processed)
      {
        if(_this.onload)
          _this.onload(_this.src);
        _this.Processed(Main.Constant.LOAD.LOADED);
      }
    };

    this.image.onabort = function ()
    // The user aborted loading. The this.onabort and this.onfailure
    // functions will be called if they can.
    {
      if(!_this.processed)
      {
        if(_this.onabort)
          _this.onabort(_this.src);
        if(_this.onfailure)
          _this.onfailure(_this.src);
        _this.Processed(Main.Constant.LOAD.ABORT);
      }
    };

    this.image.onerror = function ()
    // There was an error in attempting to retrieve the image (for
    // example, the image possibly does not exist). If they exist,
    // the this.onerro and this.onfailure functions will be called.
    {
      if(!_this.processed)
      {
        if(_this.onerror)
          _this.onerror(_this.src);
        if(_this.onfailure)
          _this.onfailure(_this.src);
        _this.Processed(Main.Constant.LOAD.ERROR);
      }
    };

    // Now, attempt to begin loading the image.
    this.image.src = this.src;

    if(this.timeout > 0)
    // If the file could not load within the timeout period
    // (assuming there is one), then we're going to assume the file
    // can not be loaded. Call the ontimeout function, if it exists,
    // and then set the image's src to null, and delete it.
    {
      setTimeout( function ()
        {
          if(!_this.processed)
          {
            if(_this.timeout)
              _this.timeout();
            _this.Processed(Main.Constant.LOAD.TIME_OUT);
          }
        }, this.timeout);
    }

    return true; // The Load function was successfully called.
  },

  Processed : function (state)
  // This sets the QueueObject's state, and then based on that
  // it determines which of its Master's event functions should
  // be called. If there is a failure to load, the image's src
  // is set to null, and it is then deleted. After that, the
  // Master's Processed function is called.
  {
    this.state = state;

    if(this.loaded && this.Master.onload)
      this.Master.onload(this);

    else if(this.failed)
    {
      if(this.aborted && this.Master.onabort)
        this.Master.onabort(this);
      if(this.errored && this.Master.onerror)
        this.Master.onerror(this);
      if(this.timedout && this.Master.ontimeout)
        this.Master.ontimeout(this);

      if(this.Master.onfailure)
        // This is called for any failure at all.
        this.Master.onfailure(this);

      this.image.src = null;
      delete this.image;
    }

    this.Master.Processed();
  }
}