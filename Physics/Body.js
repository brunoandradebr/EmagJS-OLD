function Body(sprite){

    this.position = sprite.position || new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);

    var mass = 1;

    // ever when setting mass, calculate inverse mass
    Object.defineProperty(this, 'mass', {

        get : function(){
            return mass;
        },

        set : function(mass){
            this.calculateInverseMass(mass);
            mass = mass;
        }

    });

    this.mass = mass;
    this.damping = .99;

    this.forceAccumulator = new Vector(0, 0);

    this.sprite = sprite;

    if(!sprite.position)
        this.position.update(this.sprite.width * 0.5, this.sprite.height * 0.5);

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
