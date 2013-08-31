define(['Sprite', 'easeljs'], function(Sprite, easeljs){
  var F = Sprite.extend({damageFactor: function() { return 2; }, shape: 'circle'});

  F.prototype.view = (new easeljs.Bitmap('img/enemy-h.png')).set({regX: 50, regY:50});

  return F;
});