/*
 * File Name: Canvas.Input.StateChanger.js
 * Date Written: March 11, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Canvas.Input.js
 */

Main.Classes.Player.Canvas.prototype.Input.prototype.UpdateInputState = function (event)
{
  var InputObject = {
    timestamp : event.timeStamp,
    state : [],
    input : null
  };

  event.preventDefault();
  alert(event.type);

  var bindings = {
    keydown : Main.Constant.KEYBOARD.PRESS,
    keyup   : Main.Constant.KEYBOARD.RELEASE,

    click     : Main.Constant.KEYBOARD.CLICK,
    mousedown : Main.Constant.KEYBOARD.DOWN,
    mouseup   : Main.Constant.KEYBOARD.UP,
    mousemove : Main.Constant.KEYBOARD.MOVE,
    mouseover : Main.Constant.KEYBOARD.ENTER,
    mouseout  : Main.Constant.KEYBOARD.LEAVE,

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
      if(event.detail < 0)
        return Main.Constant.MOUSE.SCROLL_UP;
      else if(event.detail > 0)
        return Main.Constant.MOUSE.SCROLL_DOWN;
    }
  };
}