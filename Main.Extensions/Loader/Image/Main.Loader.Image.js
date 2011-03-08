/*
 * File Name: Main.Loader.Image.js
 * Date Written: March 3, 2011
 * Date Last Updated: March 7, 2011
 * Written By: Timothy "Popisfizzy" Reilly
 * Dependencies: Main.js
 * Implementations: Main.Loader.Image.QueueObject.js
 */

Main.includes("Main.Extensions/Loader/Image/Main.Loader.Image.QueueObject.js");

Main.Loader.Image = {

  /*
   * The basic class variables.
   */

  QueueList : [], // List of URLs to load images from.
  timeout : -1, // By default, there isn't a timeout period.

  Processed : [], // List of URLs associated with ImageObjects which have
                  // already been loaded.

  /*
   * onevent functions.
   */

  // Success state.
  onload : null,

  // Failure states
  onabort : null,
  onerror : null,
  ontimeout : null,

  onfailure : null, // Called when any of the onabort, onerror,
                 // or ontimeout events occur.

  // Completion state.
  oncomplete : null,

  /*
   * QueueObject inner class. Implemented in Main.Loader.Image.QueueObject.js
   */

  QueueObject : null,

  /*
   * Function definitions.
   */

  Queue : function (src)
  // This will attempt to add a new image to the queue via a URL. If a URL is
  // not supplied, then the function returns null. If the URL is not already in
  // the QueueList, then a new Image.QueueObject object is created, queued, and
  // returned. If it's already in the queue list, then the already-existant
  // Image.QueueObject is returned. If the image has already been processed, then
  // an Image will be returned.
  {
    if(src)
    {
      var Queued = this.Find(src)
      if(!Queued)
      {
        var Q = new this.QueueObject(src);
        this.QueueList[src] = Q;

        return Q;
      }

      return Queued;
    }

    return null;
  },

  Find : function (src)
  // This will check both QueueList and Processed to see if the URL is found
  // anywhere.
  {
    var regex = new RegExp("(" + src + "$)", "i");

    for(var i in this.QueueList)
    {
      if(regex.test(i))
        return this.QueueList[i];
    }

    for(var i in this.Processed)
    {
      if(regex.test(i))
        return this.Processed[i];
    }

    return null;
  },

  Process : function (Q)
  // Begins processing the QueueList. If Q is a string, only the QueueObject with
  // that specific URL will be processed. If Q is a QueueObject, then only that
  // QueueObject will be processed. Otherwise, the whole Queue will be processed.
  // Note that oncomplete will not be 
  {
    if(Q)
    {
      if(((typeof Q) == "string") && (Q in this.QueueList))
        Q = this.QueueList[Q];
      if(Q instanceof this.QueueObject)
        return Q.Load();
    }

    else
    {
      for(var src in this.QueueList)
        this.QueueList[src].Load()

      return true;
    }

    return false;
  },

  Processed : function ()
  // This determines whether the queue is finished processing. If it is, the
  // Processed list is populated with all the images that were successfully
  // loaded. Then the queue is emptied, and all the ImageObjects are deleted.
  {
    for(var i in this.QueueList)
      if(!this.QueueList[i].processed)
        return false;

    if(this.oncomplete)
      this.oncomplete();

    for(var i in this.QueueList)
    {
      if(this.QueueList[i].loaded)
        this.Processed[i] = this.QueueList[i].image;

      delete this.QueueList[i];
    }
    delete this.QueueList;
    QueueList = [];

    return true;
  }
}