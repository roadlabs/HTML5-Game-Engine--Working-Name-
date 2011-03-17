/*
 * File Name: Main.Constants.js
 * Date Written: February 28, 2011
 * Date Last Updated: March 16, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Main.js
 */

// This is an implementation of some globally-important constants
// that will be used in a number of places within the engine.  This
// includes things such as direction, layers, drawing-related
// constants, and so on.

Main.Constant = {

  /*
   * Direction constants.
   */ 

  // Cardinal directions. These are non-composite.

  NORTH : 1,
  EAST  : 2,
  SOUTH : 4,
  WEST  : 8,

  // Orthogonal directions. Composite.

  NORTHEAST :  3, // NORTH | EAST
  SOUTHEAST :  6, // SOUTH | EAST
  SOUTHWEST : 12, // SOUTH | WEST
  NORTHWEST :  9, // NORTH | WEST

  // Composite, non-orthogonal directions. These indicate
  // a group of directions in a similar axis.

  LATERAL    :  5, // NORTH | SOUTH
  LONGITUDAL : 10, // EAST  | WEST

  // Miscellaneous.

  UP   : 16, // Indicates one z-level up (z + 1).
  DOWN : 32, // Indicates one z-level down (z - 1).

  CENTER : 64, // A non-direction. It effectively indicates the
               // current location.

  /*
   * Side view definitions. Defined equal to their equivalent
   * directional counterpart.
   */

  TOP    : 1,
  RIGHT  : 2,
  BOTTOM : 4,
  LEFT   : 8,

  // Composite directions.

  TOPRIGHT    :  3, // TOP    | RIGHT
  BOTTOMRIGHT :  6, // BOTTOM | RIGHT
  BOTTOMLEFT  : 12, // BOTTOM | LEFT
  TOPLEFT     :  9, // TOP    | LEFT

  VERTICAL   :  5, // TOP    | BOTTOM
  HORIZONTAL : 10, // LEFT   | RIGHT

  /*
   * Layer definitions.
   */ 

  LAYER : {

    // This starts at 0, and goes up to arbitrarily-high integers. A signicant
    // amount of empty layers are provided to allow for users to define their
    // own intermediary layers for whatever purpose. These must be integers, as
    // this system makes use of the way arrays are used in Javascript to do
    // proper layering.

    GROUND    : 50,
    OBJECT    : 150,
    CHARACTER : 250
  },

  /*
   * Draw mode definitions.
   */

  // Map draw mode definitions.

  MAP_DRAW_MODE : {
    REMAIN_ON_MAP   : 1,
    FOCUS_ON_CENTER : 2
  },

  // Object draw mode definitions.

  OBJECT_DRAW_MODE : {
    DRAW    : 0,
    NO_DRAW : 1
  },

  /*
   * Input constants.
   */

  // The keyboard value are not ASCII values, nor do they correspond to keyboard
  // values. They are simply assigned in order of their listing, and will be
  // converted to a normalized value by the library.
  KEYBOARD : {
    // Key states.
    PRESS   : 0, // Similar to the keydown event.
    HOLD    : 1, // Caused by keydown after n milliseconds of keyup not
                 // occuring. Similar to the keypress event.
    RELEASE : 2, // Similar to the keyup event.

    // Keys.
    A :  3,
    B :  4,
    C :  5,
    D :  6,
    E :  7,
    F :  8,
    G :  9,
    H : 10,
    I : 11,
    J : 12,
    K : 13,
    L : 14,
    M : 15,
    N : 16,
    O : 17,
    P : 18,
    Q : 19,
    R : 20,
    S : 21,
    T : 22,
    U : 23,
    V : 24,
    W : 25,
    X : 26,
    Y : 27,
    Z : 28,

    ONE   : 29,
    TWO   : 30,
    THREE : 31,
    FOUR  : 32,
    FIVE  : 33,
    SIX   : 34,
    SEVEN : 35,
    EIGHT : 36,
    NINE  : 37,
    ZERO  : 38,

    NUMPAD : {
      ONE      : 39,
      TWO      : 40,
      THREE    : 41,
      FOUR     : 42,
      FIVE     : 43,
      SIX      : 44,
      SEVEN    : 45,
      EIGHT    : 46,
      NINE     : 47,
      ZERO     : 48,
      SLASH    : 49,
      POINT    : 50,
      ASTERISK : 51
    },

    TILDE         : 52,
    HYPHEN        : 53,
    EQUALS_SIGN   : 54,
    LEFT_BRACKET  : 55,
    RIGHT_BRACKET : 56,
    BACKSLASH     : 57,
    SEMICOLON     : 58,
    APOSTROPHE    : 59,
    COMMA         : 60,
    PERIOD        : 61,
    FORWARDSLASH  : 62,

    F1  : 63,
    F2  : 64,
    F3  : 65,
    F4  : 66,
    F5  : 67,
    F6  : 68,
    F7  : 69,
    F8  : 70,
    F9  : 71,
    F10 : 72,
    F11 : 73,
    F12 : 74,

    SHIFT : 75,
    CTRL  : 76,
    ALT   : 77,

    WINDOWS : 78,

    SPACE : 79,
    ENTER : 80,
    TAB   : 81,

    BACKSPACE : 82,

    CAPS_LOCK   : 83,
    SCROLL_LOCK : 84,
    NUM_LOCK    : 85,

    INSERT    : 86,
    HOME      : 87,
    PAGE_UP   : 88,
    PAGE_DOWN : 89,
    END       : 90,
    DELETE    : 91,

    UP    : 92,
    DOWN  : 93,
    LEFT  : 94,
    RIGHT : 95,

    PRINT_SCREEN : 96,
    PAUSE        : 97,

    ESC : 98,

    /*
     * Arrays of constants.
     */

    STATES : [], // An array storing all the key state constants.
    KEYS : [], // An array storing all the key constants.
    TEXT_KEYS : [], // A set of keys which will be pressed to type
                    // text, or to modify text.
    CONSTANTS : [], // An array storing all the keyboard constants.
  },

  MOUSE : {
    // Button states.
    CLICK    :  99,
    DBLCLICK : 100,

    SCROLL_UP   : 101, // Mouse wheel.
    SCROLL_DOWN : 102,

    MOVE  : 103,
    ENTER : 104,
    LEAVE : 105,

    DOWN : 106,
    UP   : 107,

    DRAG : 108, // Simultaneous MOUSE.MOVE and MOUSE.DOWN
    DROP : 109, // MOUSE.UP after MOUSE.DRAG

    HOVER : 110, // MOUSE.MOVE not occuring on the screen
                 // after n milliseconds.

    // Buttons.
    LEFT   : 111,
    MIDDLE : 112,  // Mouse wheel.
    RIGHT  : 113,

    /*
     * Arrays of constants.
     */

    STATES : [],
    BUTTONS : [],
    CONSTANTS : []
  },

  WINDOW : {
    FOCUS_OUT : 114,
    FOCUS_IN  : 115,

    CONSTANTS : []
  },

  TOUCH : {
    /**
     ** TODO: Add TOUCH constants.
     **/
  },

  // Used by the Canvas.Input class to determined whether an instance
  // of the Canvas.Input.Action class is going to trigger or catch
  // input.
  ACTION_MODE : {
    TRIGGER : 1, // TRIGGER means that it will only go off if the state
                 // and all the actions are performed at the same time.
    CATCH   : 2  // CATCH means that it will go off when the state and
                 // any of the actions go off.
  },

  /*
   * Load states for the various queue objects for the
   * Main.Loader classes.
   */

  LOAD : {
    // Intermediate states.
    NONE       : 0,
    PROCESSING : 1,

    // Success state.
    LOADED     : 2,

    // Failure states.
    ABORT      : 3,
    TIME_OUT   : 4,
    ERROR      : 5
  }
}

