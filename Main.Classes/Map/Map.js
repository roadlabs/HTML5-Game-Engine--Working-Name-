/*
 * File Name: Map.js
 * Date Written: March 6, 2011
 * Date Last Updated: March 7, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Main.js
 * Implementations: Map.Location.js,
 *   Map.Submap.js
 */

Main.includes("Main.Classes/Map/Map.Location.js");
// Main.includes("Main.Classes/Map/Map.Submap.js");

Main.Classes.Map = function (x, y, z, tw, th)
{
  this.x.parent = this;
  this.y.parent = this;
  this.z.parent = this;

  /*
   * Set the x-, y-, and z-axes' data appropriately.
   */

  // Setting the x-axis data.

  if(x instanceof Array)
  {
    this.x.Low = x[0];
    this.x.High = x[1];
  }

  else
  {
    this.x.Low = 1;
    this.x.High = x;
  }

  // Setting the y-axis data.

  if(y instanceof Array)
  {
    this.y.Low = y[0];
    this.y.High = y[1];
  }

  else
  {
    this.y.Low = 1;
    this.y.High = y;
  }

  // Setting the z-axis data.

  if(z instanceof Array)
  {
    this.z.Low = y[0];
    this.z.High = y[1];
  }

  else
  {
    this.z.Low = 1;
    this.z.High = z;
  }

  // Set the tile width and height data.

  this.tile_height = th;
  this.tile_width = tw;
}

