var TP = {
  pack: function(options){
    var ifolder = options.ifolder || ".";
    

  }
};

var Node = function (){
  this.child = {0: null, 1: null};
  this.rect = null;
  this.image = null;
};


Node.prototype.leaf = function() {
  return !this.child[0];
};
Node.prototype.insert = function(img){
  if(!this.leaf()){
    var newNode = this.child[0].insert(img);
    if(newNode) return newNode;
    return this.child[1].insert(img);
  } else {
    
    if (this.image) return null;

    if(this.rect.w < img.w || this.rect.h < img.h) return null;

    if(this.rect.w === img.w || this.rect.h === img.h) {
      this.image = img;
      return this;
    }

    this.child[0] = new Node();
    this.child[1] = new Node();

    var dw, dh;

    dw = this.rect.w - img.w;
    dh = this.rect.h - img.h;


    if(dw > dh) {
      this.child[0].rect = {
        x: this.rect.x, 
        y: this.rect.y, 
        w: img.w, 
        h: this.rect.h
      };
      this.child[1].rect = {
        x: this.rect.x + img.w, 
        y: this.rect.y, 
        w: this.rect.w - img.w, 
        h: this.rect.h
      };

    } else {
      this.child[0].rect = {
        x: this.rect.x, 
        y: this.rect.y, 
        w: this.rect.w, 
        h: img.h
      };
      this.child[1].rect = {
        x: this.rect.x, 
        y: this.rect.y+img.h, 
        w: this.rect.w, 
        h: this.rect.h - img.h
      };
    }
    return this.child[0].insert(img);
  }
};
return Node;

module.exports = TP;