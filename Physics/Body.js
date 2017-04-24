function Body(position, shape){

    this.position = position || new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);

    // ever when setting mass, calculate inverse mass
    Object.defineProperty(this, 'mass', {

        set : function(mass){
            this.calculateInverseMass(mass);
        }

    });

    this.mass = 1;
    this.damping = .99;

    this.forceAccumulator = new Vector(0, 0);

    this.shape = shape || new Shape(new Square);

    if(!position)
        this.position.update(this.shape.width * 0.5, this.shape.height * 0.5);

}
Body.prototype.constructor = Body;

Body.prototype.calculateInverseMass = function(mass){

    if(mass > 0){
        this.iMass = 1 / mass;
    }else{
        this.iMass = 0;
    }

    return this.iMass;
}

Body.prototype.applyForce = function(x, y, z){

    if(arguments.length == 1){
        this.forceAccumulator.add(x/*.clone().multiply(1000)*/);
    }else{
        this.forceAccumulator.add(x, y, z);
    }

}

Body.prototype.update = function(dt){

    var force = this.forceAccumulator.multiply(this.iMass);
    var acceleration = this.acceleration.add(force);
    var velocity = this.velocity;

    this.velocity.add(acceleration/*.clone().multiply(dt)*/);
    this.position.add(velocity/*.clone().multiply(dt)*/);

    this.acceleration.update(0, 0);
    this.forceAccumulator.update(0, 0);

    this.velocity.multiply(this.damping);

}

Body.prototype.render = function(graphics){

    this.shape.position.update(this.position);

    this.shape.draw(graphics);

}
