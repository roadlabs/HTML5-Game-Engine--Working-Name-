/*
 * File Name: Player.js
 * Date Written: March 8, 2011
 * Date Last Updated: March 9, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Main.js
 * Implementations: Canvas.js
 */

Main.includes("Main.Classes/Player/Canvas/Canvas.js");

Main.Classes.Player = {

  /*
   * Basic class variables.
   */

  Canvases : [], // The active canvases of the player.

  Characters : {
    // An inner class storing a list of characters that the
    // player can play as, as well as a pointing referring
    // to the index of the character.
    Listing : [],
    Pointer : 0,

    get Active()
    // This gets the active character for the player. If there
    // is nothing in the list, null is returned. If Pointer is
    // invalid (less than zero or larger than the length of
    // Listing), Listing[0] is returned.
    {
      if(this.Listing.length == 0)
        return null;

      if((this.Pointer < 0) || (this.Pointer > (this.Listing.length - 1)))
        return this.Listing[0];

      return this.Listing[this.Pointer];
    },

    set Active(character)
    // Sets the active character. If it is not already in the listing
    // of playable characters, add it.
    {
      var index = 0;
      if((index = this.Listing.indexOf(character)) != -1)
      {
        this.Pointer = index;
        return true;
      }

      else
      {
        this.Listing.push(character);
        this.Pointer = this.Listing.length - 1;
        return true;
      }

      return false;
    }
  },

  get Character()  { return this.Characters.Active;       },
  set Character(c) { return (this.Characters.Active = c); },

  /*
   * The canvas class, used to manage input on the canvas, as well as drawing
   * to it. This is implemented in Canvas.js.
   */

  Canvas : null,

  /*
   * Player class methods.
   */

  AddCanvas : function (id)
  {
    var canvas = document.getElementById(id);
    if(canvas)
    {
      var CanvasObject = new this.Canvas(canvas);
      this.Canvases[id] = CanvasObject;
      return CanvasObject;
    }

    return false;
  }
}