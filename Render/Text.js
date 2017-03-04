function Text(text, x, y, color, font, size, stroke, strokeColor, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY){

    this.x = x || 0;
    this.y = y || 0;
    this.color = color || 'black';
    this.font = font || 'commodore';
    this.stroke = stroke || false;
    this.strokeWidth = this.strokeWidth || 1;
    this.strokeColor = this.strokeColor || 'black';

    var _size = size || 24;

    Object.defineProperty(this, 'size', {

        get : function(){ return _size; },

        // ever when change text size, calculate it's width
        set : function(size){

            // just 'change' text content to force width calculation
            _size = size;

            this.text = this.text;
        }

    });

    var _text = text || '';

    Object.defineProperty(this, 'text', {

        get : function(){ return _text; },

        // ever when change text content, calculate it's width
        set : function(text){

            // create a temporary canvas context to measure text width
            var tmpCanvasContext = document.createElement('canvas').getContext('2d');
            tmpCanvasContext.font = this.size + 'px ' + this.font;
            tmpCanvasContext.fillText(text, 0, 0);
            var measure = tmpCanvasContext.measureText(text);
            this.width = measure.width;
            _text = text;
        }

    });

    this.text = text || '';
    this.size = size || 24;
    
    this.shadowBlur = (shadowBlur != null) ? shadowBlur : null;
    this.shadowColor = shadowColor || 'black';
    this.shadowOffsetX = shadowOffsetX || 1;
    this.shadowOffsetY = shadowOffsetY || 1;

}
Text.prototype.constructor = Text;

Text.prototype.draw = function(graphics){

    graphics.textAlign = 'center';
    graphics.textBaseline = 'middle';

    graphics.font = this.size + 'px ' + this.font;

    graphics.save();

    if(this.shadowBlur != null){
        graphics.shadowBlur = this.shadowBlur;
        graphics.shadowColor = this.shadowColor;
        graphics.shadowOffsetX = this.shadowOffsetX;
        graphics.shadowOffsetY = this.shadowOffsetY;
    }
    if(this.stroke){
        graphics.lineWidth = this.strokeWidth;
        graphics.strokeStyle = this.strokeColor;
        graphics.strokeText(this.text, this.x + this.width * 0.5, this.y + this.size * 0.5);
    }
    graphics.fillStyle = this.color;
    graphics.fillText(this.text, this.x + this.width * 0.5, this.y + this.size * 0.5);

    graphics.restore();

}
