/*
 * File Name: Main.Loader.Script.js
 * Date Written: March 2, 2011.
 * Date Last Updated: March 2, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Main.js
 * Implementations: Main.Loader.Script.QueueObject.js
 */

// This implements a script-loader, which will dynamically load
// a given Javascript script from a specified source at 'runtime'.

Main.Loader.Script = {

  /*
   * Define the basic variables for the class.
   */

  Queue : [], // The queue of scripts to be loaded.
  timeout : 7500, // Wait seven-and-a-half seconds to attempt to
                  // load the file.

  /*
   * The event functions. Called, respectively, when a file finished
   * loading, a file times out, and all the files have been processed.
   */

  onload     : null,
  ontimeout  : null,
  oncomplete : null,

  /*
   * The QueueObject class. It is implmented in the Main.Loader.Script.QueueObject.js
   * file.
   */

  QueueObject : null,

  /*
   * The functions to begin queueing and loading a script.
   */

  Queue : function (url)
  // Adds a new URL to the queue, and creates an associated QueueObject object.
  // If the URL is added successfully, the QueueObject is returned. If not, then
  // null is returned.
  {
    if(url && !(url in this.Queue))
    {
      var Q = new this.QueueObject(url);
      this.Queue[url] = Q;

      return Q;
    }

    return null;
  },

  Process : function (Q)
  // This is used to process either all or some of the URLs in the queue.
  // If no argument is provided, all will be processed. If either a URL or
  // a QueueObject object is passed, then that particular one will be
  // processed. Note that loading a single QueueObject will not call the
  // oncomplete function unless it is the only one in the queue.
  {
    // If Q is set, then the specified object will
    // be loaded.
    if(Q)
    {
      if(((typeof Q) == "string") && (Q in this.Queue))
        Q = this.Queue[Q];
      if(Q instanceof this.QueueObject)
        return Q.Load();
    }

    else if(this.Queue.length > 0)
    {
      for(var url in this.Queue)
        this.Queue[url].Load();

      return true;
    }

    return false;
  },

  Processed : function ()
  // Determines whether the whole queue has been processed. If so, then the
  // oncomplete function is called, and the queue is emptied.
  {
    for(var i in this.Queue)
      if(!this.Queue[i].processed)
        return false;

    this.oncomplete();

    for(var i in this.Queue)
      delete this.Queue[i];
    delete this.Queue;

    this.Queue = [];
  }
}