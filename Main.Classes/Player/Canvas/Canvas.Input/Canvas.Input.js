/*
 * File Name: Canvas.Input.js
 * Date Written: March 9, 2011
 * Date Last Updated: March 16, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Canvas.js
 * Implementations: Canvas.Input.Action.js,
 *   Canvas.Input.Event.js, Canvas.Input.StateChanger.js
 */

Main.includes("Main.Classes/Player/Canvas/Canvas.Input/Canvas.Input.Action.js");
Main.includes("Main.Classes/Player/Canvas/Canvas.Input/Canvas.Input.Event.js");
Main.includes("Main.Classes/Player/Canvas/Canvas.Input/Canvas.Input.StateChanger.js");

Main.Classes.Player.Canvas.prototype.Input = function (Master)
{
  this.Master = Master;
  this.Canvas = this.Master.canvas;

  // The bind function creates a new instance of the function it binds each time
  // it is called. That is, there is no caching. To prevent that, just bind this
  // function automatically, and then assign the bound function to where it was
  // stored previously.
  this.UpdateInputState = this.UpdateInputState.bind(this);

  if(Main.Browser.opera)
  {
    if(!this.BrowserFixes)
      this.BrowserFixes = new Object;

    // Opera has an utterly-broken key event set up. This is part of a way to hack
    // around that while attempting to maintain some sort of similarity in events,
    // cross brwoser. This variable will only exist if the browser is Opera. Note
    // that this only helps so much. For example, Opera is still not able to detect
    // a difference between the numpad and numrow buttons.
    this.BrowserFixes.Opera_KeyPressState = null;
  }
}

