function CollisionHandler(){
    this.collisionPoint = null;
    this.overlap = null;
    this.normal = null;
    this.resolution = null;
}
CollisionHandler.prototype.constructor = CollisionHandler;

CollisionHandler.prototype.check = function(A, B, offset){

    var typeA = A.constructor.name;
    var typeB = B.constructor.name;

    // shape collision handler - SAT
    if((typeA == 'Shape' && typeB == 'Shape') && A.source.constructor.name != 'Circle' && B.source.constructor.name != 'Circle') return this.SAT(A, B, offset);
    
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

    // circle to sprite collision
    if(typeA == 'Circle' && typeB == 'Sprite'){
        return this.circleToSpriteCollision(A, B);
    }

    // sprite collision
    if(typeA == 'Sprite' && typeB == 'Sprite'){
        return this.spriteToSpriteCollision(A, B);
    }

    // point(vector) to sprite collision
    if(typeA == 'Vector' && typeB == 'Sprite'){
        return this.pointToSpriteCollision(A, B);
    }

    // point(vector) to circle collision
    if(typeA == 'Vector' && typeB == 'Circle'){
        return this.pointToCircleCollision(A, B, offset);
    }

}

CollisionHandler.prototype.SAT = function(A, B, offset){

    var minOverlap = Infinity;
    var axis = null;

    // check A planes
    var APlanes = A.source.getPlanes();
    for(var i in APlanes){

        var plane = APlanes[i].normalize().leftNormal();
        var ASupportPoints = A.getSupportPoints(plane);
        var BSupportPoints = B.getSupportPoints(plane);

        var aMinProjection = ASupportPoints.minProjection;
        var aMaxProjection = ASupportPoints.maxProjection;
        var bMinProjection = BSupportPoints.minProjection;
        var bMaxProjection = BSupportPoints.maxProjection;

        if(bMinProjection > aMaxProjection || bMaxProjection < aMinProjection){
            return false;
        }

        if(aMinProjection < bMinProjection){
            if(aMaxProjection < bMaxProjection){
                var overlap = aMaxProjection - bMinProjection;
            }else{
                var option1 = aMaxProjection - bMinProjection;
                var option2 = bMaxProjection - aMinProjection;
                var overlap = option1 < option2 ? option1 : -option2;
            }
        }else{
            if(aMaxProjection > bMaxProjection){
                var overlap = aMinProjection - bMaxProjection;
            }else{
                var option1 = aMaxProjection - bMinProjection;
                var option2 = bMaxProjection - aMinProjection;
                var overlap = option1 < option2 ? option1 : -option2;
            }
        }

        if(Math.abs(overlap) < minOverlap){
            minOverlap = Math.abs(overlap);
            axis = plane;
            if(overlap > 0)
                axis.reverse();
        }
    }

    // check B planes
    var BPlanes = B.source.getPlanes();
    for(var i in BPlanes){

        var plane = BPlanes[i].normalize().leftNormal();
        var ASupportPoints = A.getSupportPoints(plane);
        var BSupportPoints = B.getSupportPoints(plane);

        var aMinProjection = ASupportPoints.minProjection;
        var aMaxProjection = ASupportPoints.maxProjection;
        var bMinProjection = BSupportPoints.minProjection;
        var bMaxProjection = BSupportPoints.maxProjection;

        if(bMinProjection > aMaxProjection || bMaxProjection < aMinProjection){
            return false;
        }

        if(aMinProjection < bMinProjection){

            if(aMaxProjection < bMaxProjection){
                var overlap = aMaxProjection - bMinProjection;
            }else{
                var option1 = aMaxProjection - bMinProjection;
                var option2 = bMaxProjection - aMinProjection;
                var overlap = option1 < option2 ? option1 : -option2;
            }
        }else{
            if(aMaxProjection > bMaxProjection){
                var overlap = aMinProjection - bMaxProjection;
            }else{
                var option1 = aMaxProjection - bMinProjection;
                var option2 = bMaxProjection - aMinProjection;
                var overlap = option1 < option2 ? option1 : -option2;
            }
        }

        if(Math.abs(overlap) < minOverlap){
            minOverlap = Math.abs(overlap);
            axis = plane;
            if(overlap > 0)
                axis.reverse();
        }
    }

    // return manifold
    this.overlap = minOverlap;
    this.normal = axis;
    this.resolution = this.normal.multiply(this.overlap);
    
    return true;
}

CollisionHandler.prototype.lineToLineCollision = function(A, B){

    var aux = B.start.clone().subtract(A.start);

    var dot1 = aux.cross(B.end);
    var dot2 = A.end.cross(B.end);

    var t = dot1 / dot2;

    if(t > 0 && t <= 1){

        var collisionPoint = A.end.clone().multiply(t).add(A.start);

        var dot = collisionPoint.clone().subtract(B.start).dot(B.end);

        if(dot > 0.1 && dot < B.end.lengthSquared() - 0.1){
            this.collisionPoint = collisionPoint;
            return true;
        }
    }

    return false;
}

