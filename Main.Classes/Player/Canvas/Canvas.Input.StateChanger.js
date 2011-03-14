/*
 * File Name: Canvas.Input.StateChanger.js
 * Date Written: March 11, 2011
 * Date Last Updated: March 13, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Canvas.Input.js
 */

Main.Classes.Player.Canvas.prototype.Input.prototype.UpdateInputState = function (event)
{
  // Cross-browser inconsistency fun!
  event = event || window.event;

  // The state and input vars.
  var state = null;
  var input = null;

  // x and y positions, relative to the top-left corner of the screen, for
  // mouse input.
  var x = null;
  var y = null;

  // Stores all the new events that will be created. Each element takes the
  // form:
  //   Event[n] = [state, input];
  var Events = [];

  var bindings = { // Build in states. We have to normalize these to
                   // the values for the engine.

    // Keyboard actions.
    keydown     : Main.Constant.KEYBOARD.PRESS,
    keypress    : Main.Constant.KEYBOARD.HOLD,
    keyup       : Main.Constant.KEYBOARD.RELEASE,

    // Mouse actions.
    click       : Main.Constant.MOUSE.CLICK,
    contextmenu : Main.Constant.MOUSE.CLICK,
    mousedown   : Main.Constant.MOUSE.DOWN,
    mouseup     : Main.Constant.MOUSE.UP,
    mousemove   : Main.Constant.MOUSE.MOVE,
    mouseover   : Main.Constant.MOUSE.ENTER,
    mouseout    : Main.Constant.MOUSE.LEAVE,

    DOMMouseScroll : function (event)
    // Used in Firefox.
    {
      if(event.detail < 0)
        return Main.Constant.MOUSE.SCROLL_UP;
      else if(event.detail > 0)
        return Main.Constant.MOUSE.SCROLL_DOWN;
    },

    mousewheel : function (event)
    // Used in Opera, Chrome, IE. Firefox will likely ultimately support it.
    {
      var delta = null;
      if(event.detail)
        // Opera and IE (I think) use event.detail.
        delta = event.detail;
      if(event.wheelDeltaY)
        // Chrome has event.wheelDeltaY and event.wheelDeltaX. We'll only
        // use event.wheelDeltaY for now, as support for x and y motion
        // detection in mouse wheels is too limited to be incredibly
        // useful.
        delta = event.wheelDeltaY;

      if(delta < 0)
        return Main.Constant.MOUSE.SCROLL_UP;
      else if(delta > 0)
        return Main.Constant.MOUSE.SCROLL_DOWN;
    },

    // Window actions.
    focus : Main.Constant.WINDOW.FOCUS_IN,
    blur  : Main.Constant.WINDOW.FOCUS_OUT

    // Touch actions.
  };

  if(event.cancelable && event.preventDefault)
    event.preventDefault();

  var state = bindings[event.type];
  if((typeof state) == "function")
    state = state.call(null, event);

  // Normalize the input to the Main constants.
  var input = this.NormalizeInput(event, state);

  // This changes the input for the state is MOUSE.MOVE and one
  // of either MOUSE.MIDDLE or MOUSE.RIGHT recently had a MOUSE.DOWN
  // state and no corresponding MOUSE.UP state.
  if(state == Main.Constant.MOUSE.MOVE)
  {
    var middle_state = this.GetInputData(Main.Constant.MOUSE.MIDDLE).state;
    var right_state = this.GetInputData(Main.Constant.MOUSE.RIGHT).state;

    if((middle_state == Main.Constant.MOUSE.DOWN) || (middle_state == Main.Constant.MOUSE.MOVE) || (middle_state == Main.Constant.MOUSE.DRAG))
      input = Main.Constant.MOUSE.MIDDLE;
    if((right_state == Main.Constant.MOUSE.DOWN)  || (right_state == Main.Constant.MOUSE.MOVE)  || (right_state == Main.Constant.MOUSE.DRAG))
      input = Main.Constant.MOUSE.RIGHT;
  }

  // Calculate the x and y values if it is a mouse event.

  if(this.IsMouseValue(state) && this.IsMouseValue(input))
  {
    var pageX = 0;
    var pageY = 0;

    if(event.pageX && event.pageY)
    {
      pageX = event.pageX;
      pageY = event.pageY;
    }
    if(event.clientX && event.clientY)
    {
      pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      pageY = event.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
    }

    x = pageX - this.Master.LeftOffset;
    y = pageY - this.Master.TopOffset;

    // These make sure x is between 0 and the width or height of the
    // canvas element, minus one (as it starts from 0, not 1).
    x = Math.min(Math.max(0, x), this.Master.width - 1);
    y = Math.min(Math.max(0, y), this.Master.height - 1);
  }

  // Now add a new event.
  Events.push([state, input, x, y]);

  /*
   * The following is used to correct cross-browser problems with implementation
   * of varoius DOM events. Browsers are not consistent in what order they throw
   * events, or if some events are even thrown. This is to attempt to fix as much
   * as can be fixed.
   */

  for(var f in this.Corrections)
  // Loop through the Corrections class, and find any values in
  // it that are methods.
  {
    var func = this.Corrections[f];
    if((typeof func) == "function")
    // For all methods, call it with the arguments state, input, x, and y.
    // If it returns an argument, it should be an array of arrays containing
    // new event information.
    {
      var new_events = func.call(null, state, input, x, y);
      if(new_events)
        for(var n in new_events)
          // Add the new event information to the Events array.
          Events.push(new_events[n]);
    }
  }

  /*
   * Now that corrections have been applied, attempt to implement the custom
   * events defined in the Main.Constant class.
   */

  // This implements the custom dblclick event.

  for(var e in Events)
  {
    if(Events[e][0] == Main.Constant.MOUSE.CLICK)
    // If any of the events found are a click event, then we have to check
    // if it should actually be a double-click event.
    {
      var break_loop = false;
      var to_delete = []; // A list of archived events that should be deleted.
      for(var o in this.MouseInputArchive)
      {
        var object = this.MouseInputArchive[o];
        if((Main.time - object.time) > this.mouse_dblclick)
          to_delete.push(o);
        else if((object.state == Main.Constant.MOUSE.CLICK) && (Events[e][1] == object.input) &&
               ((Main.time - object.time) <= this.mouse_dblclick) && (Events[e][2] == object.x) && (Events[e][3] == object.y))
        {
          Events[e] = [Main.Constant.MOUSE.DBLCLICK, Events[e][1], Events[e][2], Events[e][3]];
          break_loop = true;
        }
      }

      for(var d in to_delete)
        delete this.MouseInputArchive[d];
      delete to_delete;

      if(break_loop)
        break;
    }
  }

  // This implements the custom drag event.

  if((state == Main.Constant.MOUSE.MOVE) && (this.GetInputData(input).state == Main.Constant.MOUSE.DOWN))
    // If the previous state of the current input is mousedown and it's
    // mousemove, then it's a drag event.
    Events.push([Main.Constant.MOUSE.DRAG, input, x, y]);
  else if((state == Main.Constant.MOUSE.MOVE) && (this.GetInputData(input).state == Main.Constant.MOUSE.DRAG))
    // If the previous state of othe current input is mousedrag, and it's
    // current mousemove, then continue the drag event.
    Events.push([Main.Constant.MOUSE.DRAG, input, x, y]);

  // This implements the custom drop event.

  if((state == Main.Constant.MOUSE.UP) && (this.GetInputData(input).state == Main.Constant.MOUSE.DRAG))
    // The drop event occurs when a mouseup events occurs when the
    // mousedrag event was the previous state.
    Events.push([Main.Constant.MOUSE.DROP, input, x, y]);

  // This implements the custom hover event.

  if(state == Main.Constant.MOUSE.MOVE)
  {
    var _this = this;
    setTimeout( function ()
      {
        var Data = _this.GetInputData(input);
        if((Data.state == Main.Constant.MOUSE.MOVE) && (Data.x == x) && (Data.y == y))
          _this.ThrowNewEvent(Main.Constant.MOUSE.HOVER, input, x, y);
      }, this.mouse_hover);
  }

  // This implements the custom keypress event.

  if((state == Main.Constant.KEYBOARD.PRESS) && (this.GetInputData(input).state in [Main.Constant.KEYBOARD.PRESS, Main.Constant.KEYBOARD.HOLD]))
  {
    // This prevents keypress from being called multiple times.
    delete Events[0];

    if((state == Main.Constant.KEYBOARD.PRESS) && ((Main.time - this.GetInputData(input).time) >= this.key_hold))
      // If the key has been held long enough to be considered
      // a hold, throw a hold event.
      Events.push([Main.Constant.KEYBOARD.HOLD, input]);
    if((state == Main.Constant.KEYBOARD.PRESS) && (this.GetInputData(input).state == Main.Constant.KEYBOARD.HOLD))
      // If the current state is a keyboard press, and the
      // previous state is a keyboard hold, then this is
      // also actually a hold, not a press.
      Events.push([Main.Constant.KEYBOARD.HOLD, input]);
  }

  /*
   * Now, throw all the new events.
   */

  for(var a in Events)
  {
    var state = Events[a][0];
    var input = Events[a][1];
    var x = Events[a][2];
    var y = Events[a][3];
    this.ThrowNewEvent(state, input, x, y)
  }
}

