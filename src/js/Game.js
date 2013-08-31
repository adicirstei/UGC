define(['Scene'], function(Scene){
  var Game = function(){
    this.score = 0;
    this.level = 'I.1';
  };

  Game.prototype.start = function() {
    var scene = new Scene(document.getElementById('canvas'));
    // scene.on('kill', this.kill, this);
    // scene.on('damage', this.damage, this);
    // scene.on('died', this.died, this);
//    this.world =scene scene.world;
    scene.loadLevel(this.level);
  };

  Game.prototype.kill = function() {
    this.score += 100;
    console.log(this.score);
  };
  Game.prototype.damage = function() {
    this.score += 100;
    console.log(this.score);
  };
  Game.prototype.died = function() {
    this.score += 100;
    console.log(this.score);
  };
  return new Game();


});