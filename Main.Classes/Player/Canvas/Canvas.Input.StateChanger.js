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

  // The state and input functions
  var state = null;
  var input = null;

  // Stores all the new events that will be created. Each element takes the
  // form:
  //   Event[n] = [state, input];
  var Events = [];

  var bindings = { // Build in states. We have to normalize these to
                   // the values for the engine.
    keydown     : Main.Constant.KEYBOARD.PRESS,
    keypress    : Main.Constant.KEYBOARD.HOLD,
    keyup       : Main.Constant.KEYBOARD.RELEASE,

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

    focus : Main.Constant.WINDOW.FOCUS_IN,
    blur  : Main.Constant.WINDOW.FOCUS_OUT
  };

  if(event.cancelable && event.preventDefault)
    event.preventDefault();

  var state = bindings[event.type];
  if((typeof state) == "function")
    state = state.call(null, event);

  // Normalize the input to the Main constants.
  var input = this.NormalizeInput(event, state);

  // Now add a new event.
  Events.push([state, input]);

  // Fiddle with the state as necessary, for the custom events
  // and to implement unsupported functions. These may throw
  // a second event (albeit, an engine event, not a DOM event).

  /*
   * Opera event fixes.
   */

  if(Main.Browser.opera)
  {
    if(input == Main.Constant.MOUSE.RIGHT)
    {
      if(state == Main.Constant.MOUSE.UP)
        // Throw a click event when the right mouse button is released. Opera does not
        // do this.
        Events.push([Main.Constant.MOUSE.CLICK, Main.Constant.MOUSE.RIGHT]);
    }

    if(input == Main.Constant.MOUSE.MIDDLE)
    {
      if(state == Main.Constant.MOUSE.UP)
        // The middle mouse button does not actually throw a mouseup event in Opera. Still,
        // this is here as a "hopefully" sort-of scenario.
        Events.push([Main.Constant.MOUSE.CLICK, Main.Constant.MOUSE.MIDDLE]);
    }
  }

  /*
   * Firefox event fixes.
   */

  if(Main.Browser.firefox)
  {
    if(input == Main.Constant.MOUSE.RIGHT)
    {
      if(state == Main.Constant.MOUSE.UP)
        // Throw a click event when the right mouse button is released. Firefox does not
        // do this.
        Events.push([Main.Constant.MOUSE.CLICK, Main.Constant.MOUSE.RIGHT]);
    }

    if(input == Main.Constant.MOUSE.MIDDLE)
    {
      if(state == Main.Constant.MOUSE.UP)
        // Throw a click event when the middle mouse button is release. Firefox does
        // not do this.
        Events.push([Main.Constant.MOUSE.CLICK, Main.Constant.MOUSE.MIDDLE]);
    }
  }

  /*
   * Chrome and Safari event fixes.
   */

  if(Main.Browser.chrome || Main.Browser.safari)
  {
    if(input == Main.Constant.MOUSE.RIGHT)
    {
      if(state == Main.Constant.MOUSE.UP)
        // Throw a click event when the right mouse button is released. Thankfully,
        // there is proper behavior for the middle mouse button.
        Events.push([Main.Constant.MOUSE.CLICK, Main.Constant.MOUSE.RIGHT]);
    }
  }

  // Now, throw all the new events.

  for(var a in Events)
  {
    var state = Events[a][0];
    var input = Events[a][1];
    this.ThrowNewEvent(state, input)
  }
}

Main.Classes.Player.Canvas.prototype.Input.prototype.ThrowNewEvent = function (state, input)
{
  var InputObject = {
    time  : Main.time,
    state : state,
  };

  // Report.innerHTML = Report.innerHTML + (InputObject.state +  " :: " + input + " :: " + InputObject.time) + "<br />";
}

