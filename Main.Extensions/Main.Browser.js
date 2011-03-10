/*
 * File Name: Main.Browser.js
 * Date Written: February 28, 2011
 * Date Last Updated: March 1, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Main.js
 */

Main.Browser = {

  // Allows for the addition of new browsers and engines dynamically.

  NewBrowser : function (name, regex, version, position)
  {
    if(((typeof name) == "string") && (regex instanceof RegExp))
    {
      name = name.toLowerCase();

      // Generates the version name. This takes the format Mybrowser.
      var regex_name = name.charAt(0).toUpperCase() + name.substr(1);

      // Add it to the BrowserRegex inner class.
      this.BrowserRegex[regex_name] = regex;

      if(version && position)
      // If version and position are defined, we can look up the version
      // info for the browser.
      {
        this.BrowserVersionRegex[regex_name] = version;
        this.BrowserVersionRegex.Position[regex_name] = position;
      }

      // Create the function.
      this[name] = function () { return this.BrowserRegex[regex_name].test(this.UserAgentHeader); };

      return true;
    }

    return false;
  },

  NewEngine : function (name, regex, version, position)
  {
    if(((typeof name) == "string") && (regex instanceof RegExp))
    {
      name = name.toLowerCase();
      var regex_name = name.charAt(0).toUpperCase() + name.substr(1);

      this.RenderingEngineRegex[regex_name] = regex;

      if(version && position)
      {
        this.RenderingEngineVersionRegex[regex_name] = version;
        this.RenderingEngineVersionRegex.Position[regex_name] = position;
      }

      this[name] = function () { return this.RenderingEngineRegex[regex_name].test(this.UserAgentHeader); };
      return true;
    }

    return false;
  },

  // Accessor for the userAgent property of the navigator object.
  get UserAgentHeader() { return navigator.userAgent; },

  /*
   * Implements the pseudo-properties to determine the current browser.
   */

  // The regex strings to test.
  BrowserRegex : {
    Camino           : /(camino)[\/]((\d)+\.\d+([ab]{1}\d+pre))/i,
    Chrome           : /(chrome)[\/](((\d)+(\.)?)+)/i,
    Firefox          : /(firefox)[\/](((\d)+(\.)?)+(b)?(\d(pre)?)*)/i,
    InternetExplorer : /(msie)(\ +)(\d\.[\d]+[b]{0,1})/i,
    Netscape         : /(navigator)[\/][\w.]+/i,
    Opera            : /(opera)[\/][\w.]+/i,
    Safari           : /(safari)[\/]([\d\.]+)/i,
  },

  // The pseudo-properties.

  get camino()           { return this.BrowserRegex.Camino.test(this.UserAgentHeader);           },
  get chrome()           { return this.BrowserRegex.Chrome.test(this.UserAgentHeader);           },
  get firefox()          { return this.BrowserRegex.Firefox.test(this.UserAgentHeader);          },
  get internetexplorer() { return this.BrowserRegex.InternetExplorer.test(this.UserAgentHeader); },
  get netscape()         { return this.BrowserRegex.Netscape.test(this.UserAgentHeader);         },
  get opera()            { return this.BrowserRegex.Opera.test(this.UserAgentHeader);            },
  get safari()
  {
    // Requires a special case because of Google Chrome's output to navigator.userAgent.
    return (!this.chrome && this.BrowserRegex.Safari.test(this.UserAgentHeader));
  },

  // Grabs the browser regex data.
  get browser()
  {
    for(var browser in this.BrowserRegex)
    {
      if(this.BrowserRegex[browser].test(this.UserAgentHeader))
        return browser.toLowerCase();
    }

    return null;
  },

  // Used to grab version information about the browser.

  BrowserVersionRegex : {
    Camino           : /(camino)[\/]((\d)+\.\d+([ab]{1}\d+pre))/i,
    Chrome           : /(chrome)[\/](((\d)+(\.)?)+)/i,
    Firefox          : /(firefox)[\/](((\d)+(\.)?)+(b)?(\d(pre)?)*)/i,
    InternetExplorer : /(msie)(\ +)(\d\.[\d]+[b]{0,1})/i,
    Netscape         : /(navigator)[\/]([\w.]+)/i,
    Opera            : /(version)[\/]([\w.]+)/i,
    Safari           : /(safari)[\/]([\d\.]+)/i,

    Position         : {
                          Camino           : 2,
                          Chrome           : 2,
                          Firefox          : 2,
                          InternetExplorer : 3,
                          Netscape         : 2,
                          Opera            : 2,
                          Safari           : 2
                       }
  },

  // The version pseudo-property.
  get version()
  {
    for(var i in this.BrowserRegex)
    {
      var Browser = i;
      var BrowserRegex = this.BrowserRegex[i];

      if(BrowserRegex.test(this.UserAgentHeader) && (Browser in this.BrowserVersionRegex) && (this.BrowserVersionRegex[Browser] instanceof RegExp))
      {
        var regex = this.BrowserVersionRegex[Browser].exec(this.UserAgentHeader);
        if(regex && (regex.length > 0))
          return regex[this.BrowserVersionRegex.Position[Browser]]
      }
    }

    return null;
  },

  // This allows the user to query for the rendering engine.

  RenderingEngineRegex : {
    Gecko   : /(gecko)[\/](\d+)/i,
    WebKit  : /(applewebkit)[\/](\d+\.\d)/i,
    Trident : /(trident)[\/](\d+\.\d)/i,
    Presto  : /(presto)[\/]((\d+\.)+)/i
  },

  // Rendering engine pseudo-properties.

  get gecko()   { return this.RenderingEngineRegex.Gecko.test(this.UserAgentHeader);   },
  get webkit()  { return this.RenderingEngineRegex.WebKit.test(this.UserAgentHeader);  },
  get trident() { return this.RenderingEngineRegex.Trident.test(this.UserAgentHeader); },
  get presto()  { return this.RenderingEngineRegex.Presto.test(this.UserAgentHeader);  },

  // Outputs which rendering engine it is.
  get engine()
  {
    for(var engine in this.RenderingEngineRegex)
    {
      if(this.RenderingEngineRegex[engine].test(this.UserAgentHeader))
        return engine.toLowerCase();
    }

    return null;
  },

  // Used to grab version information about the rendering engine.

  RenderingEngineVersionRegex : {
    Gecko    : /(gecko)[\/](\d+)/i,
    WebKit   : /(applewebkit)[\/]([\d\.]+)/i,
    Trident  : /(trident)[\/](\d+\.\d)/i,
    Presto   : /(presto)[\/]((\d+\.?)+)/i,

    Position : {
                  Gecko   : 2,
                  WebKit  : 2,
                  Trident : 2,
                  Presto  : 2
               }
  },

  // The engine_version pseudo-property.
  get engine_version()
  {
    for(var i in this.RenderingEngineRegex)
    {
      var RenderingEngine = i;
      var RenderingEngineRegex = this.RenderingEngineRegex[i];

      if(RenderingEngineRegex.test(this.UserAgentHeader) && (RenderingEngine in this.RenderingEngineVersionRegex) && (this.RenderingEngineVersionRegex[RenderingEngine] instanceof RegExp))
      {
        var regex = this.RenderingEngineVersionRegex[RenderingEngine].exec(this.UserAgentHeader);
        if(regex && (regex.length > 0))
          return regex[this.RenderingEngineVersionRegex.Position[RenderingEngine]]
      }
    }

    return null;
  }
}