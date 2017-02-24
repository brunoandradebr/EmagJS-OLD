function Rectangle(width, height){

    Polygon.call(this);

    this.width = width || 100;
    this.height = height || 50;

    this.points = [
    new Vector(this.width  * 0.5, this.height  * 0.5),
    new Vector(-this.width * 0.5, this.height  * 0.5),
    new Vector(-this.width * 0.5, -this.height * 0.5),
    new Vector(this.width  * 0.5, -this.height * 0.5),
    ];

    this.originalPoints = this.points;

}
Rectangle.prototype = Object.create(Polygon.prototype);
Rectangle.prototype.constructor = Rectangle;
