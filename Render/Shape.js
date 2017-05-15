function Shape(Polygon, position, fillColor, lineColor, lineWidth){

    this.source = Polygon;

    this.position = position || new Vector(0, 0);

    this.fillColor = fillColor || '#f06';
    this.lineColor = lineColor || '#000';
    this.lineWidth = (lineWidth != undefined) ? lineWidth : 1;
    this.shadowBlur = 0;
    this.shadowColor = 'black';
    this.shadowOffsetX = 3;
    this.shadowOffsetY = 3;
    this.alpha = 1;

    this.angle = 0;

    var boundingBox = this.getBoundingBox();

    this.width = boundingBox.size.width;
    this.height = boundingBox.size.height;

    if(this.position.x == 0 && this.position.y == 0)
        this.position.update(this.width * 0.5, this.height * 0.5);

}
Shape.prototype.constructor = Shape;

Shape.prototype.rotate = function(angle, x, y){

    this.source.rotate(angle, x, y);

    this.angle = this.source.angle;

}

Shape.prototype.getBoundingBox = function(){

    if(this.source.constructor.name == 'Circle'){

        var bb = {
            startPoint : this.position.clone().subtract(this.source.radius),
            size : {
                width : this.source.radius * 2,
                height : this.source.radius * 2
            }
        }

    }else{

        var bb = this.source.getBoundingBox();

        bb.startPoint.add(this.position);
        bb.endPoint.add(this.position);

    }

    return bb;

}

Shape.prototype.getSupportPoints = function(axis){

    var supportPoints = this.source.getSupportPoints(axis);

    supportPoints.minProjection = supportPoints.minProjection + this.position.dot(axis);
    supportPoints.maxProjection = supportPoints.maxProjection + this.position.dot(axis);

    return supportPoints;

}

Shape.prototype.getLines = function(){

    var _this = this;

    var lines = [];

    _this.source.getLines().forEach(function(line){
        line.start = line.start.clone().add(_this.position);
        lines.push(line);
    });

    return lines;
}

Shape.prototype.getPoints = function(){

    var _this = this;

    var points = [];

    _this.source.points.forEach(function(point){

        points.push(point.clone().add(_this.position));

    });

    return points;

}

Shape.prototype.draw = function(graphics){

    graphics.save();

    graphics.fillStyle = this.fillColor;
    graphics.strokeStyle = this.lineColor;
    graphics.lineWidth = this.lineWidth;

    if(this.shadowBlur){
        graphics.shadowBlur = this.shadowBlur;
        graphics.shadowOffsetX = this.shadowOffsetX;
        graphics.shadowOffsetY = this.shadowOffsetY;
        graphics.shadowColor = this.shadowColor;
    }

    graphics.lineCap = 'round';
    graphics.lineJoin = 'round';

    if(this.alpha < 0) this.alpha = 0;
    if(this.alpha != 1 && this.alpha >= 0)
        graphics.globalAlpha = this.alpha;

    graphics.beginPath();

    var padding = (this.lineWidth > 0) ? Math.floor(this.lineWidth * 0.5) : 0;

    if(this.source.constructor.name == 'Circle'){

        graphics.arc(this.position.x + padding, this.position.y + padding, this.source.radius, 0, Math.PI * 2);

    }else{

        var points = this.source.points;

        for(var i = 0; i < points.length; i++){

            var pointA = points[i];
            var pointB = (points[i + 1]) ? points[i + 1] : points[0];

            graphics.lineTo(this.position.x + pointB.x + padding, this.position.y + pointB.y + padding);

        }
    }

    graphics.closePath();

    if(this.fillColor)
        graphics.fill();

    if(this.lineWidth)
        graphics.stroke();

    graphics.restore();

}
