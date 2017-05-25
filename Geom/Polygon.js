function Polygon(points){

    this.points = points || [];

    this.originalPoints = this.points;

    this.angle = 0;

}
Polygon.prototype.constructor = Polygon;


Polygon.prototype.rotate = function(angle, x, y){

    var angle = angle * TO_RAD;

    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    var points = [];

    var x = x || 0;
    var y = y || 0;

    this.originalPoints.forEach(function(point, i){

        var p = point.clone();

        var px = (p.x - x) * cos - (p.y - y) * sin;
        var py = (p.x - x) * sin + (p.y - y) * cos;

        points.push(new Vector(px, py));

    });

    this.points = points;


    this.angle = angle;

}

Polygon.prototype.getBoundingBox = function(){

    var axis = new Vector(1, -0);

    var supportPointsX = this.getSupportPoints(axis);
    var supportPointsY = this.getSupportPoints(axis.rightNormal());

    var startPoint = new Vector(supportPointsX.minPoint.x, supportPointsY.minPoint.y);
    var endPoint = new Vector(supportPointsX.maxPoint.x, supportPointsY.maxPoint.y);
    var size = endPoint.clone().subtract(startPoint);

    return {
        startPoint : startPoint,
        endPoint   : endPoint,
        size       : {width : size.x, height : size.y}
    };
}

Polygon.prototype.getSupportPoints = function(axis){

    var axis = axis || new Vector(1, 0);

    var minProjection = Infinity;
    var maxProjection = 0;
    var minPoint = this.points[0];
    var maxPoint = this.points[0];

    this.points.forEach(function(point, i){

        var projection = point.dot(axis);

        if(projection < minProjection){
            minProjection = projection;
            minPoint = point;
        }
        if(projection > maxProjection){
            maxProjection = projection;
            maxPoint = point;
        }

    });

    return {
        minPoint : minPoint,
        maxPoint : maxPoint,
        minProjection : minProjection,
        maxProjection : maxProjection
    }

}

Polygon.prototype.getPlanes = function(){

    var planes = [];

    var points = this.points;

    for(var i = 0; i < points.length; i++){
        var pointA = points[i];
        var pointB = points[(i + 1) % points.length];
        var plane = pointB.clone().subtract(pointA);
        planes.push(plane);
    }

    return planes;

}

Polygon.prototype.getLines = function(){

    var lines = [];

    var points = this.points;

    for(var i = 0; i < points.length; i++){
        var pointA = points[i];
        var pointB = points[(i + 1) % points.length];
        var line = new Line(pointA, pointB.clone().subtract(pointA));
        lines.push(line);
    }

    return lines;

}