Main.Classes.Player.Canvas.prototype.Input.prototype = {

  /*
   * Class variables.
   */

  Master : null, // The Canvas object this is a slave of.
  Canvas : null, // The <canvas> element being used.

  // The event periods for certain key and mouse events. These are
  // measured in milliseconds.

  key_hold : 500, // A key is considered held-down if it is pressed for more than half a second.
  mouse_dblclick : 600, // A double-click action occurs if two clicks occur within 3/5 of a second.
  mouse_hover : 750, // A mouse-hover event occurs if the mouse remains in the same place for
                     // 3/4 of a second.

  // This is an array of Actions, which are a objects that store the collection of mouse, key, or
  // window actions and the related function they will call.
  Actions : [],

  // These are an array of strings that are associated with an Action object. This is used whenever
  // a string is passed to Bind instead of a function. Use CheckTagState to see if they are enabled.
  // Note that a tag is only true during the iteration of the game loop that it was called. After
  // that it reverts to false.
  Tags : [],

  // An array of inputs (from Main.Constant.KEYBOARD, Main.Constant.MOUSE, or Main.Constant.WINDOW).
  // These are associated with an object reporting information about them. This is used to report
  // for the Action objects.
  Input : [],

  // Used to store past states of mouse input. This is needed for the dblclick event.
  MouseInputArchive : [],

  /*
   * Inner class definitions.
   */

  // An object which stores the information about mouse, key, and window actions, and the function
  // that they call. This is used to double-check if anything should be called when a specific
  // action is performed. It is implemented in the Canvas.Input.Action.js file.
  Action : null,

  // An object which stores information about what event occured. This includes info about mouse, key,
  // and window actions, where a mouse click occurred on the canvas, and so on. An Event object will
  // be passed as the sole argument to any function called by an Action object.  It is implemented in
  // the Canvas.Input.Event.js file.
  Event : null,

  /*
   * Class method definitions.
   */

  Bind : function (state, input, func)
  // This is used to bind input actions to a given function. The state and input arguments are both
  // necessary if it is either a keyboard or mouse action. If it is a window action, then input can
  // be dropped. Thus, the two forms of arguments are as follows:
  //   Bind(state, input, func)
  //   Bind(state, func)
  // Additionally, input may be an array, while state must be a single value.
  {
    var A = null;

    if(arguments.length == 2)
    // If there are two arguments, then this should be a WINDOW call.
    {
      func = arguments[1];
      if(!this.Integrity(state))
        return null;

      A = new this.Action(this, state, func);
    }
    else if(arguments.length == 3)
    // Otherwise, this should either be a MOUSE or KEYBOARD CALL.
    {
      if(!this.Integrity(state, input))
        return null;

      A = new this.Action(this, state, input, func);
    }
    else
      return null;

    return A;
  },

  Trigger : function (state, input, func)
  // This sets an Action object to trigger mode, meaning the relevant
  // function is only called if *all* the inputs specified by input are
  // set to the specified state.
  {
    var A = this.Bind(state, input, func)
    if(A)
      A.mode = Main.Constant.ACTION_MODE.TRIGGER;

    return A;
  },

  Catch : function (state, input, func)
  // This sets an Action object to catch mode, meaning the relevnat
  // function is called if *any* of the inputs specified by input are
  // set to the specified state.
  {
    var A = this.Bind(state, input, func);
    if(A)
      A.mode = Main.Constant.ACTION_MODE.CATCH;

    return A;
  },

  Integrity : function (state, input)
  {
    if(arguments.length == 1)
      // If there is one argument, then it has to be passing window states. Check
      // that input isn't true, just to be sure, and verify that the state is in
      // WINDOW.CONSTANTS.
      return !input && (Main.Constant.WINDOW.CONSTANTS.indexOf(state) != -1);

    else if(arguments.length == 2)
    // If the length is 2, then it's either KEYBOARD or MOUSE checks.
    {
      var IntegrityArray = null;

      // Check both MOUSE.STATES and KEYBOARD.STATES and determine which of the
      // two state is in. Then set the array equal to either MOUSE.BUTTONS or
      // KEYBOARD.KEYS, and that array will be used to check either input (if
      // it is a single value) or the values in input (if it's an array).
      if(Main.Constant.MOUSE.STATES.indexOf(state) != -1)
        IntegrityArray = Main.Constant.MOUSE.BUTTONS;
      else if(Main.Constant.KEYBOARD.STATES.indexOf(state) != -1)
        IntegrityArray = Main.Constant.KEYBOARD.KEYS;

      else
        // If it's in neither MOUSE.STATES nor KEYBOARD.STATES, then the integrity
        // of the data is faulty. Return false.
        return false;

      if(input instanceof Array)
      {
        if(input.length == 0)
          // If input is an array, it must have data in it, otherwise the integrity
          // of the data is faulty.
          return false;

        for(var d in input)
        {
          if(IntegrityArray.indexOf(input[d]) == -1)
            // If any data in input is not found in the IntegrityArray we're checking
            // against, then the data is faulty, so return false.
            return false;
        }

        // If it made it through the loop successfully, the data is good. Return true.
        return true;
      }

      else
      // If the data isn't an array, it must be some other type of value. Check whether
      // it's in the integrity array.
      {
        if(IntegrityArray.indexOf(input) != -1)
          // It was found in the array, so it's good data.
          return true;

        else
          // It wasn't found in the IntegrityArray. The data is bad, so return false.
          return false;
      }
    }

    else
      // If there are zero arguments, or more than two arguments, there's nothing
      // the function can do with input, so assume it's invalid and return false.
      return false;
  },

  /*
   * These functions indicate whether the value provided is a member of a given Main.Constant.*
   * group.
   */

  IsKeyboardValue : function (k) { return Main.Constant.KEYBOARD.CONSTANTS.indexOf(k) != -1; },
  IsMouseValue    : function (m) { return Main.Constant.MOUSE.CONSTANTS.indexOf(m) != -1;    },
  IsWindowValue   : function (w) { return Main.Constant.WINDOW.CONSTANTS.indexOf(w) != -1;   },
  IsTouchValue    : function (t) { return Main.Constant.TOUCH.CONSTANTS.indexOf(t) != -1;    },

  /*
   * These are implemented in Canvas.Input.Statechanger.js. They're in their own functions as
   * they're relatively specific and different from the rest of the Canvas.Input.js file, and
   * because the implementations are long and tedious.
   */

  UpdateInputState       : null,
  GetInputData           : null,
  ThrowNewEvent          : null,
  NormalizeInput         : null,

  // Two inner classes with methods for normalizations and corrections for state and input
  // stuff.

  Corrections : null,
  Normalizations : null
}