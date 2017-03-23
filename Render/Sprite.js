function Sprite(spriteSheet, position, width, height, fillColor, frameWidth, frameHeight){

    // sprite sheet
    this.spriteSheet = spriteSheet || null;

    // dimensions
    this.width = (width != null) ? width : this.spriteSheet ? this.spriteSheet.image.width : 50;
    this.height = (height != null) ? height : this.spriteSheet ? this.spriteSheet.image.height : 50;

    this.frameWidth = frameWidth >= 0 ? frameWidth : this.width;
    this.frameHeight = frameHeight >= 0 ? frameHeight : this.height;

    // position
    this.position = position || new Vector(this.width * 0.5, this.height * 0.5);
    this.anchor = new Vector(0.5, 0.5);
    this.angle = 0;

    // appearance
    this.compositeOperation = 'source-over';
    this.fillColor = fillColor || null;
    this.shadowBlur = null;
    this.shadowColor = 'black';
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 3;
    this.smoothPixel = false;
    this.alpha = 1;

    // animation
    this.animations = [];
    this.currentAnimation = this.animations[0];

}
Sprite.prototype.constructor = Sprite;


Sprite.prototype.addAnimation = function(IDAnimation, frames, keys, fps){

    this.animations[IDAnimation] = {
        id : IDAnimation,
        frames : frames,
        keys : keys,
        started : false,
        paused : false,
        stoped : false,
        frameIndex : 0,
        currentFrame : 0,
        fps : 1000 / fps || 30,
        time : 0,
    }
    this.animations.length++;

    this.setAnimation(IDAnimation);
}

Sprite.prototype.setAnimation = function(IDAnimation){

    this.currentAnimation = this.animations[IDAnimation];
    this.currentAnimation.currentFrame = 0;
}

Sprite.prototype.pauseAnimation = function(){

    this.currentAnimation.paused = true;

}

Sprite.prototype.resumeAnimation = function(){

    this.currentAnimation.paused = false;

}

Sprite.prototype._playAnimation = function(dt){

    if(this.currentAnimation.paused) return false;

    if(this.currentAnimation.fps <= 0) return false;

    this.currentAnimation.time += dt * 1000;

    if(this.currentAnimation.time > this.currentAnimation.fps){
        this.currentAnimation.frameIndex++;
        this.currentAnimation.time = 0;
    }

    if(this.currentAnimation.frameIndex >= this.currentAnimation.keys.length){
        this.currentAnimation.frameIndex = 0;
    }

    this.currentAnimation.currentFrame = this.currentAnimation.keys[this.currentAnimation.frameIndex];

}

Sprite.prototype.draw = function(graphics, dt){

    graphics.save();

    // composite operation
    graphics.globalCompositeOperation = this.compositeOperation;


    // draw shadow - avoid this =/
    if(this.shadowBlur != undefined){
        graphics.shadowBlur = this.shadowBlur;
        graphics.shadowColor = this.shadowColor;
        graphics.shadowOffsetX = this.shadowOffsetX;
        graphics.shadowOffsetY = this.shadowOffsetY;
    }

    graphics.translate(this.position.x - this.width * 0.5 * this.anchor.x, this.position.y - this.height * 0.5 * this.anchor.y);
    graphics.rotate(-this.angle * TO_RAD);


    // alpha
    if(this.alpha < 0) this.alpha = 0;
    if(this.alpha != 1 && this.alpha >= 0)
        graphics.globalAlpha = this.alpha;


    // fillColor
    if(this.fillColor){
        graphics.fillStyle = this.fillColor;
        graphics.fillRect(-this.width * 0.5 * this.anchor.x, -this.height * 0.5 * this.anchor.y, this.width, this.height);
    }


    // image
    if(this.spriteSheet){

        // smooth pixels
        if(this.smoothPixel){
            graphics.mozImageSmoothingEnabled = true;
            graphics.webkitImageSmoothingEnabled = true;
            graphics.msImageSmoothingEnabled = true;
            graphics.imageSmoothingEnabled = true;
        }else{
            graphics.mozImageSmoothingEnabled = false;
            graphics.webkitImageSmoothingEnabled = false;
            graphics.msImageSmoothingEnabled = false;
            graphics.imageSmoothingEnabled = false;
        }

        // if animated sprite
        if(this.currentAnimation){

            if(!dt) throw(this.constructor.name + ' [draw] dt not defined');

            // animate frame
            this._playAnimation(dt);

            // draw current frame
            graphics.drawImage(this.spriteSheet.image, this.currentAnimation.frames[this.currentAnimation.currentFrame].x, this.currentAnimation.frames[this.currentAnimation.currentFrame].y, this.frameWidth, this.frameHeight, -this.width * 0.5 * this.anchor.x, -this.height * 0.5 * this.anchor.y, this.width, this.height);

        }else{

            // ordinary sprite
            graphics.drawImage(this.spriteSheet.image, 0, 0, this.spriteSheet.image.width, this.spriteSheet.image.height, -this.width * 0.5 * this.anchor.x, -this.height * 0.5 * this.anchor.y, this.width, this.height);

        }
    }

    graphics.restore();

}