Main.Classes.Player.Canvas.prototype.Input.prototype.NormalizeInput = function (event, state)
{
  event = event || window.event;

  if(Main.Constant.MOUSE.STATES.indexOf(state) != -1)
  {
    var button = null;

    if((state == Main.Constant.MOUSE.SCROLL_UP) || (state == Main.Constant.MOUSE.SCROLL_DOWN))
      // The scroll wheel is the middle mouse button, obviously, so assign it as such.
      button = Main.Constant.MOUSE.MIDDLE;

    else if(!((typeof event.button) in ["null", "undefined"]))
    {
      switch(event.button)
      // event.button is part of the W3C specification. If this is present, then it should
      // also follow the 0 = Left, 1 = Middle, 2 = Right part of the specification, as well
      // so we'll assume this.
      {
        case 0:
          button = Main.Constant.MOUSE.LEFT;
          break;
        case 1:
          button = Main.Constant.MOUSE.MIDDLE;
          break;
        case 2:
          button = Main.Constant.MOUSE.RIGHT;
          break;
      }
    }
 
    return button;
  }

  else if(Main.Constant.KEYBOARD.STATES.indexOf(state) != -1)
  {
    var keyboard = event.which;

    if((65 <= keyboard) && (keyboard <= 90))
      // The characters A through Z. They are all reported as
      // uppercase characters, so this simplifies thing.
      keyboard = keyboard - 62;

    else if((48 <= keyboard) && (keyboard <= 57))
    // The numeric characters at the top of the keyboard. These
    // are reported distinctly from the numpad characters.
    {
      if(keyboard == 48)
        keyboard = Main.Constant.KEYBOARD.ZERO;
      else
        // One through nine.
        keyboard = keyboard - 20;
    }
    else if((96 <= keyboard) && (keyboard <= 105))
    // Numpad zero through numpad 9. These are only reported
    // if Number Lock is on.
    {
      if(keyboard == 96)
        keyboard = Main.Constant.KEYBOARD.NUMPAD_ZERO;
      else
        keyboard = keyboard - 58;
    }
    else if((112 <= keyboard) && (keyboard <= 123))
    // The F1 to F12 keys.
      keyboard = keyboard - 49;

    else
    // Any other keys. They are less regular, so... SWITCH STATEMENTS!
    {
      switch(keyboard)
      {
        // Other numpad buttons.
        case 106:
          keyboard = Main.Constant.KEYBOARD.NUMPAD_ASTERISK;
          break;
        case 110:
          keyboard = Main.Constant.KEYBOARD.NUMPAD_POINT;
          break;
        case 111:
          keyboard = Main.Constant.KEYBOARD.NUMPAD_SLASH;
          break;

        // Symbol and punctuation keys.
        case  59:
          keyboard = Main.Constant.KEYBOARD.SEMICOLON;
          break;
        case 107:
          keyboard = Main.Constant.KEYBOARD.EQUALS_SIGN;
          break;
        case 109:
          keyboard = Main.Constant.KEYBOARD.HYPHEN;
          break;
        case 188:
          keyboard = Main.Constant.KEYBOARD.COMMA;
          break;
        case 190:
          keyboard = Main.Constant.KEYBOARD.PERIOD;
          break;
        case 191:
          keyboard = Main.Constant.KEYBOARD.FORWARDSLASH;
          break;
        case 192:
          keyboard = Main.Constant.KEYBOARD.TILDE;
          break;
        case 219:
          keyboard = Main.Constant.KEYBOARD.LEFT_BRACKET;
          break;
        case 220:
          keyboard = Main.Constant.KEYBOARD.BACKSLASH;
          break;
        case 221:
          keyboard = Main.Constant.KEYBOARD.RIGHT_BRACKET;
          break;
        case 222:
          keyboard = Main.Constant.KEYBOARD.APOSTROPHE;
          break;

        // Modifier keys.
        case 16:
          keyboard = Main.Constant.KEYBOARD.SHIFT;
          break;
        case 17:
          keyboard = Main.Constant.KEYBOARD.CTRL;
          break;
        case 18:
          keyboard = Main.Constant.KEYBOARD.ALT;
          break;

        // Windows key.
        case 91:
          keyboard = Main.Constant.KEYBOARD.WINDOWS;
          break;

        // Whitespace keys.
        case  8:
          keyboard = Main.Constant.KEYBOARD.BACKSPACE;
          break;
        case  9:
          keyboard = Main.Constant.KEYBOARD.TAB;
          break;
        case 13:
          keyboard = Main.Constant.KEYBOARD.ENTER;
          break;
        case 32:
          keyboard = Main.Constant.KEYBOARD.SPACE;
          break;

         // Keyboard lock keys.
        case 20:
          keyboard = Main.Constant.KEYBOARD.CAPS_LOCK;
          break;
        case 145:
          keyboard = Main.Constant.KEYBOARD.SCROLL_LOCK;
          break;
        case 144:
          keyboard = Main.Constant.KEYBOARD.NUM_LOCK;
          break;

        // Page keys.
        case 33:
          keyboard = Main.Constant.KEYBOARD.PAGE_UP;
          break;
        case 34:
          keyboard = Main.Constant.KEYBOARD.PAGE_DOWN;
          break;
        case 35:
          keyboard = Main.Constant.KEYBOARD.END;
          break;
        case 36:
          keyboard = Main.Constant.KEYBOARD.HOME;
          break;
        case 45:
          keyboard = Main.Constant.KEYBOARD.INSERT;
          break;
        case 46:
          keyboard = Main.Constant.KEYBOARD.DELETE;
          break;

        // Arrow keys.
        case 37:
          keyboard = Main.Constant.KEYBOARD.LEFT;
          break;
        case 38:
          keyboard = Main.Constant.KEYBOARD.UP;
          break;
        case 39:
          keyboard = Main.Constant.KEYBOARD.RIGHT;
          break;
        case 40:
          keyboard = Main.Constant.KEYBOARD.DOWN;
          break;

        // Miscellaneous keys.
        case 19:
          keyboard = Main.Constant.KEYBOARD.PAUSE;
          break;
        case 44:
          keyboard = Main.Constant.KEYBOARD.PRINT_SCREEN;
          break;

        // Escape key.
        case 27:
          keyboard = Main.Constant.KEYBOARD.ESC;
          break;
      }
    }

    return keyboard;
  }

  else if(Main.Constant.WINDOW.CONSTANTS.indexOf(state) != -1)
    return 0;
}