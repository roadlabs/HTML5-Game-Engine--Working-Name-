/*
 * File Name: Map.js
 * Date Written: March 7, 2011
 * Date Last Updated: March 8, 2011
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

  Objects : [], // All the objects currently at this Location.

  x : 0,
  y : 0,
  z : 0,

  /*
   * Basic class functions.
   */

  Unload : function ()
  // This is called when a Map.Location objects needs to
  // be deleted. First, it will attempt to delete every
  // object contained within it, then itself.
  {
    for(var o in this.Objects)
    {
      if(o.Delete)
        o.Delete();

      delete this.Objects[o];
    }

    delete this.Objects;
    delete this;
  },

  Add : function (object)
  // Called when an object is moved to this Location. It
  // returns true if it is added successfully, which is
  // typically when the object is not already at this
  // Location.
  {
    if(this.Objects.indexOf(object) == -1)
    {
      this.Objects.push(object);
      return true;
    }

    return false;
  },

  Remove : function (object)
  // Called when an object is moved from this Location. It
  // returns true on success, which will only be the case
  // if it was already located at this Location.
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