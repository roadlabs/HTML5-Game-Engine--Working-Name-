/*
 * File Name: Main.Constants.js
 * Date Written: February 28, 2011.
 * Date Last Updated: February 28, 2011
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
    A :  1,
    B :  2,
    C :  3,
    D :  4,
    E :  5,
    F :  6,
    G :  7,
    H :  8,
    I :  9,
    J : 10,
    K : 11,
    L : 12,
    M : 13,
    N : 14,
    O : 15,
    P : 16,
    Q : 17,
    R : 18,
    S : 19,
    T : 20,
    U : 21,
    V : 22,
    W : 23,
    X : 24,
    Y : 25,
    Z : 26,

    ONE   : 27,
    TWO   : 28,
    THREE : 29,
    FOUR  : 30,
    FIVE  : 31,
    SIX   : 32,
    SEVEN : 33,
    EIGHT : 34,
    NINE  : 35,
    TEN   : 36,

    TILDE         : 37,
    HYPHEN        : 38,
    EQUALS_SIGN   : 39,
    LEFT_BRACKET  : 40,
    RIGHT_BRACKET : 41,
    BACKSLASH     : 42,
    SEMICOLON     : 43,
    APOSTROPHE    : 44,
    COMMA         : 45,
    PERIOD        : 46,
    FORWARDSLASH  : 47,

    F1  : 48,
    F2  : 49,
    F3  : 50,
    F4  : 51,
    F5  : 52,
    F6  : 53,
    F7  : 54,
    F8  : 55,
    F9  : 56,
    F10 : 57,
    F11 : 58,
    F12 : 59,

    SHIFT : 60,
    CTRL  : 61,
    ALT   : 62,

    SPACE : 61,
    ENTER : 62,
    TAB   : 63,

    BACKSPACE : 64,

    CAPS_LOCK : 65,

    INSERT    : 66,
    HOME      : 67,
    PAGE_UP   : 68,
    PAGE_DOWN : 69,
    END       : 70,
    DELETE    : 71,

    UP    : 72,
    DOWN  : 73,
    LEFT  : 74,
    RIGHT : 75,

    PRINT_SCREEN : 76,
    SCROLL_LOCK  : 77,
    PAUSE        : 78,

    ESC : 79
  },

  MOUSE : {
    CLICK    : 80,
    DBLCLICK : 81,

    LEFT   : 82,
    MIDDLE : 83,
    RIGHT  : 84,

    SCROLL_UP   : 85,
    SCROLL_DOWN : 86,

    MOUSE_MOVE  : 87,
    MOUSE_ENTER : 88,
    MOUSE_LEAVE : 89,

    MOUSE_DOWN : 90,
    MOUSE_UP   : 91,

    MOUSE_DRAG : 92,
    MOUSE_DROP : 93,

    MOUSE_HOVER : 94,
  },

  WINDOW  : {
    FOCUS_IN  : 95,
    FOCUS_OUT : 96
  },

  // Used for the load states of queue objects for
  // the Main.Loader classes.
  LOAD : {
    NONE       : 0,

    PROCESSING : 1,
    LOADED     : 2,

    ABORTED    : 3,
    TIMED_OUT  : 4,
    FAILED     : 5
  }
};