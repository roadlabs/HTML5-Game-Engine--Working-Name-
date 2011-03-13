/*
 * File Name: Canvas.Input.js
 * Date Written: March 9, 2011
 * Date Last Updated: March 13, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Canvas.js
 * Implementations: Canvas.Input.Action.js,
 *   Canvas.Input.Event.js, Canvas.Input.StateChanger.js
 */

Main.includes("Main.Classes/Player/Canvas/Canvas.Input.Action.js");
// Main.includes("Main.Classes/Player/Canvas/Canvas.Input.Event.js");
Main.includes("Main.Classes/Player/Canvas/Canvas.Input.StateChanger.js");

Main.Classes.Player.Canvas.prototype.Input = function (Master)
{
  this.Master = Master;
  this.Canvas = this.Master.canvas;

  var Binded_UIS = this.UpdateInputState.bind(this);

  this.Canvas.onmousedown = Binded_UIS;
  this.Canvas.onmouseup = Binded_UIS
  this.Canvas.onclick = Binded_UIS;
  this.Canvas.onmousemove = Binded_UIS;
  this.Canvas.onmouseover = Binded_UIS;
  this.Canvas.onmouseout = Binded_UIS;

  window.onkeyup = Binded_UIS;
  window.onblur = Binded_UIS;
  window.onfocus = Binded_UIS;

  if(Main.Browser.firefox)
    this.Canvas.addEventListener("DOMMouseScroll", Binded_UIS, false);
  else
    this.Canvas.onmousewheel = Binded_UIS;
}

Main.Classes.Player.Canvas.prototype.Input.prototype = {

  /*
   * Class variables.
   */

  Master : null, // The Canvas object this is a slave of.
  Canvas : null, // The <canvas> element being used.

  // The event periods for certain key and mouse events. These are
  // measured in milliseconds.

  key_hold : 250, // A key is considered held-down if it is pressed for more than 1/4 of a second.
  mouse_dblclick : 250, // A double-click action occurs if two clicks occur within 1/4 of a second.
  mouse_hover : 1000, // A mouse-hover event occurs if the mouse remains in the same place for
                      // one second.

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

  Bind : function (state, action, func)
  // This is used to bind input actions to a given function. The state and action arguments are both
  // necessary if it is either a keyboard or mouse action. If it is a window action, then action can
  // be dropped. Thus, the two forms of arguments are as follows:
  //   Bind(state, action, func)
  //   Bind(state, func)
  // Additionally, action may be an array, while state must be a single value.
  {
    var A = null;

    if(Bind.arguments.length == 2)
    // If there are two arguments, then this should be a WINDOW call.
    {
      func = Bind.arguments[1];
      if(!this.Integrity(state))
        return null;

      A = new this.Action(this, state, func);
    }
    else if(Bind.arguments.length == 3)
    // Otherwise, this should either be a MOUSE or KEYBOARD CALL.
    {
      if(!this.Integrity(state, action))
        return null;

      A = new this.Action(this, state, action, func);
    }
    else
      return null;

    return A;
  },

  Trigger : function (state, actions, func)
  {
    var A = this.Bind(state, action, func)
    if(A)
      A.mode = Main.Constant.ACTION.TRIGGER;

    return A;
  },

  Catch : function (state, actions, func)
  {
    var A = this.Bind(state, action, func);
    if(A)
      A.mode = Main.Constant.ACTION.CATCH;

    return A;
  },

  Integrity : function (state, action)
  {
    if(Integrity.arguments.length == 1)
      // If there is one argument, then it has to be passing window states. Check
      // that action isn't true, just to be sure, and verify that the state is in
      // WINDOW.CONSTANTS.
      return !action && (Main.Constant.WINDOW.CONSTANTS.indexOf(state) != -1);

    else if(Integrity.arguments.length == 2)
    // If the length is 2, then it's either KEYBOARD or MOUSE checks.
    {
      var IntegrityArray = null;

      // Check both MOUSE.STATES and KEYBOARD.STATES and determine which of the
      // two state is in. Then set the array equal to either MOUSE.BUTTONS or
      // KEYBOARD.KEYS, and that array will be used to check either action (if
      // it is a single value) or the values in action (if it's an array).
      if(Main.Constant.MOUSE.STATES.indexOf(state) != -1)
        IntegrityArray = Main.Constant.MOUSE.BUTTONS;
      else if(Main.Constant.KEYBOARD.STATES.indexOf(state) != -1)
        IntegrityArray = Main.Constant.KEYBOARD.KEYS;

      else
        // If it's in neither MOUSE.STATES nor KEYBOARD.STATES, then the integrity
        // of the data is faulty. Return false.
        return false;

      if(action instanceof Array)
      {
        if(action.length == 0)
          // If action is an array, it must have data in it, otherwise the integrity
          // of the data is faulty.
          return false;

        for(var d in action)
        {
          if(IntegrityArray.indexOf(action[d]) == -1)
            // If any data in action is not found in the IntegrityArray we're checking
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
        if(IntegrityArray.indexOf(action) != -1)
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

  // These are implemented in Canvas.Input.Statechanger.js. They're both functions, but long
  // and tedious ones, so they're implemented in their own, separate file.

  UpdateInputState : null,
  ThrowNewEvent    : null,
  NormalizeInput   : null
}