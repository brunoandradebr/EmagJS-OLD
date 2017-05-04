function Vector(x, y, z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Vector.prototype.constructor = Vector;

Vector.fromArray = function(array){

    return new Vector(array[0], array[1], array[2]);
}

Vector.fromObject = function(object){

    return new Vector(object.x, object.y, object.z);
}

Vector.fromAngle = function(angle, length){
    var x = Math.cos(angle * TO_RAD) * length;
    var y = -Math.sin(angle * TO_RAD) * length;
    return new Vector(x, y);
}

Vector.random = function(){
    if(arguments.length == 1){
        var length = arguments[0] || 1;
        return Vector.fromAngle(random(360), length);
    }else{
        return new Vector(random(arguments[0]) + (arguments[2] || 0), random(arguments[1]) + (arguments[3] || 0));
    }
}

Vector.angle = function(A, B, inDegree){

    var inDegree = inDegree || false;

    var dot = A.clone().normalize().dot(B.clone().normalize());

    if(A.eq(B)) return 0;

    return inDegree ? Math.round(Math.acos(dot) * TO_DEGREE) : dot;
} 

Vector.angleBetween = function(A, B, inDegree){

    var inDegree = inDegree || false;

    var A_angle = Math.atan2(A.y, A.x);
    var B_angle = Math.atan2(B.y, B.x);
    var C = Vector.fromAngle(B_angle * TO_DEGREE - A_angle * TO_DEGREE, 1);

    return C.angle(inDegree);

}

Vector.prototype.toString = function(){

    return 'Vector(' + this.x + ', ' + this.y + ')';
}

Vector.prototype.toObject = function(){

    return {x : this.x, y : this.y, z : this.z};
}

Vector.prototype.toArray = function(){
    var _Array = [];
    _Array[0] = this.x;
    _Array[1] = this.y;
    _Array[2] = this.z;
    return _Array
}

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

Vector.prototype.rotate = function(angle, startAngle){

    var originalLenght = this.length();

    var startAngle = startAngle || 0;
    var angle = startAngle ? (-startAngle - angle) * TO_RAD : -angle * TO_RAD;

    var x = Math.cos(angle);
    var y = Math.sin(angle);

    this.update(x, y).normalize().multiply(originalLenght);

    return this;

}

Vector.prototype.angle = function(inDegree){

    var inDegree = inDegree || false;

    var angle = -Math.atan2(this.y, this.x);

    if(angle < 0) angle += Math.PI * 2;

    return inDegree ? Math.round(angle * TO_DEGREE) : angle;
}

Vector.prototype.direction = function(){

    return this.clone().normalize();
}

Vector.prototype.distance = function(Vector){
    var dx = this.x - Vector.x;
    var dy = this.y - Vector.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance;
}

Vector.prototype.distanceSquared = function(Vector){
    var dx = this.x - Vector.x;
    var dy = this.y - Vector.y;
    var distance = dx * dx + dy * dy;
    return distance;
}

Vector.prototype.limit = function(x, y, z){
    this.x = this.x <= x ? this.x : x;
    this.y = this.y <= y ? this.y : y;
    this.z = this.z <= z ? this.z : z;
    return this;
}

Vector.prototype.round = function(){
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
}

Vector.prototype.reverse = function(){

    return this.multiply(-1);
}

Vector.prototype.reverseX = function(){
    this.x *= -1;
    return this;
}

Vector.prototype.reverseY = function(){
    this.y *= -1;
    return this;
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

Vector.prototype.eq = function(V){
    var x = Math.abs(this.x - V.x);
    var y = Math.abs(this.y - V.y);
    var z = Math.abs(this.z - V.z);
    return (x <= 0.5 && y <= 0.5 && z <= 0.5);
}

Vector.prototype.debug = function(graphics, options){

    var color = options && options.color ? options.color : 'black';
    var center = options && options.center ? options.center : new Vector(DEVICE_CENTER_X, DEVICE_CENTER_Y);
    var lineWidth = options && options.lineWidth ? options.lineWidth : 2;
    var arrow = options && options.arrow != null ? options.arrow : true;
    
    graphics.strokeStyle = color;
    graphics.lineWidth = lineWidth;
    graphics.lineJoin = 'round';
    graphics.beginPath();

    // draw main vector
    graphics.moveTo(center.x, center.y);
    graphics.lineTo(center.x + this.x, center.y + this.y);

    // draw arrow
    if(arrow){
        var edgeX = center.x + this.x;
        var edgeY = center.y + this.y;
        var left = this.leftNormal().normalize().multiply(10).rotate(this.leftNormal().angle(true) + 45);
        var right = this.rightNormal().normalize().multiply(10).rotate(this.rightNormal().angle(true) - 45);
        graphics.moveTo(edgeX, edgeY);
        graphics.lineTo(edgeX + left.x, edgeY + left.y);
        graphics.moveTo(edgeX, edgeY);
        graphics.lineTo(edgeX + right.x, edgeY + right.y);
    }

    graphics.closePath();
    graphics.stroke();

}
