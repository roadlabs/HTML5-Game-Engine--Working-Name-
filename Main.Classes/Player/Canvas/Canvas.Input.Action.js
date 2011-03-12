/*
 * File Name: Canvas.Input.Action.js
 * Date Written: March 11, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Canvas.Input.js
 */

Main.Classes.Player.Canvas.prototype.Input.prototype.Action = function (Master, state, input, action)
{
  this.Master = Master;

  this.state = state;
  this.input = input;

  this.action = action;
}

Main.Classes.Player.Canvas.prototype.Input.prototype.Action.prototype = {

  /*
   * Input.Action class variables.
   */

  Master : null,

  state : null,
  input : [],

  action : null

  /*
   * Input.Action class methods.
   */

}