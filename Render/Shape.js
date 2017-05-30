function Shape(polygon, position, fillColor, lineColor, lineWidth){

    this.source = polygon || new Polygon();

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

    // create a bounding box sprite
    this.boundingBox = new Sprite(null, null, null, null, 'rgba(0, 255, 0, 0.3)', 1);
    this._updateBoundingBox();

    var boundingBoxData = this.source.getBoundingBox();

    this.minPoint = boundingBoxData.startPoint;
    this.maxPoint = boundingBoxData.endPoint;

    this.width = this.boundingBox.width;
    this.height = this.boundingBox.height;

    if(this.position.x == 0 && this.position.y == 0)
        this.position.update(this.width * 0.5, this.height * 0.5);

}
Shape.prototype.constructor = Shape;

Shape.prototype.rotate = function(angle, x, y){

    this.source.rotate(angle, x, y);

    this.angle = this.source.angle;

    this._updateBoundingBox();
}

Shape.prototype._updateBoundingBox = function(){

    if(this.source.constructor.name == 'Circle'){

        this.boundingBox.width = this.source.radius * 2;
        this.boundingBox.height = this.source.radius * 2;
        this.boundingBox.position = this.position;
        
    }else{

        // update bounding box size
        var boundingBoxData = this.source.getBoundingBox();
        var width = boundingBoxData.size.width;
        var height = boundingBoxData.size.height;

        this.boundingBox.width = width;
        this.boundingBox.height = height;
        this.boundingBox.position = this.position.clone().add(boundingBoxData.startPoint.clone().add(width * 0.5, height * 0.5));

        this.minPoint = boundingBoxData.startPoint;
        this.maxPoint = boundingBoxData.endPoint;
        
        // update shape size
        this.width = this.boundingBox.width;
        this.height = this.boundingBox.height;
    }

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

        // update bounding box position - non vector manner to performance gain
        this.boundingBox.position.x = this.position.x  + this.minPoint.x + this.boundingBox.width * 0.5;
        this.boundingBox.position.y = this.position.y  + this.minPoint.y + this.boundingBox.height * 0.5;
    }

    graphics.closePath();

    if(this.fillColor)
        graphics.fill();

    if(this.lineWidth)
        graphics.stroke();

    graphics.restore();

}