Main.Classes.Player.Canvas.prototype.Input.prototype.Corrections = {
  // This is a class that implements methods used to correct input for various browsers.
  // It is implemented as a class so as to allow easy addition of new methods. All these
  // methods take arguments in the form of:
  //   (state, input, x, y, Event)
  //    o  state -- A value in Main.Constant.*.STATES, which indicates the state of the
  //                button or key.
  //    o  input -- A value in Main.Constant.*.(KEYS,BUTTONS) which indicates what was
  //                pressed to call the event.
  //    o  x, y -- The x and y position of the mouse, for a Main.Constant.MOUSE event.
  // Additionally, they must return an array of arrays in the form of [state, input, x, y]
  // or null.

  General : function (state, input, x, y)
  // This is a general change, as it is related to the way all browsers deal with the
  // right mouse button and clicking.
  {
    if((input == Main.Constant.MOUSE.RIGHT) && (state == Main.Constant.MOUSE.UP))
      return [ [Main.Constant.MOUSE.CLICK, Main.Constant.MOUSE.RIGHT, x, y] ];

    return null;
  },

  MouseMiddleClick : function (state, input, x, y)
  // This corrects middle-clicking for Firefox, and does it in fantasy with Opera. Because
  // Opera fails to throw a mouseup event for the middle click button (nor does it correctly
  // implement preventDefault() for middle clicking), this actually does nothing. It's mostly
  // here for the hope of eventually doing something.
  {
    if(Main.Browser.opera || Main.Browser.firefox)
    {
      if((input == Main.Constant.MOUSE.MIDDLE) && (state == Main.Constant.MOUSE.UP))
        return [ [Main.Constant.MOUSE.CLICK, Main.Constant.MOUSE.MIDDLE, x, y] ];

      return null;
    }
  },

}

