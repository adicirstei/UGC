var pngjs = require('pngjs');
var Node = require('./node');
var fs = require('fs'),
    PNG = require('pngjs').PNG;

var TP = {
  pack: function(options){
    var ifolder = options.ifolder || ".";
    var ofolder = options.ofolder || '.';
    var w = options.width || 1024;
    var h = options.height || 1024;
    var fIdx = 0, tpdata = {frames:{}};

    var png = new PNG({
      height:h,
      width: w,
      filterType: 4
    });
    var rootNode = new Node();

    var writeImageData = function(node){
      var red = Math.floor(Math.random()*255);
      var nx = node.rect.x, ny = node.rect.y;
      var nw = node.image.width, nh = node.image.height;

      console.log(nx, ny, nw, nh);
      debugger;
      console.log('===== writeImageData =====');

      console.log(node.rect);
      var imgData = node.image.data;
      var outData = png.data;
      for (var y = 0; y < nh; y++) {
        for (var x = 0; x < nw; x++) {
          var srcidx = (nw * y + x) << 2;
          var dstidx = (w * (y+ny) + x + nx) << 2;

//          console.log(dstidx);
          // copy color
          outData[dstidx] = imgData[srcidx];
          outData[dstidx+1] = imgData[srcidx+1];
          outData[dstidx+2] = imgData[srcidx+2];

          // and  opacity
          outData[dstidx+3] = 255; //imgData[srcidx+3];
        }
      }
      console.log('----- writeImageData -----');
//      png.pack().pipe(fs.createWriteStream(ofolder + '/'+'outabc'+ nw +'.png'));
    };

    var drawTree = function(t){
      if (!t) {
        return;
      }

      if(t.image){
        writeImageData(t);
      } else {
        drawTree(t.child[0]);
        drawTree(t.child[1]);
      }

    };

    var done = function(){
      // drawTree(rootNode);
      // for(var i = 0; i< png.length; i++) {
        png.pack().pipe(fs.createWriteStream(ofolder + '/'+'out'+imgIdx+'.png'));
        fs.writeFileSync(ofolder + '/'+'out'+imgIdx+'.json', JSON.stringify(tpdata));
      // }
    };
    
    rootNode.rect = {x:0, y:0, w:w, h:h};
    // console.log(rootNode);

    var files = fs.readdirSync(ifolder);
    var fileCount = files.length, imgIdx = 0;
    files.forEach(function(file) {
      fIdx++;
      if(!png[imgIdx]) {

      }
      if(file.match(/\.png$/) && fs.statSync(ifolder + '/' + file).isFile()) {
        fs.createReadStream(ifolder + '/' + file).pipe(new PNG({filterType: 4}))
        .on('parsed', function(){
          console.log('inserting ' + file)
          rootNode.insert({width: this.width, height: this.height});
          //rootNode.insert(this);
          if(fIdx === fileCount){
            done();
          }

/*
          var n = rootNode.insert(this);
          if(n) {

            writeImageData(n);

            tpdata.frames[file] = {x: n.rect.x, y: n.rect.y, w: n.image.width, h: n.image.height};
            if(fIdx === fileCount){
              done();
            }
          } else {
            imgIdx++;
            
          }

*/          
        });
      }
    });    
  }
};

module.exports = TP;