function FrameRate(){

    this._startTime = window.performance.now();
    this._now = 0;
    this._dt = 0;
    this._count = 0;
    this._frames = 0;
    this._fpsText = 0;
    
    this._bgWidth = 100;
    this._bgHeight = 50;
    this._bgMargin = {x : 0, y : 0};
    
    this._label = new Text('', null, null, 'cyan', 'arial', 12);
    this._labelMargin = {x : 0, y : 0};
    this._labelPadding = {};
    this._labelPadding.x = this._labelMargin.x == 1 ? -3 : this._labelMargin.x == 0.5 ? 0 : 3;
    this._labelPadding.y = this._labelMargin.y == 1 ? -3 : this._labelMargin.y == 0.5 ? 0 : 3;
    
    this._bars = [];
    for(var i = 0; i < 28; i++){
        var bar = new Sprite(null, null, 4.5, this._bgHeight, 'cyan', 0);
        bar.anchor.update(0, 1);
        this._bars.push(bar);
    }
    
}
FrameRate.prototype.constructor = FrameRate;

FrameRate.prototype.draw = function(graphics){

    this._now = window.performance.now();
    this._dt = this._now - this._startTime;

    this._frames++;
    if(this._now > this._startTime + 10){
        this._count++;
        var index = this._count % this._bars.length;
        var bar = this._bars[index];
        bar.height = ((this._bgHeight * 0.5) * map(this._fpsText, 0, 60.5, 0, 1)) | 0;
        bar.fillColor = 'hsl('+ (120 + this._fpsText) +', 100%, 50%)';
        this._label.color = bar.fillColor;
        bar.position.update(this._bgX + this._bgWidth - 1, this._bgY + this._bgHeight - 1);
    }
    if(this._now > this._startTime + 300){
        this._fpsText = (this._frames * 1000) / this._dt;
        this._label.text = this._fpsText.toFixed(1);
        this._startTime = this._now;
        this._frames = 0;
    }

    // draw background
    this._bgX = DEVICE_WIDTH - this._bgWidth;
    this._bgY = this._bgMargin.y;
    graphics.save();
    graphics.fillStyle = 'rgba(0, 0, 0, 0.7)';
    graphics.fillRect(this._bgX - this._bgMargin.x, this._bgY, this._bgWidth, this._bgHeight);
    
    // draw bars
    for(var i = 0; i < this._bars.length; i++){
        var bar = this._bars[i];
        bar.position.x -= 3 + 0.5;
        if(bar.position.x >= this._bgX){
            bar.draw(graphics);
        }
    }

    // position text
    this._label.x = ((this._bgX - this._bgMargin.x) + this._bgWidth * this._labelMargin.x + this._labelPadding.x) - this._label.width * this._labelMargin.x + this._labelPadding.x;
    this._label.y = (this._bgY + this._bgHeight * this._labelMargin.y + this._labelPadding.y) - this._label.size * this._labelMargin.y + this._labelPadding.y;
    // draw text
    this._label.draw(graphics);
    graphics.restore();

}
