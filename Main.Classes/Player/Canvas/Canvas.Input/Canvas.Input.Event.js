/*
 * File Name: Canvas.Input.Event.js
 * Date Written: March 14, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Canvas.Input.js
 */

Main.Classes.Player.Canvas.prototype.Input.prototype.Event = function (input, state, time, x, y)
{
  this.input = input;
  this.state = state;

  this.time = time;

  if(((typeof x) == "number") && ((typeof y) == "number"))
  {
    this.x = x;
    this.y = y;
  }
  else
  {
    delete this.x;
    delete this.y;
  }
}

Main.Classes.Player.Canvas.prototype.Input.prototype.Event.prototype = {

  input : null,
  state : null,

  time : 0,

  x : null,
  y : null

}