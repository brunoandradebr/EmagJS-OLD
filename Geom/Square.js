function Square(side){

    Polygon.call(this);

    this.side = side || 50;

    this.width = this.height = this.side;

    this.points = [
    new Vector(this.side  * 0.5, this.side * 0.5),
    new Vector(-this.side * 0.5, this.side * 0.5),
    new Vector(-this.side * 0.5, -this.side * 0.5),
    new Vector(this.side  * 0.5, -this.side * 0.5),
    ];

    this.originalPoints = this.points;

}
Square.prototype = Object.create(Polygon.prototype);
Square.prototype.constructor = Square;
