/*
 * File Name: Canvas.js
 * Date Written: March 9, 2011
 * Date Last Updated: March 13, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Player.js
 * Implementations: Canvas.Draw.js,
 *   Canvas.Camera.js, Canvas.Input.js
 */

// Main.includes("Main.Classes/Player/Canvas/Canvas.Draw.js");
// Main.includes("Main.Classes/Player/Canvas/Canvas.Camera.js");
Main.includes("Main.Classes/Player/Canvas/Canvas.Input.js");

Main.Classes.Player.Canvas = function (element)
{
  if(element.nodeName && (element.nodeName == "CANVAS"))
  // A new Canvas object will only be instantiated if it is
  // a DOM element, and in particular if the DOM element is
  // the <canvas> element.
  {
    // Set the canvas element and the context. The context implemented
    // the drawing API for the canvas element.
    this.canvas = element;
    this.context = this.canvas.getContext("2d");

    // The Canvas.prototype stores the constructor and class data for
    // all these classes. When the Canvas class is, itself, constructed,
    // it by defauld holds their constructor. From this, we create a new
    // instance of the class and store it where the constructor was
    // stored. As the constructor is still stored on the prototype, there
    // is not risk of losing access to the constructor, and the Canvas
    // instance has the classes it needs.

    this.Input = new this.Input(this);
    // this.Draw = new this.Draw(this);
    // this.Camera = new this.Camera(this);

    // Set the oncontextmenu value.
    this.canvas.oncontextmenu = this.ContextMenu.bind(this);
  }

  else
  {
    delete this;
    return null;
  }
}

Main.Classes.Player.Canvas.prototype = {

 /*
  * Canvas class variables.
  */ 

  canvas : null, // The canvas element.
  context : null, // The 2D context of the canvas element, for the
                  // drawing API.
  Map : null, // The Main.Classes.Map instance this will be using
              // to draw.

  context_menu : false, // By default, there is no context menu.

  /*
   * Inner class definitions.
   */

  // Used to draw things to the canvas. Defined in Canvas.Draw.js.
  Draw : null,

  // This is used to determine what is in the player's view, and to draw
  // it accordingly. It should be updated every frame. This is implemented
  // in Canvas.Camera.js
  Camera : null,

  // Used to monitor user input in the canvas (as well as the window itself).
  // Defined in Canvas.Input.js.
  Input : null,

  /*
   * Canvas class pseudo-properties.
   */

  get id() { return this.canvas.id; },

  // These get the pixel positions relative to the page for the canvas element.
  get LeftOffset()   { return this.canvas.offsetLeft;   },
  get RightOffset()  { return Main.PageWidth - (this.LeftOffset + this.height);  },
  get TopOffset()    { return this.canvas.offsetTop;    },
  get BottomOffset() { return Main.PageHeight - (this.TopOffset + this.width); },

  // Pseudo-properties that allow the user to access the height and
  // width, in pixels, of the <canvas> element. They can also set
  // these values.

  get height() { return parseInt(this.canvas.getAttribute("height")); },
  get width()  { return parseInt(this.canvas.getAttribute("width"));  },

  set height(n) { return this.canvas.setAttribute("height", n); },
  set width(n)  { return this.canvas.setAttribute("width", n);  },

  // These allow the user to set the height and width of the <canvas> element
  // in terms of the number of tiles it can display. This only works if the
  // Map property is set to a Main.Classes.Map instance.

  get tile_height()
  {
    if(this.Map instanceof Main.Classes.Map)
      return this.height / this.Map.tile_height;
    return null;
  },
  get tile_width()
  {
    if(this.Map instanceof Main.Classes.Map)
      return this.width / this.Map.tile_width;
    return null;
  },

  set tile_height(t)
  {
    if(this.Map instanceof Main.Classes.Map)
      return (this.height = this.Map.tile_height * t);

    return null;
  },
  set tile_width(t)
  {
    if(this.Map instanceof Main.Classes.Map)
      return (this.height = this.Map.tile_width * t)

    return null;
  },

  // These indicate the current value of the 'display' CSS property. Using
  // boolean values, the user can toggle whether this element is visible
  // or not on the page.

  get displayed()
  {
    if(this.canvas.style.display == "none")
      return false;
    else
      return true;
  },
  set displayed(display)
  {
    if(display == true)
      this.canvas.style.display = "inline";
    else if(display == false)
      this.canvas.style.display = "none";
  },

  /*
   * Canvas class methods.
   */

  ContextMenu : function ()
  {
    return this.context_menu;
  },

  DisableContextMenu : function ()
  // This disables the browser's default context menu that occurs on right-clicking
  // the canvas. If successfully disabled, it will return true, and otherwise it will
  // return false.
  {
    this.context_menu = false;
  },

  EnableContextMenu : function ()
  {
    this.context_menu = true;
  },

  ToggleContextMenu : function ()
  {
    this.context_menu = !this.context_menu;
  }
}