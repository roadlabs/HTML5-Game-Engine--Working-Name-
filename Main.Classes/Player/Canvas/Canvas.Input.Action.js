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

  action : null,
  mode : 0,

  /*
   * Input.Action class methods.
   */

  IsInputComponent : function (i)
  // Returns true if the input i is part of the input for this action.
  {
    if(i != null)
    {
      if(i == this.input)
        return true;
      if(this.input.indexOf && (this.input.indexOf(i) != -1))
        return true;
    }

    return false;
  },

  Evaluate : function (Event)
  // This checks the state of all the relevant inputs. If they are all
  // in the Action's state (if in TRIGGER mode) or if any are in the Action's
  // state (if in CATCH mode), then the action will be called.
  {
    if((this.mode == Main.Constant.ACTION_MODE.TRIGGER) || (this.mode == Main.Constant.ACTION_MODE.CATCH))
    {
    
    }

    return false;
  }
}