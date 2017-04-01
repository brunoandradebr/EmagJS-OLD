function CollisionHandler(){
    this.manifold = {
        collisionPoint : null,
        overlap : null,
        normal : null
    };
}
CollisionHandler.prototype.constructor = CollisionHandler;

CollisionHandler.prototype.check = function(A, B){

    var typeA = A.constructor.name;
    var typeB = B.constructor.name;

    if(typeA == 'Shape') typeA = A.source.constructor.name;
    if(typeB == 'Shape') typeB = B.source.constructor.name;

    // line collision
    if(typeA == 'Line' && typeB == 'Line'){
        return this.lineToLineCollision(A, B);
    }

    if(typeA == 'Circle' && typeB == 'Circle'){
        return this.circleToCircleCollision(A, B);
    }

}

CollisionHandler.prototype.lineToLineCollision = function(A, B){

    var aux = B.start.clone().subtract(A.start);

    var dot1 = aux.cross(B.end);
    var dot2 = A.end.cross(B.end);

    var t = dot1 / dot2;

    if(t > 0 && t <= 1){

        var collisionPoint = A.end.clone().multiply(t).add(A.start);

        var dot = collisionPoint.clone().subtract(B.start).dot(B.end);

        if(dot > 0 && dot < B.end.lengthSquared()){
            this.manifold.collisionPoint = collisionPoint;
            return true;
        }
    }

    return false;
}

CollisionHandler.prototype.circleToCircleCollision = function(A, B){

    var distance = B.position.clone().subtract(A.position);
    var radius = A.source.radius + B.source.radius;

    if(distance.lengthSquared() < radius * radius){

        var direction = distance.normalize();
        
        this.manifold.overlap = radius - distance.length();
        this.manifold.normal = direction.reverse();
        this.manifold.collisionPoint = B.position.clone().add(direction.clone().multiply(B.source.radius));
        
        return true;
    }
    return false;

}