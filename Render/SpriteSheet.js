function SpriteSheet(image){

    // source image
    this.image = image;
    this.originalImage = image;

    // create a canvas to manipulate image pixels
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;

    // draw to the canvas to copy image data
    this.graphics = this.canvas.getContext('2d');
    this.graphics.drawImage(this.image, 0, 0);

    // store image data
    this.imageSource = this.graphics.getImageData(0, 0, this.image.width, this.image.height);

}
SpriteSheet.prototype.constructor = SpriteSheet;

SpriteSheet.prototype.generateFramesGrid = function(width, height){

    var framesX = Math.round(this.image.width / width);
    var framesY = Math.round(this.image.height / height);

    var frames = [];

    for(var y = 0; y < framesY; y++){
        for(var x = 0; x < framesX; x++){

            frames.push({
                x : width * x,
                y : height * y
            });

        }
    }

    return frames;

}

SpriteSheet.prototype.grayscale = function(){

    for(var i = 0; i < this.imageSource.data.length; i += 4){

        var _r = this.imageSource.data[i + 0];
        var _g = this.imageSource.data[i + 1];
        var _b = this.imageSource.data[i + 2];
        var _a = this.imageSource.data[i + 2];

        var middle = _r + _b + _g / 3;

        this.imageSource.data[i + 0] = middle;
        this.imageSource.data[i + 1] = middle;
        this.imageSource.data[i + 2] = middle;

    }

    this._modify();

    return this;

}

SpriteSheet.prototype.invert = function(){

    for(var i = 0; i < this.imageSource.data.length; i += 4){

        var _r = this.imageSource.data[i + 0];
        var _g = this.imageSource.data[i + 1];
        var _b = this.imageSource.data[i + 2];
        var _a = this.imageSource.data[i + 3];

        this.imageSource.data[i + 0] = 255 - _r;
        this.imageSource.data[i + 1] = 255 - _g;
        this.imageSource.data[i + 2] = 255 - _b;

    }

    this._modify();

    return this;

}

SpriteSheet.prototype.tint = function(r, g, b, a){

    var a = a || 1;

    for(var i = 0; i < this.imageSource.data.length; i += 4){

        var _r = this.imageSource.data[i + 0];
        var _g = this.imageSource.data[i + 1];
        var _b = this.imageSource.data[i + 2];
        var _a = this.imageSource.data[i + 3];

        this.imageSource.data[i + 0] = r ? _r + r * a : _r;
        this.imageSource.data[i + 1] = g ? _g + g * a : _g;
        this.imageSource.data[i + 2] = b ? _b + b * a : _b;

    }

    this._modify();

    return this;

}

SpriteSheet.prototype.sketch = function(threshold){

    var threshold = threshold || 0.2;

    for(var i = 0; i < this.imageSource.data.length; i += 4){

        var _r = this.imageSource.data[i + 0];
        var _g = this.imageSource.data[i + 1];
        var _b = this.imageSource.data[i + 2];
        var _a = this.imageSource.data[i + 3];

        if(_a > 0){

            var factor = _r + _g + _b * 0.3;

            if(factor < ((255 * 3) * threshold)){
                this.imageSource.data[i + 0] = 0;
                this.imageSource.data[i + 1] = 0;
                this.imageSource.data[i + 2] = 0;
                this.imageSource.data[i + 3] = 255;
            }else{
                this.imageSource.data[i + 0] = 0;
                this.imageSource.data[i + 1] = 0;
                this.imageSource.data[i + 2] = 0;
                this.imageSource.data[i + 3] = 0;
            }
        }
    }

    this._modify();

    return this;
}

SpriteSheet.prototype.cartoon = function(threshold){

    var threshold = threshold || 0.2;

    for(var i = 0; i < this.imageSource.data.length; i += 4){

        var _r = this.imageSource.data[i + 0];
        var _g = this.imageSource.data[i + 1];
        var _b = this.imageSource.data[i + 2];
        var _a = this.imageSource.data[i + 3];

        if(_a > 0){

            var factor = _r + _g + _b * 0.3;

            if(factor < ((255 * 3) * threshold)){
                this.imageSource.data[i + 0] = 0;
                this.imageSource.data[i + 1] = 0;
                this.imageSource.data[i + 2] = 0;
                this.imageSource.data[i + 3] = 255;
            }
        }
    }

    this._modify();

    return this;
}

