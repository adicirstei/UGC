define(['Sprite'], function(Sprite){
  return Sprite.extend({
    damageFactor: function() {
      switch(this.material) {
        case "wood":
          return 1.3;
        case "glass":
          return 1.5;
        default:
          return 1;
      }
    }
  });
});