Main.Classes.Player.Canvas.prototype.Input.prototype.GetInputData = function (input)
// This returns the class stored in the Input array. If it does not yet exist, then
// one is created with some temporary data.
{
  if((typeof this.Input[input]) != "object")
  {
  

    var InputObject = {
      time  : Main.time,
      state : null
    }

    if(this.IsMouseValue(input))
    {
      InputObject.x = null;
      InputObject.y = null;
    }

    this.Input[input] = InputObject;
  }

  return this.Input[input];
}

Main.Classes.Player.Canvas.prototype.Input.prototype.ThrowNewEvent = function (state, input, x, y)
{
  var InputObject = {
    time  : Main.time,
    state : state,
  };

  if(((typeof x) == "number") && ((typeof y) == "number"))
  {
    InputObject.x = x;
    InputObject.y = y;
  }

  if(!this.Input)
    this.Input = [];
  this.Input[input] = InputObject;

  if(this.IsMouseValue(state))
  {
    this.MouseInputArchive.push({
      time  : Main.time,
      state : state,
      input : input,

      x : x,
      y : y
    });
  }
}

Main.Classes.Player.Canvas.prototype.Input.prototype.NormalizeInput = function (event, state)
// This is used to noramlize the event input so that it conforms to the values set out in the
// Main.Constant class. This makes extensive use of the Canvas.Input.Normalizations inner class,
// which is defined below this method, along with documentation describing how it works. This is
// implemented so that additional normalizations may be defined.
{
  var NormalizationClass = null;

  if(this.IsMouseValue(state))
    NormalizationClass = this.Normalizations.Mouse;
  else if(this.IsKeyboardValue(state))
    NormalizationClass = this.Normalizations.Keyboard;
  else if(this.IsWindowValue(state))
    NormalizationClass = this.Normalizations.Window;
  else if(this.IsTouchValue(state))
    NormalizationClass = this.Normalizations.Touch;

  for(var f in NormalizationClass)
  {
    var func = NormalizationClass[f];
    if((typeof func) == "function")
    {
      var output = func.call(null, event, state);
      if(output === false)
        // If the output is exactly equal to false, then the loop will
        // continue.
        continue;

      return output;
    }
  }

  return null;
}

