define(['box2d', 'easeljs'], function(box2d, easeljs){
  var Sprite = function(options){
    var f, b, world, view, g, type, data, shape, images;
    g = window.AngryBox.game;
    
    // damage is the amount of damage taken so far. When damage >= 100% then the sprite is "dead" and is removed from scene.
    var damage = 0;
    data = options.data;
    world = options.world;
    this.takeDamage = function(impact) {
      var pDmg = damage, idx, pidx, imgLen = 0;
      if(images) {
        imgLen = images.length;
      }
      if(impact > 0) {
        damage += impact * this.damageFactor();
        idx = Math.floor(damage*imgLen/100); // index of current image
        pidx = Math.floor(pDmg*imgLen/100);  // index of previous image
        if(pidx !== idx) {
          // change the image
          var v = this.view, b = (new easeljs.Bitmap(images[idx])).set({regX: data.imageSize.width/2, regY:data.imageSize.height/2});

          this.setBitmap(b, v.body);
          this.dispatchEvent ({type: 'imgchanged', pb: v, cb: b});
        }
        this.dispatchEvent ({type: 'damage', value: damage});
      }
      
      if (damage >= 100) {
        // raise event that the sprite died and destroy it.
        this.dispatchEvent ('destroyed');
      }
    };

    if(!world) {
      throw new Error ('Can\'t create sprite without a world');
    }

    type = data.type || this.type;
    shape = data.shape || this.shape;
    this.material = data.material;
    
    images = data.images; // || [];
    if(images) {
      var firstImage = window.AngryBox.game.images[images[0]];
      view = (new easeljs.Bitmap(firstImage)).set({regX: data.imageSize.width/2, regY:data.imageSize.height/2});
    } else {
      view = (new easeljs.Bitmap('img/default.png')).set({regX: 0.5, regY:0.5});
    }

    this.view = view;
    //this.view.regX = this.view.regY = box2d.SCALE / 2;

    f = new box2d.b2FixtureDef();
    f.density = data.density || 1;
    f.friction = data.friction || 0.5;
    f.restitution = data.restitution || 0.8;
    b = new box2d.b2BodyDef();
    b.type = (type === 'static'? box2d.b2Body.b2_staticBody : box2d.b2Body.b2_dynamicBody) ;
    b.position.x = data.x || Math.random()*15 +1;
    b.position.y = g.worldHeight - (data.y || 0);

    switch(shape) {
      case 'circle': 
        f.shape = new box2d.b2CircleShape(data.radius || 1);
        break;
      default:
        f.shape = new box2d.b2PolygonShape();
        f.shape.SetAsBox(data.width || 1, data.height || 1);
    }

    this.width = data.width || data.radius || 1;
    this.height = data.height || data.radius || 1;

    var body = world.CreateBody(b);
    body.CreateFixture(f);

    this.setBitmap(view, body);
  };

  easeljs.EventDispatcher.initialize(Sprite.prototype);

// properties I might override in subclasses


  //the damageFactor is the coeficiet by which the impact is multiplied in order to compute the health loss;
  Sprite.prototype.damageFactor = function() { return 0;};

  Sprite.prototype.setBitmap = function(bmp, body) {
    var ob = this.view, nb = bmp;
    body.gameSprite = this;
    nb.body = body;

    nb.set({scaleX: box2d.SCALE * this.width / nb.regX, scaleY: box2d.SCALE * this.height / nb.regY});
    this.view = nb;
    nb.onTick = function(e){
      var p = this.body.GetPosition();
      this.x = p.x * box2d.SCALE;
      this.y = p.y * box2d.SCALE;
      this.rotation = this.body.GetAngle() * 180 / Math.PI;
    };
  };
  Sprite.extend = function(c){
    // for the moment let's just pretend to extend
    // look at Backbone extend form more insight

    var parent = this,
      child;

    if (c && c.hasOwnProperty('constructor')) {
      child = c.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    child.extend = parent.extend;

    var Surrogate = function() { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if(c) {
      for(k in c){
        if(c.hasOwnProperty(k)){
          child.prototype[k] = c[k];
        }
      }
    }
    child.__super__ = parent.prototype;

    return child;
  };
  
  return Sprite;
});