

GameEngineClass = Class.extend({

  move_dir: new Vec2(0,0),
  dirVec: new Vec2(0,0),

  entities: [],
    factory: {},
    _deferredKill: [],

  gPlayer0: {
    pos: {
      x: 100,
      y: 100
    },

    walkSpeed: 1,

    // This is hooking into the Box2D Physics
    // library. We'll be going over this in
    // more detail later.
    mpPhysBody: new BodyDef()
  },

  //-----------------------------
  setup: function () {
    // Call our input setup method to bind
    // our keys to actions and set the
    // event listeners.
    gInputEngine.setup();
    gMap = new TILEDMapClass();
  },

    spawnEntity: function (typename) {
        var ent = new (gGameEngine.factory[typename])();

        gGameEngine.entities.push(ent);

        return ent;
    },

    removeEntity: function(removeEnt) {
    // We don't do anything with this right now.
    // We'll fill it in later this unit.
    },

    update: function () {
        // Update player position from previous unit.
        gGameEngine.updatePlayer();

        // Loop through the entities and call that entity's
        // 'update' method, but only do it if that entity's
        // '_killed' flag is set to true.
        //
        // Otherwise, push that entity onto the '_deferredKill'
        // list defined above.
        for (var i = 0; i < gGameEngine.entities.length; i++) {
            var ent = gGameEngine.entities[i];
            if(!ent._killed) {
        ent.update();
      } else {
        gGameEngine._deferredKill.push(ent);
      }
        }

        // Loop through the '_deferredKill' list and remove each
        // entity in it from the 'entities' list.
        //
        // Once you're done looping through '_deferredKill', set
        // it back to the empty array, indicating all entities
        // in it have been removed from the 'entities' list.
        for (var j = 0; j < gGameEngine._deferredKill.length; j++) {
      gGameEngine.entities.erase(gGameEngine._deferredKill[j]);
        }

        gGameEngine._deferredKill = [];
    },

    //-----------------------------
    draw: function () {
        // Draw map. Note that we're passing a canvas context
        // of 'null' in. This would normally be our game context,
        // but we don't need to grade this here.
        gMap.draw(null);

        // Bucket entities by zIndex
        var fudgeVariance = 128;
        var zIndex_array = [];
        var entities_bucketed_by_zIndex = {};
        gGameEngine.entities.forEach(function(entity) {
            //don't draw entities that are off screen
            if(entity.pos.x >= gMap.viewRect.x - fudgeVariance &&
               entity.pos.x < gMap.viewRect.x + gMap.viewRect.w + fudgeVariance &&
               entity.pos.y >= gMap.viewRect.y - fudgeVariance &&
               entity.pos.y < gMap.viewRect.y + gMap.viewRect.h + fudgeVariance) {
                // Bucket the entities in the entities list by their zindex
                // property.
                // YOUR CODE HERE
                if(zIndex_array.indexOf(entity.zIndex) === -1){
                    zIndex_array.push(entity.zIndex);
                    entities_bucketed_by_zIndex[entity.zIndex] = [];
                }
                entities_bucketed_by_zIndex[entity.zIndex].push(entity);
            }
        });

        // Draw entities sorted by zIndex
        zIndex_array.sort(function(a, b){
            return a-b;
        });
        zIndex_array.forEach(function(zIndex){
            entities_bucketed_by_zIndex[zIndex].forEach(function(entity){
                entity.draw(fractionOfNextPhysicsUpdate);
            });
        });
    },

  updatePlayer: function () {

    // move_dir is a Vec2 object from the Box2d
    // physics library, which is of the form
    // {
    //     x: 0,
    //     y: 0
    // }
    // 
    // We'll be going more into Box2D later in
    // the course. The Vec2 constructor takes
    // an initial x and y value to set the
    // vector to.

    if (gInputEngine.actions['move-up']) {
      // adjust the move_dir by 1 in the
      // y direction. Remember, in our
      // coordinate system, up is the
      // negative-y direction, and down
      // is the positive-y direction!
      gGameEngine.move_dir.y -= 1;
    }
    if (gInputEngine.actions['move-down']) {
      // adjust the move_dir by 1 in the
      // y direction. Remember, in our
      // coordinate system, up is the
      // negative-y direction, and down
      // is the positive-y direction!
      gGameEngine.move_dir.y += 1;
    }
    if (gInputEngine.actions['move-left']) {
      // adjust the move_dir by 1 in the
      // x direction.
      gGameEngine.move_dir.x -= 1;
    }
    if (gInputEngine.actions['move-right']) {
      // adjust the move_dir by 1 in the
      // x direction.
      gGameEngine.move_dir.x += 1;
    }

    // After modifying the move_dir above, we check
    // if the vector is non-zero. If it is, we adjust
    // the vector length based on the player's walk
    // speed.
    if (gGameEngine.move_dir.LengthSquared()) {
      // First set 'move_dir' to a unit vector in
      // the same direction it's currently pointing.
      gGameEngine.move_dir.Normalize();

      // Next, multiply 'move_dir' by the player's
      // set 'walkSpeed'. We do this in case we might
      // want to change the player's walk speed due
      // to a power-up, etc.
      gGameEngine.move_dir.Multiply(gGameEngine.gPlayer0.walkSpeed);
    }

    gGameEngine.gPlayer0.mpPhysBody.setLinearVelocity(gGameEngine.move_dir.x, gGameEngine.move_dir.y);

    // Keyboard based facing & firing direction
    if (gInputEngine.actions.fire0 || gInputEngine.actions.fire1) {

      // Grab the player's screen position in space.
      var playerInScreenSpace = {
        x: gRenderEngine.getScreenPosition(this.gPlayer0.pos).x,
        y: gRenderEngine.getScreenPosition(this.gPlayer0.pos).y
      };

      // Set the dirVec property to the difference between the
      // current mouse position and the player's position in
      // screen space.
      dirVec.x = gInputEngine.mouse.x - playerInScreenSpace.x;
      dirVec.y = gInputEngine.mouse.y - playerInScreenSpace.y;

      dirVec.normalize();
    }

    // Modify dirVec based on the current state of the 'fire-up',
    // 'fire-down', 'fire-left', 'fire-right'.
    if (gInputEngine.actions['fire-up']) {
      gGameEngine.dirVec.y--;
    } else if (gInputEngine.actions['fire-down']) {
      gGameEngine.dirVec.y++;
    }

    if (gInputEngine.actions['fire-left']) {
      gGameEngine.dirVec.x--;
    } else if (gInputEngine.actions['fire-right']) {
      gGameEngine.dirVec.x++;
    }
  }

});

gGameEngine = new GameEngineClass();

