function Line(start, end, strokeWidth, strokeColor){
    this.start = start;
    this.end = end;
    this.strokeColor = strokeColor || '#000';
    this.strokeWidth = strokeWidth || 1;
}
Line.prototype.constructor = Line;

Line.fromAngle = function(start, angle, length, strokeWidth, strokeColor){
    return new Line(start, Vector.fromAngle(angle, length), strokeWidth, strokeColor);
}

Line.prototype.draw = function(graphics){

    if(!this.start && !this.end) return false;

    graphics.strokeStyle = this.strokeColor;
    graphics.lineWidth = this.strokeWidth;
    graphics.lineCap = 'round';
    graphics.beginPath();
    graphics.moveTo(this.start.x, this.start.y);
    graphics.lineTo(this.start.x + this.end.x, this.start.y + this.end.y);
    graphics.stroke();

}
