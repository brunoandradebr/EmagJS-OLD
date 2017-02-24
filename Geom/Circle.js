function Circle(radius){

    Polygon.call(this);

    this.radius = radius || 25;
    this.width = this.height = this.radius * 2;

}
Circle.prototype = Object.create(Polygon.prototype);
Circle.prototype.constructor = Circle;
