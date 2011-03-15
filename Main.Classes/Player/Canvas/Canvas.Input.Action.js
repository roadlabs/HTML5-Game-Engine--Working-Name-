/*
 * File Name: Canvas.Input.Action.js
 * Date Written: March 11, 2011
 * Date Last Modified: March 15, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Canvas.Input.js
 */

Main.Classes.Player.Canvas.prototype.Input.prototype.Action = function (Master, state, input, action)
{
  this.Master = Master;
  this.Master.Actions.push(this);

  this.state = state;
  this.input = input;

  this.action = action;

  this.BindEvents();
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

  BindEvents : function ()
  // This binds the relevant events (based on the state variable) so that
  // the actions can be performed when those events occur.
  {
  
  },

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
    if(this.IsInputComponent(Event.input) && (Event.state == this.state))
    // If the event is part of the input for this action and it is in the
    // proper state, then we can continue.
    {
      if(this.mode == Main.Constant.ACTION_MODE.TRIGGER)
      // In TRIGGER mode, the action will occur if and only if all the inputs
      // are in the state for the action. Otherwise, it will not occur.
      {
        for(var i in input)
        {
          if(this.GetInputData(input).state != this.state)
            return false;
        }

        // If it made it this far, then all the inputs are in the proper
        // state. Active the state, and if it is a function, pass the
        // Event.
        if((typeof this.action) == "function")
          this.action.call(null, Event);
        return true;
      }

      if(this.mode == Main.Constant.ACTION_MODE.CATCH)
      {
        for(var i in input)
        {
          if(this.GetInputData(input).state == this.state)
          {
            // If this evaluates as true at all, meaning any input is in
            // the proper state, then active the state. If it's a function,
            // pass the Event as well.
            if((typeof this.action) == "function")
              this.action.call(null, Event);
            return true;
          }
        }
      }
    }

    // The input wasn't in the proper state
    return false;
  }
}