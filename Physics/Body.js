function Body(renderObject){

    this.position = renderObject.position || new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);

    var _mass = 1;

    // ever when setting mass, calculate inverse mass
    Object.defineProperty(this, 'mass', {

        get : function(){
            return _mass;
        },

        set : function(mass){
            this.calculateInverseMass(mass);
            _mass = mass;
        }

    });

    this.mass = _mass;
    this.damping = .99;
    this.bounce = -0.5;

    this.forceAccumulator = new Vector(0, 0);

    this.renderObject = renderObject;

    if(!renderObject.position)
        this.position.update(this.renderObject.width * 0.5, this.renderObject.height * 0.5);

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
