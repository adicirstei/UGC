var fs = require('fs'),
    PNG = require('pngjs').PNG;

var png = new PNG({
        height:100,
        width: 100,
        filterType: 4
    });


for (var y = 0; y < png.height; y++) {
    for (var x = 0; x < png.width; x++) {
        var idx = (png.width * y + x) << 2;

        // invert color
        png.data[idx] = 0;
        png.data[idx+1] = 200;
        png.data[idx+2] = 0;

        // and reduce opacity
        png.data[idx+3] = 50;
    }
}

png.pack().pipe(fs.createWriteStream('green.png'));
