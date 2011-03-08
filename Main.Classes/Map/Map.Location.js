/*
 * File Name: Map.js
 * Date Written: March 7, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Map.js
 */

Main.Classes.Map.Location = function (x, y, z, Master)
{
  this.Master = Master;
  this.x = x;
  this.y = y;
  this.z = z;
}

Main.Classes.Map.Location.prototype = {

  /*
   * Basic class variables for the Map.Location type.
   */

  Master : null, // The Map object that dictates this.

  Objects : [],

  x : 0,
  y : 0,
  z : 0,

  /*
   * Basic class functions.
   */

  Unload : function ()
  {
    for(var o in this.Objects)
    {
      if(o.Delete)
        o.Delete();

      delete this.Objects[o];
    }

    delete this;
  },

  Add : function (object)
  {
    if(this.Objects.indexOf(object) == -1)
    {
      this.Objects.push(object);
      return true;
    }

    return false;
  },

  Remove : function (object)
  {
    var position = 0;
    if((position = this.Objects.indexOf(object)) != -1)
    {
      this.Objects.splice(position, 1);
      return true;
    }

    return false;
  }
}