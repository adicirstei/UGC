(function (g) {
  var root = new Node();
  root.rect={w:800, h:600, x:0, y:0};
  g.ASD = g.ASD || {};
  var ctx = document.getElementById('testc').getContext('2d');

  console.log(ctx);
  g.ASD.root = root;
  var drawRect = function (r){
    var color = Math.floor(Math.random()*360.0);
    console.log(color);
    ctx.fillStyle = "hsl("+ color +",100%, 50%)";  
    ctx.fillRect(r.x, r.y, r.w, r.h);  

  };
  g.ASD.drawRect=drawRect;

  g.ASD.newRect = function (r){
    var n = root.insert(r);
    drawRect(n.rect);
  };

})(this);


