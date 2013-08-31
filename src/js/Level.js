define(['preloadjs'], function(preloadjs){
  var unique = function(arr) {
    var result = [],
      len,
      tmp = {};
      len = arr.length || 0;
      for(var i = 0; i< len; i+=1) {
        if(!tmp.hasOwnProperty(arr[i])) {
          tmp[arr[i]] = 1;
          result.push(arr[i]);
        }
      }
      return result;
  };
  var Level  = function(){};

  Level.load = function(id, done){
    var queue = new preloadjs.LoadQueue();
    
    queue.addEventListener("fileload", function(event){
      var images = {}, s, img, imgArray = [], sprites = [];

      sprites = sprites.concat(event.result.ground, event.result.enemies, event.result.obstacles);

      sprites.forEach(function(sprite){
        imgArray = imgArray.concat(sprite.images || []);
      });

      queue.removeAllEventListeners();
      queue.addEventListener("complete", function () {
        console.log(window.AngryBox.game.images);
        done(event.result);
      });
      queue.addEventListener("fileload", function(evt) {
        var item = evt.item; // A reference to the item that was passed in
        var type = item.type;
        var imgCache = window.AngryBox.game.images = window.AngryBox.game.images || {};

         // Add any images to the page body.
        if (type == preloadjs.LoadQueue.IMAGE) {
          imgCache[item.src] = evt.result;
        }
      });
      queue.close();
      queue.loadManifest(unique(imgArray));
    });

    queue.loadFile('assets/'+id+'.json');

  }

  return Level;
});