Main.Classes.Player.Canvas.prototype.Input.prototype.Normalizations = {
  // These inner classes and methods are used to implement some basic normalizations
  // to the constants provided by the library. Any value that is not equal to false
  // will indicate to the engine to stop.

  Mouse : {
    // Mouse normalizations should be defined here.

    MouseWheel : function (event, state)
    {
      if((state == Main.Constant.MOUSE.SCROLL_UP) || (state == Main.Constant.MOUSE.SCROLL_DOWN))
        return Main.Constant.MOUSE.MIDDLE;

      return false;
    },

    Default : function (event, state)
    {
      if(event.button in [0, 1, 2])
      {
        switch(event.button)
        {
          case 0:
            return Main.Constant.MOUSE.LEFT;
          case 1:
            return Main.Constant.MOUSE.MIDDLE;
          case 2:
            return Main.Constant.MOUSE.RIGHT;
        }
      }

      return false;
    }
  },

  Keyboard : {
    // Keyboard normalizations. Likely, only default will be necessary unless additional
    // keys are added.

    Default : function (event, state)
    {
      var keyboard = event.which;

      if((65 <= keyboard) && (keyboard <= 90))
        // The characters A through Z. They are all reported as
        // uppercase characters, so this simplifies thing.
        return keyboard - 62;

      else if((48 <= keyboard) && (keyboard <= 57))
      // The numeric characters at the top of the keyboard. These
      // are reported distinctly from the numpad characters.
      {
        if(keyboard == 48)
          return Main.Constant.KEYBOARD.ZERO;
        else
          // One through nine.
          return keyboard - 20;
      }
      else if((96 <= keyboard) && (keyboard <= 105))
      // Numpad zero through numpad 9. These are only reported
      // if Number Lock is on.
      {
        if(keyboard == 96)
          return Main.Constant.KEYBOARD.NUMPAD_ZERO;
        else
          return keyboard - 58;
      }
      else if((112 <= keyboard) && (keyboard <= 123))
      // The F1 to F12 keys.
        return keyboard - 49;

      else
      // Any other keys. They are less regular, so... SWITCH STATEMENTS!
      {
        switch(keyboard)
        {
          // Other numpad buttons.
          case 106:
            return Main.Constant.KEYBOARD.NUMPAD_ASTERISK;
          case 110:
            return Main.Constant.KEYBOARD.NUMPAD_POINT;
          case 111:
            return Main.Constant.KEYBOARD.NUMPAD_SLASH;

          // Symbol and punctuation keys.
          case  59:
            return Main.Constant.KEYBOARD.SEMICOLON;
          case 107:
            return Main.Constant.KEYBOARD.EQUALS_SIGN;
          case 109:
            return Main.Constant.KEYBOARD.HYPHEN;
          case 188:
            return Main.Constant.KEYBOARD.COMMA;
          case 190:
            return Main.Constant.KEYBOARD.PERIOD;
          case 191:
            return Main.Constant.KEYBOARD.FORWARDSLASH;
          case 192:
            return Main.Constant.KEYBOARD.TILDE;
          case 219:
            return Main.Constant.KEYBOARD.LEFT_BRACKET;
          case 220:
            return Main.Constant.KEYBOARD.BACKSLASH;
          case 221:
            return Main.Constant.KEYBOARD.RIGHT_BRACKET;
          case 222:
            return Main.Constant.KEYBOARD.APOSTROPHE;

          // Modifier keys.
          case 16:
            return Main.Constant.KEYBOARD.SHIFT;
          case 17:
            return Main.Constant.KEYBOARD.CTRL;
          case 18:
            return Main.Constant.KEYBOARD.ALT;

          // Windows key.
          case 91:
            return Main.Constant.KEYBOARD.WINDOWS;
            break;

          // Whitespace keys.
          case  8:
            return Main.Constant.KEYBOARD.BACKSPACE;
          case  9:
            return Main.Constant.KEYBOARD.TAB;
          case 13:
            return Main.Constant.KEYBOARD.ENTER;
          case 32:
            return Main.Constant.KEYBOARD.SPACE;

           // Keyboard lock keys.
          case 20:
            return Main.Constant.KEYBOARD.CAPS_LOCK;
          case 145:
            return Main.Constant.KEYBOARD.SCROLL_LOCK;
          case 144:
            return Main.Constant.KEYBOARD.NUM_LOCK;

          // Page keys.
          case 33:
            return Main.Constant.KEYBOARD.PAGE_UP;
            break;
          case 34:
            return Main.Constant.KEYBOARD.PAGE_DOWN;
            break;
          case 35:
            return Main.Constant.KEYBOARD.END;
          case 36:
            return Main.Constant.KEYBOARD.HOME;
          case 45:
            return Main.Constant.KEYBOARD.INSERT;
          case 46:
            return Main.Constant.KEYBOARD.DELETE;

          // Arrow keys.
          case 37:
            return Main.Constant.KEYBOARD.LEFT;
          case 38:
            return Main.Constant.KEYBOARD.UP;
          case 39:
            return Main.Constant.KEYBOARD.RIGHT;
          case 40:
            return Main.Constant.KEYBOARD.DOWN;

          // Miscellaneous keys.
          case 19:
            return Main.Constant.KEYBOARD.PAUSE;
          case 44:
            return Main.Constant.KEYBOARD.PRINT_SCREEN;

          // Escape key.
          case 27:
            return Main.Constant.KEYBOARD.ESC;
        }
      }

      return false;
    }
  
  },

  Window : {
    Default : function ()
    {
      return 0;
    }
  },

  Touch : {
    Default : function ()
    {
      // Placeholder until I find out more about touch events.
      return false;
    }
  }
}