SpriteSheet.prototype.fillTransparentPixel = function(r, g, b, threshold){

    var threshold = threshold || 0.6;

    for(var i = 0; i < this.imageSource.data.length; i += 4){

        var _r = this.imageSource.data[i + 0];
        var _g = this.imageSource.data[i + 1];
        var _b = this.imageSource.data[i + 2];
        var _a = this.imageSource.data[i + 3];

        if(_a <= 255 * threshold){
            this.imageSource.data[i + 0] = r;
            this.imageSource.data[i + 1] = g;
            this.imageSource.data[i + 2] = b;
            this.imageSource.data[i + 3] = 255;
        }
    }

    this._modify();

    return this;

}

SpriteSheet.prototype.removeColorPixel = function(r, g, b, a){

    if(a > 0){

        for(var i = 0; i < this.imageSource.data.length; i += 4){

            var _r = this.imageSource.data[i + 0];
            var _g = this.imageSource.data[i + 1];
            var _b = this.imageSource.data[i + 2];
            var _a = this.imageSource.data[i + 3];

            if(_a > 0){
                if(r == _r && g == _g && b == _b){
                    this.imageSource.data[i + 0] = 0;
                    this.imageSource.data[i + 1] = 0;
                    this.imageSource.data[i + 2] = 0;
                    this.imageSource.data[i + 3] = 0;
                }
            }
        }

    }

    this._modify();

    return this;

}

SpriteSheet.prototype._modify = function(){

    // put the modified pixels to the canvas
    this.graphics.putImageData(this.imageSource, 0, 0);

    // update image with the modified pixels
    var image = new Image();
    image.src = this.canvas.toDataURL('image/png');
    this.image = image;

    // return self
    return this;
}

SpriteSheet.prototype.reset = function(){

    this.graphics.clearRect(0, 0, this.image.width, this.image.height);

    this.graphics.drawImage(this.originalImage, 0, 0);

    this.imageSource = this.graphics.getImageData(0, 0, this.originalImage.width, this.originalImage.height);

    this._modify();

    return this;

}

SpriteSheet.prototype.clone = function(){

    return new SpriteSheet(this.image);

}

SpriteSheet.prototype.generateGridLabel = function(width, height, scale, lineColor, labelColor, backgroundColor, alpha){

    var scale = scale || 1;
    var labelColor = labelColor || 'orange';
    var lineColor = lineColor || 'black';
    var backgroundColor = backgroundColor || 'transparent';
    var alpha = alpha || 1;

    var imageW = this.image.width;
    var imageH = this.image.height;

    var col = Math.round(imageW / width);
    var lin = Math.round(imageH / height);

    // create a canvas to manipulate image pixels
    var canvas = document.createElement('canvas');
    canvas.width = this.image.width * scale;
    canvas.height = this.image.height * scale;
    canvas.style.top = 150 + 'px';
    canvas.style.left = 150 + 'px';
    canvas.style.width = this.image.width * scale + 'px';
    canvas.style.height = this.image.height * scale + 'px';

    // draw to the canvas to copy image data
    var graphics = canvas.getContext('2d');
    graphics.scale(scale, scale);
    
    graphics.mozImageSmoothingEnabled = false;
    graphics.webkitImageSmoothingEnabled = false;
    graphics.msImageSmoothingEnabled = false;
    graphics.imageSmoothingEnabled = false;

    graphics.fillStyle = backgroundColor;
    graphics.fillRect(0, 0, canvas.width, canvas.height);
    graphics.drawImage(this.image, 0, 0);
    
    graphics.strokeStyle = lineColor;
    graphics.globalAlpha = alpha;
    graphics.lineWidth = 0.5 * 0.5;
    graphics.beginPath();

    for(var x = 0.25 * 0.5; x < imageW; x += width){
        graphics.moveTo(x, 0);
        graphics.lineTo(x, imageH);
    }
    for(var y = 0.25 * 0.5; y < imageH; y += height){
        graphics.moveTo(0, y);
        graphics.lineTo(imageW, y);
    }

    graphics.moveTo(imageW - 0.25 * 0.5, 0);
    graphics.lineTo(imageW - 0.25 * 0.5, imageH);

    graphics.moveTo(0, imageH - 0.25 * 0.5);
    graphics.lineTo(imageW, imageH - 0.25 * 0.5);

    graphics.stroke();
    graphics.closePath();
    
    graphics.fillStyle = labelColor;
    graphics.font = '4px courier';
    var i = 0;
    for(var y = 0; y <= lin; y++){
        for(var x = 0; x < col; x++){
            graphics.fillText(i - col, x * width + 2, y * height - 2);
            i++;
        }
    }

    // update image with the modified pixels
    var image = new Image();
    image.src = canvas.toDataURL('image/png');
    
    window.open(image.src);

}
