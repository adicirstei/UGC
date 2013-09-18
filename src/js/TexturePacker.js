define(function(){
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
});


/*

struct Node
{
    Node* child[2]
    Rectangle rc
    int imageID
}
    

Node* Node::Insert(const Image& img)
    if we're not a leaf then
        (try inserting into first child)
        newNode = child[0]->Insert( img )
        if newNode != NULL return newNode
        
        (no room, insert into second)
        return child[1]->Insert( img )
    else
        (if there's already a lightmap here, return)
        if imageID != NULL return NULL

        (if we're too small, return)
        if img doesn't fit in pnode->rect
            return NULL

        (if we're just right, accept)
        if img fits perfectly in pnode->rect
            return pnode
        
        (otherwise, gotta split this node and create some kids)
        pnode->child[0] = new Node
        pnode->child[1] = new Node
        
        (decide which way to split)
        dw = rc.width - img.width
        dh = rc.height - img.height
        
        if dw > dh then
            child[0]->rect = Rectangle(rc.left, rc.top, 
                                       rc.left+width-1, rc.bottom)
            child[1]->rect = Rectangle(rc.left+width, rc.top, 
                                       rc.right, rc.bottom)
        else
            child[0]->rect = Rectangle(rc.left, rc.top, 
                                       rc.right, rc.top+height-1)
            child[1]->rect = Rectangle(rc.left, rc.top+height, 
                                       rc.right, rc.bottom)
        
        (insert into first child we created)
        return Insert( img, pnode->child[0] )

        */