Main.onfileload(function () {
  // When the file loads, there are a few things that need to be finished.

  /*
   * Generate the Main.Constant.KEYBOARD constant arrays. These store the
   * data on all the constants defined for they KEYBOARD class.
   */

  var K = Main.Constant.KEYBOARD;

  K.STATES = [     K.PRESS,         K.HOLD,       K.RELEASE                                  ];
  K.KEYS =   [         K.A,            K.B,             K.C,             K.D,            K.E,
                       K.F,            K.G,             K.H,             K.I,            K.J,
                       K.K,            K.L,             K.M,             K.N,            K.O,
                       K.P,            K.Q,             K.R,             K.S,            K.T,
                       K.U,            K.V,             K.W,             K.X,            K.Y,
                       K.Z,          K.ONE,           K.TWO,         K.THREE,         K.FOUR,
                    K.FIVE,          K.SIX,         K.SEVEN,         K.EIGHT,         K.NINE,
                    K.ZERO,   K.NUMPAD_ONE,    K.NUMPAD_TWO,  K.NUMPAD_THREE,  K.NUMPAD_FOUR,
             K.NUMPAD_FIVE,   K.NUMPAD_SIX,  K.NUMPAD_SEVEN,  K.NUMPAD_EIGHT,  K.NUMPAD_NINE,
             K.NUMPAD_ZERO, K.NUMPAD_SLASH,  K.NUMPAD_POINT,         K.TILDE,       K.HYPHEN,
             K.EQUALS_SIGN, K.LEFT_BRACKET, K.RIGHT_BRACKET,     K.BACKSLASH,    K.SEMICOLON,
              K.APOSTROPHE,        K.COMMA,        K.PERIOD,  K.FORWARDSLASH,           K.F1,
                      K.F2,           K.F3,            K.F4,            K.F5,           K.F6,
                      K.F7,           K.F8,            K.F9,           K.F10,          K.F11,
                     K.F12,        K.SHIFT,          K.CTRL,           K.ALT,      K.WINDOWS,
                   K.SPACE,        K.ENTER,           K.TAB,     K.BACKSPACE,    K.CAPS_LOCK,
             K.SCROLL_LOCK,     K.NUM_LOCK,        K.INSERT,          K.HOME,      K.PAGE_UP,
               K.PAGE_DOWN,          K.END,        K.DELETE,            K.UP,         K.DOWN,
                    K.LEFT,        K.RIGHT,  K.PRINT_SCREEN,         K.PAUSE,          K.ESC ];
  K.CONSTANTS = K.KEYS.concat(K.STATES);

  K.TEXT_KEYS = [      K.A,            K.B,             K.C,             K.D,            K.E,
                       K.F,            K.G,             K.H,             K.I,            K.J,
                       K.K,            K.L,             K.M,             K.N,            K.O,
                       K.P,            K.Q,             K.R,             K.S,            K.T,
                       K.U,            K.V,             K.W,             K.X,            K.Y,
                       K.Z,          K.ONE,           K.TWO,         K.THREE,         K.FOUR,
                    K.FIVE,          K.SIX,         K.SEVEN,         K.EIGHT,         K.NINE,
                    K.ZERO,   K.NUMPAD_ONE,    K.NUMPAD_TWO,  K.NUMPAD_THREE,  K.NUMPAD_FOUR,
             K.NUMPAD_FIVE,   K.NUMPAD_SIX,  K.NUMPAD_SEVEN,  K.NUMPAD_EIGHT,  K.NUMPAD_NINE,
             K.NUMPAD_ZERO, K.NUMPAD_SLASH,  K.NUMPAD_POINT,         K.TILDE,       K.HYPHEN,
             K.EQUALS_SIGN, K.LEFT_BRACKET, K.RIGHT_BRACKET,     K.BACKSLASH,    K.SEMICOLON,
              K.APOSTROPHE,        K.COMMA,        K.PERIOD,  K.FORWARDSLASH,        K.SHIFT,
                   K.SPACE,        K.ENTER,           K.TAB,     K.BACKSPACE,    K.CAPS_LOCK,
                  K.INSERT,       K.DELETE,          K.LEFT,         K.RIGHT,           K.UP,
                    K.DOWN];

  /*
   * Next generate similar data for Main.Constant.MOUSE.
   */

  var M = Main.Constant.MOUSE;

  M.STATES =       [ M.CLICK, M.DBLCLICK, M.SCROLL_UP, M.SCROLL_DOWN, M.MOVE, M.ENTER,
                     M.LEAVE,     M.DOWN,        M.UP,        M.DRAG, M.DROP, M.HOVER ];
  M.BUTTONS =      [  M.LEFT,   M.MIDDLE,     M.RIGHT                                 ];
  M.CONSTANTS = M.BUTTONS.concat(M.STATES);

  /*
   * And, lastly, do the same for Main.Constant.WINDOW.
   */

  var W = Main.Constant.WINDOW;

  W.CONSTANTS = [W.FOCUS_IN, W.FOCUS_OUT, W.HIDE, W.SHOW];

});