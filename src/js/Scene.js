define(['easeljs', 'box2d', 'Level', 'Sprite', 'EnemySprite', 'GroundSprite', 'ObstacleSprite'], function(easeljs, box2d, Level, Sprite, EnemySprite, GroundSprite, ObstacleSprite){
  var Scene = function(canvas){
    var g = window.AngryBox.game;
    this.stage = new easeljs.Stage(canvas);
    this.debug = document.getElementById('debug');
    this.toBeDeleted = [];

    easeljs.EventDispatcher.initialize(Scene.prototype);

    this.world = setupPhysics();
    if (g) {
      g.worldWidth = 800/box2d.SCALE;
      g.worldHeight = 600/box2d.SCALE;
    }


    easeljs.Ticker.addListener(this);
    easeljs.Ticker.setFPS(60);
    easeljs.Ticker.useRAF = true;
  }

  Scene.prototype.tick = function(){
    this.stage.update();
    this.world.DrawDebugData();
    this.world.Step(1/60, 10, 10);
    this.world.ClearForces();
    this.deleteSprites();
  };

  Scene.prototype.deleteSprites = function() {
    var spr;
    for(var i=0; i<this.toBeDeleted.length; i+=1){
      spr = this.toBeDeleted.shift();
      this.world.DestroyBody(spr.view.body);
      this.stage.removeChild(spr.view);
    }
  }



  Scene.prototype.loadLevel = function(level){
    var damage = 0;
    var that = this;

    var imgChanged = function(e) {
      that.stage.addChild(e.cb);
      that.stage.removeChild(e.pb);
    };
    Level.load(level, function (data) {
      for(var i=0, l = data.ground.length; i<l; i++){
        var s = new GroundSprite({world: that.world, data: data.ground[i]});
        that.stage.addChild(s.view);
      }
      for(var i=0, l = data.obstacles.length; i<l; i++){
        var s = new ObstacleSprite({world: that.world, data: data.obstacles[i]});
        s.addEventListener('destroyed', function(e){
          var spr = e.target;
          that.toBeDeleted.push(spr);
        });
        s.addEventListener('damage', function(e){
          console.log(e);
          that.dispatchEvent({type: 'damage', value: e.value});

        });
        s.addEventListener('imgchanged', imgChanged);
        that.stage.addChild(s.view);
      }
      for(var i=0, l = data.enemies.length; i<l; i++){
        var s = new EnemySprite({world: that.world, data: data.enemies[i]});
        s.addEventListener('destroyed', function(e){
          var spr = e.target;
          that.toBeDeleted.push(spr);
        });
        s.addEventListener('imgchanged', imgChanged);
        that.stage.addChild(s.view);
      }
      that.debug.onmousedown = function(){
        var s = new Sprite({world: that.world, data: {shape: 'circle', radius: 0.3, y: 8}});
        that.stage.addChild(s.view);
        var enemy = new EnemySprite({world: that.world, data:{imageSize:{width: 100, height: 100}, radius: 0.3, y: 6, "images": ["img/enemy-h.png", "img/enemy-sd.png", "img/enemy-bd.png"]}});
        that.stage.addChild(enemy.view);
      }
      
      var debugDraw = new box2d.b2DebugDraw();

      debugDraw.SetSprite(that.debug.getContext('2d'));
      debugDraw.SetDrawScale(box2d.SCALE);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);

      that.world.SetDebugDraw(debugDraw);


    });
  };

  function setupPhysics () {
    var w = new box2d.b2World(new box2d.b2Vec2(0, 10), true);
    var listener = new box2d.b2ContactListener();
    
    listener.PostSolve = function(contact, impulse) {
        var s1, s2, imp;
        imp = impulse.normalImpulses[0];
        if(imp > 0.2) {
          s1 = contact.GetFixtureA().GetBody().gameSprite;
          s2 = contact.GetFixtureB().GetBody().gameSprite;
          s1.takeDamage(imp);
          s2.takeDamage(imp);
        }                 
    }
    w.SetContactListener(listener);
    return w;
  }


  return Scene;

});