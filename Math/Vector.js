function Vector(x, y, z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Vector.prototype.constructor = Vector;


Vector.prototype.add = function(Vector){

    // operates with vector
    if(Vector.constructor.name == 'Vector'){

        this.x += Vector.x;
        this.y += Vector.y;
        this.z += Vector.z;

    }else{

        // operates with separate components
        if(arguments.length > 1){
            this.x += arguments[0];
            this.y += arguments[1];
            this.z += arguments[2];
        }else{

            // operates with scalar
            this.x += Vector;
            this.y += Vector;
            this.z += Vector;

        }
    }

    return this;
}

Vector.prototype.subtract = function(Vector){

    // operates with vector
    if(Vector.constructor.name == 'Vector'){

        this.x -= Vector.x;
        this.y -= Vector.y;
        this.z -= Vector.z;

    }else{

        // operates with separate components
        if(arguments.length > 1){
            this.x -= arguments[0];
            this.y -= arguments[1];
            this.z -= arguments[2];
        }else{

            // operates with scalar
            this.x -= Vector;
            this.y -= Vector;
            this.z -= Vector;

        }
    }

    return this;

}

Vector.prototype.multiply = function(Vector){

    // operates with vector
    if(Vector.constructor.name == 'Vector'){

        this.x *= Vector.x;
        this.y *= Vector.y;
        this.z *= Vector.z;

    }else{

        // operates with separate components
        if(arguments.length > 1){
            this.x *= arguments[0];
            this.y *= arguments[1];
            this.z *= arguments[2];
        }else{

            // operates with scalar
            this.x *= Vector;
            this.y *= Vector;
            this.z *= Vector;

        }
    }

    return this;

}

Vector.prototype.divide = function(Vector){

    // operates with vector
    if(Vector.constructor.name == 'Vector'){

        this.x /= Vector.x;
        this.y /= Vector.y;
        this.z /= Vector.z;

    }else{

        // operates with separate components
        if(arguments.length > 1){
            this.x /= arguments[0];
            this.y /= arguments[1];
            this.z /= arguments[1];
        }else{

            // operates with scalar
            this.x /= Vector;
            this.y /= Vector;
            this.z /= Vector;

        }
    }

    return this;

}

Vector.prototype.dot = function(Vector){

    return this.x * Vector.x + this.y * Vector.y + this.z * Vector.z;

}

Vector.prototype.cross = function(Vector){

    return this.x * Vector.y - this.y * Vector.x;

}

Vector.prototype.length = function(){

    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}

Vector.prototype.lengthSquared = function(){

    return this.x * this.x + this.y * this.y + this.z * this.z;
}

Vector.prototype.normalize = function(){

    var length = 1 / this.length();

    this.x *= length;
    this.y *= length;
    this.z *= length;

    if(!this.x) this.x = 0;
    if(!this.y) this.y = 0;
    if(!this.z) this.z = 0;

    return this;
}

Vector.prototype.clone = function(){

    return new Vector(this.x, this.y, this.z);
}

Vector.prototype.project = function(Vector){

    var normalized = Vector.clone().normalize();

    var dot = this.dot(normalized);

    return normalized.multiply(dot);

}

Vector.prototype.leftNormal = function(){

    return new Vector(this.y, -this.x, this.z);
}

Vector.prototype.rightNormal = function(){

    return new Vector(-this.y, this.x, this.z);
}

Vector.prototype.angle = function(degree){

    var degree = degree || false;

    var angle = -Math.atan2(this.y, this.x);

    if(angle < 0) angle += Math.PI * 2;

    return degree ? Math.round(angle * TO_DEGREE) : angle;

}

Vector.prototype.reverse = function(){

    return this.multiply(-1);
}

Vector.prototype.update = function(x, y, z){

    if(x.constructor.name == 'Vector'){

        this.x = x.x;
        this.y = x.y;
        this.z = x.z;

    }else{

        if(x != undefined)
            this.x = x;

        if(y != undefined)
            this.y = y;

        if(z != undefined)
            this.z = z;

    }

    return this;

}

Vector.prototype.debug = function(graphics, options){

    var color = options && options.color ? options.color : 'black';
    var center = options && options.center ? options.center : new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y);
    var lineWidth = options && options.lineWidth ? options.lineWidth : 2;

    // draw arrow
    var edgeX = center.x + this.x;
    var edgeY = center.y + this.y;
    var bracketSize = this.length() < 20 ? this.clone().multiply(0.5) : this.clone().multiply(0.9);
    var bracketAngle = this.length() < 20 ? 9 : bracketSize.length() * 0.10;
    bracketSize = clamp(bracketSize, 5, 5);
    bracketAngle = clamp(bracketAngle, 5, 999);
    var leftNormal = this.leftNormal().normalize().multiply(bracketAngle).add(bracketSize);
    var rightNormal = this.rightNormal().normalize().multiply(bracketAngle).add(bracketSize);

    graphics.strokeStyle = color;
    graphics.lineWidth = lineWidth;
    graphics.lineJoin = 'round';
    graphics.beginPath();

    // draw main vector
    graphics.moveTo(center.x, center.y);
    graphics.lineTo(center.x + this.x, center.y + this.y);

    // draw arrow
    graphics.moveTo(center.x + leftNormal.x, center.y + leftNormal.y);
    graphics.lineTo(edgeX, edgeY);
    graphics.moveTo(center.x + rightNormal.x, center.y + rightNormal.y);
    graphics.lineTo(edgeX, edgeY);

    graphics.closePath();
    graphics.stroke();

}
