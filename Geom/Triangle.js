function Triangle(side){

    Polygon.call(this);

    this.side = side || 50;

    this.width = this.height = this.side;

    this.points = [
    new Vector(this.side  * 0.5, this.side  * 0.5),
    new Vector(-this.side * 0.5, this.side  * 0.5),
    new Vector(this.side * 0.025, -this.side  * 0.5),
    new Vector(this.side * 0.5, this.side  * 0.5),
    ];

    this.originalPoints = this.points;

}
Triangle.prototype = Object.create(Polygon.prototype);
Triangle.prototype.constructor = Triangle;
