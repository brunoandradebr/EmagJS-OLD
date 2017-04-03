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

    // circle collision
    if(typeA == 'Circle' && typeB == 'Circle'){
        return this.circleToCircleCollision(A, B);
    }

    // sprite collision
    if(typeA == 'Sprite' && typeB == 'Sprite'){
        return this.spriteToSpriteCollision(A, B);
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

CollisionHandler.prototype.spriteToSpriteCollision = function(A, B){

    var AHalfX = A.width * 0.5;
    var AHalfY = A.height * 0.5;
    var BHalfX = B.width * 0.5;
    var BHalfY = B.height * 0.5;
    
    var distanceX = B.position.x - A.position.x;
    var distanceY = B.position.y - A.position.y;

    var colliding = false;

    if(A.position.x + AHalfX > B.position.x - BHalfX && A.position.x - AHalfX < B.position.x + BHalfX){
        if(A.position.y + AHalfY > B.position.y - BHalfY && A.position.y - AHalfY < B.position.y + BHalfY){
            colliding = true;
        }
    }

    if(colliding){
        var overlapX = (AHalfX + BHalfX) - Math.abs(distanceX);
        var overlapY = (AHalfY + BHalfY) - Math.abs(distanceY);

        if(overlapX < overlapY){
            if(A.position.x < B.position.x){
                this.manifold.normal = new Vector(-1, 0);
            }else{
                this.manifold.normal = new Vector(1, 0);
            }
            this.manifold.overlap = overlapX;
        }else{
            if(A.position.y < B.position.y){
                this.manifold.normal = new Vector(0, -1);
            }else{
                this.manifold.normal = new Vector(0, 1);
            }
            this.manifold.overlap = overlapY;
        }
    }

    return colliding;

}