CollisionHandler.prototype.circleToCircleCollision = function(A, B){

    var distance = B.position.clone().subtract(A.position);
    var radius = A.source.radius + B.source.radius;

    if(distance.lengthSquared() < radius * radius){

        var direction = distance.clone().normalize();

        this.overlap = radius - distance.length();
        this.normal = direction.reverse();
        this.collisionPoint = B.position.clone().add(direction.clone().multiply(B.source.radius));

        return true;
    }
    return false;

}

CollisionHandler.prototype.circleToSpriteCollision = function(A, B){

    var distance = B.position.clone().subtract(A.position);

    var dx = Math.abs(distance.x) - B.width * 0.5;
    var dy = Math.abs(distance.y) - B.height * 0.5;

    if(dx > A.source.radius) return false;
    if(dy > A.source.radius) return false;

    // sides collision
    if(dx < 0 || dy < 0){

        if(A.position.y < B.position.y + B.height * 0.5 && A.position.y > B.position.y - B.height * 0.5){
            if(A.position.x < B.position.x){
                this.normal = new Vector(-1, 0);
            }else{
                this.normal = new Vector(1, 0);
            }
            this.overlap = A.source.radius - dx;
        }

        if(A.position.x < B.position.x + B.width * 0.5 && A.position.x > B.position.x - B.width * 0.5){
            if(A.position.y < B.position.y){
                this.normal = new Vector(0, -1);
            }else{
                this.normal = new Vector(0, 1);
            }
            this.overlap = A.source.radius - dy;
        }        

        this.collisionPoint = A.position.clone().add(this.normal.clone().reverse().multiply(A.source.radius - this.overlap));
        
        return true;
    }

    // corners collision
    if(dx * dx + dy * dy < A.source.radius * A.source.radius){
        // top left
        if(distance.x > 0 && distance.y > 0){
            var point = new Vector(B.position.x - B.width * 0.5, B.position.y - B.height * 0.5);
        }
        // top right
        else if(distance.x < 0 && distance.y > 0){
            var point = new Vector(B.position.x + B.width * 0.5, B.position.y - B.height * 0.5);
        }
        // bottom left
        else if(distance.x > 0 && distance.y < 0){
            var point = new Vector(B.position.x - B.width * 0.5, B.position.y + B.height * 0.5);
        }
        // bottom right
        else if(distance.x < 0 && distance.y < 0){
            var point = new Vector(B.position.x + B.width * 0.5, B.position.y + B.height * 0.5);
        }
        
        var distanceToPoint = point.clone().subtract(A.position);
        this.overlap = A.source.radius - distanceToPoint.length();
        this.normal = distanceToPoint.normalize().reverse();
        this.collisionPoint = point;

        return true;
    }

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
                this.normal = new Vector(-1, 0);
            }else{
                this.normal = new Vector(1, 0);
            }
            this.overlap = overlapX;
        }else{
            if(A.position.y < B.position.y){
                this.normal = new Vector(0, -1);
            }else{
                this.normal = new Vector(0, 1);
            }
            this.overlap = overlapY;
        }
    }

    return colliding;

}

CollisionHandler.prototype.pointToSpriteCollision = function(A, B){

    var bTop = B.position.y - B.height * 0.5;
    var bRight = B.position.x + B.width * 0.5;
    var bLeft = B.position.x - B.width * 0.5;
    var bBottom = B.position.y + B.height * 0.5;
    var bHalfX = B.width * 0.5;
    var bHalfY = B.height * 0.5;

    if(A.x >= bLeft && A.x <= bRight){
        var overlapX = (bHalfX) - Math.abs((B.position.x - A.x));
        if(A.y >= bTop && A.y <= bBottom){
            var overlapY = (bHalfY) - Math.abs((B.position.y - A.y));
            if(overlapX < overlapY){
                if(B.position.x > A.x){
                    this.normal = new Vector(-1, 0);
                }else{
                    this.normal = new Vector(1, 0);
                }
                this.overlap = overlapX;
                this.collisionPoint = new Vector(B.position.x + (this.normal.x * (bHalfX)), A.y);
            }else{
                if(B.position.y > A.y){
                    this.normal = new Vector(0, -1);
                }else{
                    this.normal = new Vector(0, 1);
                }
                this.overlap = overlapY;
                this.collisionPoint = new Vector(A.x, B.position.y + (this.normal.y * (bHalfY)));
            }
            return true;
        }
    }

    return false;

}

CollisionHandler.prototype.pointToCircleCollision = function(A, B, offset){

    var offset = offset || 1;

    return this.circleToCircleCollision(new Shape(new Circle(1 * offset), A), B);

}