Main.Classes.Map.prototype = {

  /*
   * Basic class variables are defined her e.
   */

  Objects : [], // All the objects contained in all the Map.Location objects on
                // the map.
  Locations : [], // An unordered lits of all Map.Location objects in the map.
  Map : [], // A three-dimensional array storing all the maps. It is first ordered
            // by z-axis, and then by (x, y)-position. That is, it is stored in the
            // order of (z, x, y) rather than (x, y, z). This is to make it easier
            // to pull out all the information on a particular z-level.

  // The default span, in pixels, of a tile. Respectively, the span in the x and
  // y directions.
  tile_width  : 0,
  tile_height : 0,

  /*
   * Some inner class definitions that will be defined in other
   * files.
   */

   // This stores information about a particular (x, y, z) coordinate, and
   // the objects located on it. It is defined in Map.Location.js
   Location : null,

   // This allows a particular subsection of the map to be treated like its
   // own portion. This is helpful if, for example, an area such as an arena
   // or something similar is loaded. This is defined in Map.Submap.js
   Submap : null,

  /*
   * Inner classes to help define the x-, y-, and z-axes.
   */

  x_axis : {
    low  : 0,
    high : 0
  },

  y_axis : {
    low  : 0,
    high : 0
  },

  z_axis : {
    low  : 0,
    high : 0
  },

  /*
   * Accessors and mutators for a few values.
   */

  x : {
    parent : null,

    get Low()  { return this.parent.x_axis.low;  },
    get High() { return this.parent.x_axis.high; },

    set Low(i)
    {
      return (this.parent.x_axis.low = i);
    },
    set High(i)
    {
      return (this.parent.x_axis.high = i);
    },

    get Origin()
    // The Origin of a map will be considered the point of the map closest
    // to (1, 1, 1). This means that it is the portion of a particular axis
    // closest to 0.
    {
      if(this.High <= 1)
        return this.High;
      if((this.Low <= 1) && (1 <= this.High))
        return 1;
      if(this.Low <= 1)
        return this.Low;
    }
  },

  y : {
    parent : null,

    get Low()  { return this.parent.y_axis.low;  },
    get High() { return this.parent.y_axis.high; },

    set Low(j)
    {
      return (this.parent.y_axis.low = j);
    },
    set High(j)
    {
      return (this.parent.y_axis.high = j);
    },

    get Origin()
    {
      if(this.High <= 1)
        return this.High;
      if((this.Low <= 1) && (1 <= this.High))
        return 1;
      if(this.Low <= 1)
        return this.Low;
    }
  },

  z : {
    get Low()  { return this.parent.z_axis.low;  },
    get High() { return this.parent.z_axis.high; },

    set Low(k)
    {
      return (this.parent.z_axis.low = k);
    },
    set High(k)
    {
      return (this.parent.z_axis.high = k);
    },

    get Origin()
    {
      if(this.High <= 1)
        return this.High;
      if((this.Low <= 1) && (1 <= this.High))
        return 1;
      if(this.Low <= 1)
        return this.Low;
    }
  },

  get width()
  {
    var x_0 = this.x.Low;
    var x_1 = this.x.High;

    if(((x_0 < 0) && (x_1 < 0)) || ((x_0 > 0) && (x_1 > 0)))
      return Math.abs(x_1) - Math.abs(x_0) + 1;
    else
      return (x_1 - x_0);
  },
  get height()
  {
    var y_0 = this.y.Low;
    var y_1 = this.y.High;

    if(((y_0 < 0) && (y_1 < 0)) || ((y_0 > 0) && (y_1 > 0)))
      return Math.abs(y_1) - Math.abs(y_0) + 1;
    else
      return (y_1 - y_0);
  },
  get depth()
  {
    var z_0 = this.z.Low;
    var z_1 = this.z.High;

    if(((z_0 < 0) && (z_1 < 0)) || ((z_0 > 0) && (z_1 > 0)))
      return Math.abs(z_1) - Math.abs(z_0) + 1;
    else
      return (z_1 - z_0);
  },

  get LowCorner()  { return this.Locate( this.x.Low,  this.y.Low,  this.z.Low);       },
  get HighCorner() { return this.Locate(this.y.High, this.y.High, this.z.High);       },

  get Origin()     { return this.Locate(this.x.Origin, this.y.Origin, this.z.Origin); },

  /*
   * Class method definitions.
   */

  Initailize : function ()
  // Called upon setting the map up for the first time. This populates the Map array
  // with all the data it needs.
  {
    for(var z = 0; z < this.depth; z ++)
    {
      this.Map[z] = [];
      for(var x = 0; x < this.width; x ++)
      {
        this.Map[z][x] = [];
        for(var y = 0; y < this.height; y ++)
        {
          this.Map[z][x][y] = new this.Location(x, y, z, this);
        }
      }
    }

    return true;
  },

  GetZLayer : function (z)
  {
    var ZLayer = this.Map[z];

    if(!ZLayer || (ZLayer.length == 0))
      return [];

    var LayerArray = [];
    for(var x = 0; x <= ZLayer.length; x ++)
      LayerArray[x] = ZLayer[x].slice;

    return LayerArray;
  },

  Locate : function (x, y, z)
  // This takes a specific (x, y, z)-coordinate and, if it is within the confines of
  // the map, returns the Map.Location object at that location. Otherwise, it returns
  // null.
  {
    if(!this.InBounds(x, y, z))
      return null;

    var Coordinates = this.Normalize(x, y, z);
    x = Coordinates[0];
    y = Coordinates[1];
    z = Coordinates[2];

    return this.Map[z][x][y];
  },

  InBounds : function (x, y, z)
  // Returns true if the specified (x, y, z)-coordinate is within the bounds of the map,
  // and false otherwise.
  {
    return ((x >= this.x.Low) && (x <= this.x.High)) &&
           ((y >= this.y.Low) && (y <= this.y.High)) &&
           ((z >= this.z.Low) && (z <= this.z.High));
  },

  Normalize : function (x, y, z)
  // Normalizes map coordinates to how they are ordered in an array.
  {
    var Coordinates = [];

    Coordinates[0] = x - this.x.Low - (x > 0 ? 1 : 0);
    Coordinates[1] = y - this.y.Low - (y > 0 ? 1 : 0);
    Coordinates[2] = z - this.z.Low - (z > 0 ? 1 : 0);

    return Coordinates;
  },

  Region : function (low, high)
  // This gets all the Map.Location objects in a region of the
  // map specified by a lower corner and an upper corner. If no
  // arguments are passed, then by default every location on the
  // map is returned.
  {
    // If low or high are not set, give them default values.
    if(!low)
      low = this.LowCorner();
    if(!high)
      high = this.HighCorner();

    // If low or high are not Map.Location objects, see if there
    // is possibly a way we can grab one. Otherwise, return an
    // empty array.
    if(!(low instanceof this.Location) && low.location)
      low = low.location;
    else
      return [];

    if(!(high instanceof this.Location) && high.location)
      high = high.location;
    else
      return [];

    // If low or high seem to be out-of-place, swap them.
    if((low.x > high.x) || (low.y > high.y) || (low.z > high.z))
    {
      var H = low;
      low = high;
      high = H;
    }

    var LocationsArray = [];
    for(var x = low.x; x <= high.x; x ++)
    {
      for(var y = low.y; y <= high.y; y ++)
      {
        for(var z = low.z; z <= high.z; z ++)
          LocationsArray.push(this.Locate(x, y, z));
      }
    }

    return LocationsArray;
  },

  Objects : function (low, high)
  // This is similar to Region, except that instead of returning
  // all the Map.Location objects in that area, it returns the
  // contents of the Map.Location objects in that area. It makes
  // use of the Region function, so has similar operation.
  {
    var Locations = this.Region(low, high)
    var Objects = [];
    for(var i in Locations)
    {
      for(var O in Locations[i].Objects)
        Objects.push(Locations[i].Objects[O]);
    }
 
    return Objects;
  },

  Bound : function (x, y, z)
  // This takes an (x, y, z)-coordinate and, if one of the axes lies
  // outside of the bounds of the map, places it at the nearest number
  // within the map.
  {
    if(x < this.x.Low)
      x = this.x.Low;
    else if(x > this.x.High)
      x = this.x.High;

    if(y < this.y.Low)
      y = this.y.Low;
    else if(y > this.y.High)
      y = this.y.High;

    if(z < this.z.Low)
      z = this.z.Low;
    else if(z > this.z.High)
      z = this.z.High;

    return [x, y, z];
  }
}