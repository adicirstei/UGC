
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

    if(this.rect.w < img.width || this.rect.h < img.height) return null;

    if(this.rect.w === img.width && this.rect.h === img.height) {
      this.image = img;
      return this;
    }

    this.child[0] = new Node();
    this.child[1] = new Node();

    var dw, dh;

    dw = this.rect.w - img.width;
    dh = this.rect.h - img.height;


    if(dw > dh) {
      this.child[0].rect = {
        x: this.rect.x, 
        y: this.rect.y, 
        w: img.width, 
        h: this.rect.h
      };
      this.child[1].rect = {
        x: this.rect.x + img.width, 
        y: this.rect.y, 
        w: this.rect.w - img.width, 
        h: this.rect.h
      };

    } else {
      this.child[0].rect = {
        x: this.rect.x, 
        y: this.rect.y, 
        w: this.rect.w, 
        h: img.height
      };
      this.child[1].rect = {
        x: this.rect.x, 
        y: this.rect.y+img.height, 
        w: this.rect.w, 
        h: this.rect.h - img.height
      };
    }
    return this.child[0].insert(img);
  }
};
module.exports = Node;
