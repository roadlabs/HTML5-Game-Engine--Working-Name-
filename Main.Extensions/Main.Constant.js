/*
 * File Name: Main.Constants.js
 * Date Written: February 28, 2011
 * Date Last Updated: March 7, 2011
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
    ZERO   : 38,

    NUMPAD_ONE   : 39,
    NUMPAD_TWO   : 40,
    NUMPAD_THREE : 41,
    NUMPAD_FOUR  : 42,
    NUMPAD_FIVE  : 43,
    NUMPAD_SIX   : 44,
    NUMPAD_SEVEN : 45,
    NUMPAD_EIGHT : 46,
    NUMPAD_NINE  : 47,
    NUMPAD_ZERO  : 48,
    NUMPAD_SLASH : 49,
    NUMPAD_POINT : 50,

    TILDE         : 51,
    HYPHEN        : 52,
    EQUALS_SIGN   : 53,
    LEFT_BRACKET  : 54,
    RIGHT_BRACKET : 55,
    BACKSLASH     : 56,
    SEMICOLON     : 57,
    APOSTROPHE    : 58,
    COMMA         : 59,
    PERIOD        : 60,
    FORWARDSLASH  : 61,

    F1  : 62,
    F2  : 63,
    F3  : 64,
    F4  : 65,
    F5  : 66,
    F6  : 67,
    F7  : 68,
    F8  : 69,
    F9  : 70,
    F10 : 71,
    F11 : 72,
    F12 : 73,

    SHIFT : 74,
    CTRL  : 75,
    ALT   : 76,

    WINDOWS : 77,

    SPACE : 78,
    ENTER : 79,
    TAB   : 80,

    BACKSPACE : 81,

    CAPS_LOCK   : 82,
    SCROLL_LOCK : 83,
    NUM_LOCK    : 84,

    INSERT    : 85,
    HOME      : 86,
    PAGE_UP   : 87,
    PAGE_DOWN : 88,
    END       : 89,
    DELETE    : 90,

    UP    : 91,
    DOWN  : 92,
    LEFT  : 93,
    RIGHT : 94,

    PRINT_SCREEN : 95,
    PAUSE        : 96,

    ESC : 97,

    /*
     * Arrays of constants.
     */

    KEY_STATES : [], // An array storing all the key state constants.
    KEYS : [], // An array storing all the key constants.
    CONSTANTS : [], // An array storing all the keyboard constants.
  },

  MOUSE : {
    // Button states.
    CLICK    : 98,
    DBLCLICK : 99,

    SCROLL_UP   : 100, // Mouse wheel.
    SCROLL_DOWN : 101,

    MOVE  : 102,
    ENTER : 103,
    LEAVE : 104,

    DOWN : 105,
    UP   : 106,

    DRAG : 107, // Simultaneous MOUSE.MOVE and MOUSE.DOWN
    DROP : 108, // MOUSE.UP after MOUSE.DRAG

    HOVER : 109, // MOUSE.MOVE not occuring on the screen
                 // after n milliseconds.

    // Buttons.
    LEFT   : 110,
    MIDDLE : 111,  // Mouse wheel.
    RIGHT  : 112,

    /*
     * Arrays of constants.
     */

    MOUSE_STATES : [],
    BUTTONS : [],
    CONSTANTS : []
  },

  WINDOW  : {
    FOCUS_IN  : 113,
    FOCUS_OUT : 114,

    CONSTANTS : []
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

  K.KEY_STATES = [K.PRESS, K.HOLD, K.RELEASE];
  K.KEYS = [           K.A,            K.B,             K.C,             K.D,            K.E,
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
                    K.LEFT,        K.RIGHT,  K.PRINT_SCREEN,        K.PAUSE,           K.ESC ];
  K.CONSTANTS = K.KEY_STATES.concat(K.KEYS);

  /*
   * Next generate similar data for Main.Constant.MOUSE.
   */

  var M = Main.Constant.MOUSE;

  M.MOUSE_STATES = [ M.CLICK, M.DBLCLICK, M.SCROLL_UP, M.SCROLL_DOWN, M.MOVE, M.ENTER,
                     M.LEAVE,     M.DOWN,        M.UP,        M.DRAG, M.DROP, M.HOVER ];
  M.BUTTONS =      [  M.LEFT,   M.MIDDLE,     M.RIGHT                                 ];
  M.CONSTANTS = M.BUTTONS.concat(M.MOUSE_STATES);

  /*
   * And, lastly, do the same for Main.Constant.WINDOW.
   */

  var W = Main.Constant.WINDOW;

  W.CONSTANTS = [W.FOCUS_IN, W.FOCUS_OUT];

});