function Text(text, x, y, color, font, size, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY){

    this.x = x || 0;
    this.y = y || 0;
    this.color = color || 'black';
    this.font = font || 'commodore';
    this.size = size || 24;

    var defaultText = text || '';

    Object.defineProperty(this, 'text', {

        get : function(){ return defaultText; },

        // ever when change text content, calculate it's width
        set : function(text){

            // create a temporary canvas context to measure text width
            var tmpCanvasContext = document.createElement('canvas').getContext('2d');
            tmpCanvasContext.font = this.size + 'px ' + this.font;
            tmpCanvasContext.fillText(text, 0, 0);
            var measure = tmpCanvasContext.measureText(text);
            this.width = measure.width;
            defaultText = text;
        }

    });

    this.text = text || '';
    
    this.shadowBlur = (shadowBlur != null) ? shadowBlur : null;
    this.shadowColor = shadowColor || 'black';
    this.shadowOffsetX = shadowOffsetX || 1;
    this.shadowOffsetY = shadowOffsetY || 1;

}
Text.prototype.constructor = Text;

Text.prototype.draw = function(graphics){

    graphics.font = this.size + 'px ' + this.font;
    
    if(this.shadowBlur != null){
        graphics.shadowBlur = this.shadowBlur;
        graphics.shadowColor = this.shadowColor;
        graphics.shadowOffsetX = this.shadowOffsetX;
        graphics.shadowOffsetY = this.shadowOffsetY;
    }
    
    graphics.fillStyle = this.color;
    graphics.fillText(this.text, this.x, this.size + this.y);
    
}
