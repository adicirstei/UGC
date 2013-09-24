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

    var png = [];
    var rootNode = new Node();

    var writeImageData = function(node){
      debugger;
      console.log('===== writeImageData =====');
      var imgData = node.image.data;
      var outData = png[imgIdx].data;
      for (var y = 0; y < node.image.height; y++) {
        for (var x = 0; x < node.image.width; x++) {
          var srcidx = (node.image.width * y + x) << 2;
          var dstidx = (w * (y+node.rect.y) + x + node.rect.x) << 2;
          // copy color
          outData[dstidx] = imgData[srcidx];
          outData[dstidx+1] = imgData[srcidx+1];
          outData[dstidx+2] = imgData[srcidx+2];

          // and  opacity
          outData[dstidx+3] = imgData[srcidx+3];
        }
      }
      console.log('----- writeImageData -----');
    };
    var done = function(){
      for(var i = 0; i< png.length; i++) {
        png[i].pack().pipe(fs.createWriteStream(ofolder + '/'+'out'+imgIdx+'.png'));
        fs.writeFileSync(ofolder + '/'+'out'+imgIdx+'.json', JSON.stringify(tpdata));
      }
    };
    
    rootNode.rect = {x:0, y:0, w:w, h:h};
    // console.log(rootNode);

    var files = fs.readdirSync(ifolder);
    var fileCount = files.length, imgIdx = 0;
    files.forEach(function(file) {
      fIdx++;
      if(!png[imgIdx]) {
        png.push(new PNG({
          height:h,
          width: w,
          filterType: 4
        }));
      }
      if(file.match(/\.png$/) && fs.statSync(ifolder + '/' + file).isFile()) {

        var tmpPng = new PNG({filterType: 4});
        tmpPng.filename = file;
        fs.createReadStream(ifolder + '/' + file).pipe(tmpPng)
        .on('parsed', function(){

          var n = rootNode.insert(this);
          if(n) {

            writeImageData(n);

            tpdata.frames[this.filename] = {x: n.rect.x, y: n.rect.y, w: n.image.width, h: n.image.height};
            if(fIdx === fileCount){
              done();
            }
          } else {
            imgIdx++;
            
          }
        });
      }
    });    
  }
};

module.exports = TP;