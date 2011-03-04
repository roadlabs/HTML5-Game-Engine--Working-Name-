/*
 * File Name: Main.Constants.js
 * Date Written: February 28, 2011.
 * Date Last Updated: March 3, 2011
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

  // Layer defintions.

  LAYER : {

    // This starts at 1, and goes up to arbitrarily-high integers. A signicant
    // amount of empty layers are provided to allow for users to define their
    // own intermediary layers for whatever purpose.

    GROUND    : 10,
    OBJECT    : 20,
    CHARACTER : 30
  },

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
    TEN   : 38,

    TILDE         : 39,
    HYPHEN        : 40,
    EQUALS_SIGN   : 41,
    LEFT_BRACKET  : 42,
    RIGHT_BRACKET : 43,
    BACKSLASH     : 44,
    SEMICOLON     : 45,
    APOSTROPHE    : 46,
    COMMA         : 47,
    PERIOD        : 48,
    FORWARDSLASH  : 49,

    F1  : 50,
    F2  : 51,
    F3  : 52,
    F4  : 53,
    F5  : 54,
    F6  : 55,
    F7  : 56,
    F8  : 57,
    F9  : 58,
    F10 : 59,
    F11 : 60,
    F12 : 61,

    SHIFT : 62,
    CTRL  : 63,
    ALT   : 64,

    SPACE : 65,
    ENTER : 66,
    TAB   : 67,

    BACKSPACE : 68,

    CAPS_LOCK : 69,

    INSERT    : 70,
    HOME      : 71,
    PAGE_UP   : 72,
    PAGE_DOWN : 73,
    END       : 74,
    DELETE    : 75,

    UP    : 76,
    DOWN  : 77,
    LEFT  : 78,
    RIGHT : 79,

    PRINT_SCREEN : 80,
    SCROLL_LOCK  : 81,
    PAUSE        : 81,

    ESC : 83
  },

  MOUSE : {
    // Button states.
    CLICK    : 80,
    DBLCLICK : 81,

    SCROLL_UP   : 85, // Mouse wheel.
    SCROLL_DOWN : 86,

    MOUSE_MOVE  : 87,
    MOUSE_ENTER : 88,
    MOUSE_LEAVE : 89,

    MOUSE_DOWN : 90,
    MOUSE_UP   : 91,

    MOUSE_DRAG : 92, // Simultaneous MOUSE_MOVE and MOUSE_DOWN
    MOUSE_DROP : 93, // MOUSE_UP after MOUSE_DRAG

    MOUSE_HOVER : 94, // MOUSE_MOVE not occuring on the screen
                      // after n milliseconds.

    // Buttons.
    LEFT   : 82,
    MIDDLE : 83,  // Mouse wheel.
    RIGHT  : 84,
  },

  WINDOW  : {
    FOCUS_IN  : 95,
    FOCUS_OUT : 96
  },

  // Used for the load states of queue objects for
  // the Main.Loader classes.
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
};