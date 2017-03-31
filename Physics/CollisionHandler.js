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

    // line collision
    if(typeA == 'Line' && typeB == 'Line'){
        return this.lineToLineCollision(A, B);
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
