function DistanceConstraint(bodies){

    this.bodies = [];

    if(typeof bodies == 'number'){

        for(var i = 0; i < bodies; i++){
            var shape = new Shape(new Circle(3));
            shape.body = new Body(shape);
            this.bodies.push(shape);
        }

    }else{
        this.bodies = bodies || [];
    }

    this.constraints = [];

}
DistanceConstraint.prototype.constructor = DistanceConstraint;

DistanceConstraint.prototype.addBody = function(body){

    var _this = this;

    if(body.constructor.name == 'Array'){
        var bodies = body;
        bodies.forEach(function(body){
            _this.bodies.push(body);
        });
    }else{
        _this.bodies.push(body);
    }
}

DistanceConstraint.prototype.addConstraint = function(indexA, indexB, length, stiffness){

    var bodyA = this.bodies[indexA];
    var bodyB = this.bodies[indexB];
    var length = length || bodyB.position.clone().subtract(bodyA.position).length();
    var stiffness = stiffness || 0.5;

    var constraint = {
        bodyA : bodyA,
        bodyB : bodyB,
        length : length,
        stiffness : stiffness
    };

    this.constraints.push(constraint);

}

DistanceConstraint.prototype.getAngle = function(constraintIndex){
    var constraint = this.constraints[constraintIndex];
    var plane = constraint.bodyB.position.clone().subtract(constraint.bodyA.position);
    return plane.angle(true);
}

DistanceConstraint.prototype.applyForce = function(force){

    this.bodies.forEach(function(body){
        if(!body.fixed)
            body.body.applyForce(force);
    });

}

DistanceConstraint.prototype.update = function(dt){

    var dt = dt || 1;

    this.bodies.forEach(function(body){
        if(!body.fixed)
            body.body.update(dt);
    });

}

DistanceConstraint.prototype.resolve = function(iterations){

    var _this = this;

    var iterations = iterations || 1;

    for(var i = 0; i < iterations; i++){

        _this.constraints.forEach(function(constraint){

            var bodyA = constraint.bodyA;
            var bodyB = constraint.bodyB;

            var distance = bodyB.position.clone().subtract(bodyA.position);
            var direction = distance.clone().normalize();

            var velR = bodyB.body.velocity.clone().subtract(bodyA.body.velocity);
            var velN = velR.dot(direction);
            var disR = constraint.length - distance.length();

            var impulse = direction.multiply(velN - disR);

            impulse.multiply(constraint.stiffness);

            if(!bodyA.fixed)
                bodyA.body.velocity.add(impulse);
            if(!bodyB.fixed)
                bodyB.body.velocity.subtract(impulse);

        });

    }

}

DistanceConstraint.prototype.getLines = function(){

    var lines = [];

    this.constraints.forEach(function(constraint){
        var line = new Line(constraint.bodyA.position, constraint.bodyB.position.clone().subtract(constraint.bodyA.position));
        lines.push(line);
    });

    return lines;

}

DistanceConstraint.prototype.getPolygon = function(){

    var points = [];

    this.bodies.forEach(function(body){

        points.push(body.position);

    });

    var polygon = new Polygon(points);
    var shape = new Shape(polygon);
    shape.position.update(0, 0);

    return shape;

}

DistanceConstraint.prototype.draw = function(graphics){

    // draw lines
    this.constraints.forEach(function(constraint){

        var bodyA = constraint.bodyA;
        var bodyB = constraint.bodyB;

        graphics.beginPath();
        graphics.moveTo(bodyA.position.x, bodyA.position.y);
        graphics.lineTo(bodyB.position.x, bodyB.position.y);
        graphics.stroke();
        graphics.closePath();

    });

    // draw bodies
    this.bodies.forEach(function(body){
        body.draw(graphics);
    });

}
