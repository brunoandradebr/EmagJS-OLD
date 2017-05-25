function CollisionHandler(){
    this.collisionPoint = null;
    this.overlap = null;
    this.normal = null;
    this.resolution = null;
}
CollisionHandler.prototype.constructor = CollisionHandler;

CollisionHandler.prototype.check = function(A, B, offset){

    this.collisionPoint = null;
    this.overlap = null;
    this.normal = null;
    this.resolution = null;

    var typeA = A.constructor.name;
    var typeB = B.constructor.name;

    // shape collision handler - SAT
    if((typeA == 'Shape' && typeB == 'Shape') && A.source.constructor.name != 'Circle' && B.source.constructor.name != 'Circle') return this.SAT(A, B, offset);

    if(typeA == 'Shape') typeA = A.source.constructor.name;
    if(typeB == 'Shape') typeB = B.source.constructor.name;

    // line to line collision
    if(typeA == 'Line' && typeB == 'Line'){
        return this.lineToLineCollision(A, B, offset);
    }
    // line to list of lines collision
    if(typeA == 'Line' && (typeB == 'Array' && B[0].constructor.name == 'Line')){
        return this.lineToLineListCollision(A, B, offset);
    }    
    // line to shape/polygon collision
    if(typeA == 'Line' && B.constructor.name == 'Shape'){
        return this.lineToShapeCollision(A, B, offset);
    }

    // line to list of shape/polygon collision
    if(typeA == 'Line' && (typeB == 'Array' && B[0].constructor.name == 'Shape')){
        return this.lineToShapeListCollision(A, B, offset);
    } 

    // circle collision
    if(typeA == 'Circle' && typeB == 'Circle'){
        return this.circleToCircleCollision(A, B);
    }

    // circle to sprite collision
    if(typeA == 'Circle' && typeB == 'Sprite'){
        return this.circleToSpriteCollision(A, B);
    }

    // circle to line collision
    if(typeA == 'Circle' && typeB == 'Line'){
        return this.circleToLineCollision(A, B);
    }

    // circle to boundary
    if(typeA == 'Circle' && typeB == 'String' && B == 'boundary'){
        return this.circleToBoundaryCollision(A);
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

    // point(vector) to shape collision
    if(typeA == 'Vector' && B.constructor.name == 'Shape'){
        return this.pointToShapeCollision(A, B, offset);
    }

    // distance constraint to boundary
    if(typeA == 'DistanceConstraint' && B == 'boundary'){
        for(var i in A.bodies){
            this.circleToBoundaryCollision(A.bodies[i]);
        }
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

CollisionHandler.prototype.lineToLineCollision = function(A, B, offset){

    var offset = offset || {x : 0, y : 0};

    var aux = B.start.clone().subtract(A.start);

    var dot1 = aux.cross(B.end) - offset.x;
    var dot2 = A.end.cross(B.end) + offset.y;

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

CollisionHandler.prototype.lineToLineListCollision = function(A, B, offset){

    var _collision = this;

    var closestCollisionPoint = false;
    var minCollisionPointDistance = Infinity;
    
    B.forEach(function(line){

        if(_collision.check(A, line, offset)){

            var collisionDistance = _collision.collisionPoint.subtract(A.start);

            if(collisionDistance.lengthSquared() < minCollisionPointDistance * minCollisionPointDistance){
                closestCollisionPoint = collisionDistance;
                minCollisionPointDistance = collisionDistance.length();
            }
        }

    });

    this.collisionPoint = A.start.clone().add(closestCollisionPoint);
    
    return closestCollisionPoint ? true : false;
}

CollisionHandler.prototype.lineToShapeCollision = function(A, B, offset){

    if(B.source.constructor.name == 'Circle'){

        // todo...

    }else{

        var shapeLines = B.getLines();

        return this.lineToLineListCollision(A, shapeLines, offset);

    }

}

CollisionHandler.prototype.lineToShapeListCollision = function(A, B, offset){

    var lines = [];
    B.forEach(function(shape){
        var shapeLines = shape.getLines();
        shapeLines.forEach(function(line){
            lines.push(line);
        });
    });

    return this.check(A, lines, offset);

}

CollisionHandler.prototype.circleToCircleCollision = function(A, B){

    var distance = B.position.clone().subtract(A.position);
    var radius = A.source.radius + B.source.radius;

    if(distance.lengthSquared() < radius * radius){

        var direction = distance.clone().normalize();

        this.overlap = radius - distance.length();
        this.resolution = direction.clone().multiply(this.overlap);
        this.normal = direction.reverse();
        this.collisionPoint = B.position.clone().add(direction.clone().multiply(B.source.radius));

        return true;
    }
    return false;

}

CollisionHandler.prototype.circleToLineCollision = function(A, B){

    // vector from circle's center to line start point
    var circleToLineStart = A.position.clone().subtract(B.start);
    
    // line normalized
    var lineNormal = B.end.clone().normalize();
    // if circle is in line context
    var lineDotContext = circleToLineStart.dot(lineNormal);

    // circle to line collision
    if(lineDotContext > 0 && lineDotContext < B.length){

        var lineLeftNormal = lineNormal.leftNormal();
        var side = circleToLineStart.dot(lineLeftNormal);

        // left side
        if(side > 0){

            var closestPoint = A.position.clone().add(lineLeftNormal.clone().multiply(-A.source.radius));

            var closestPointToLineStart = closestPoint.clone().subtract(B.start);
            var overlap = closestPointToLineStart.dot(lineLeftNormal);

            if(overlap < 0){
                this.collisionPoint = closestPoint;
                this.overlap = overlap;
                this.resolution = lineLeftNormal.clone().multiply(-overlap);
                this.normal = lineLeftNormal;
                return true;
            }

        }else{ // right side

            var closestPoint = A.position.clone().add(lineLeftNormal.clone().multiply(A.source.radius));

            var closestPointToLineStart = closestPoint.clone().subtract(B.start);
            var overlap = closestPointToLineStart.dot(lineLeftNormal);

            if(overlap > 0){
                this.collisionPoint = closestPoint;
                this.overlap = overlap;
                this.resolution = lineLeftNormal.multiply(-overlap);
                this.normal = lineLeftNormal.clone().multiply(-1);
                return true;
            }

        }

    }else{ // point to circle collision

        var lineEndPoint = B.start.clone().add(B.end);
        var circleToLineEnd = A.position.clone().subtract(lineEndPoint);
        var distanceToStart = Math.abs(circleToLineStart.dot(lineNormal));
        var distanceToEnd = Math.abs(circleToLineEnd.dot(lineNormal));
        
        if(distanceToStart < distanceToEnd){
            return this.pointToCircleCollision(B.start, A);
        }else{
            return this.pointToCircleCollision(lineEndPoint, A);
        }

    }

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

CollisionHandler.prototype.circleToBoundaryCollision = function(A){

    var radius = A.source.radius;

    if(A.position.x + radius < DEVICE_WIDTH && A.position.x - radius > 0 && A.position.y + radius < DEVICE_HEIGHT && A.position.y - radius > 0) return false;

    if(A.position.x + radius > DEVICE_WIDTH){
        A.position.x = DEVICE_WIDTH - radius;
        if(A.body)
            A.body.velocity.x *= A.body.bounce;
    }
    if(A.position.x - radius < 0){
        A.position.x = radius;
        if(A.body)
            A.body.velocity.x *= A.body.bounce;
    }
    if(A.position.y + radius > DEVICE_HEIGHT){
        A.position.y = DEVICE_HEIGHT - radius;
        if(A.body)
            A.body.velocity.y *= A.body.bounce;
    }
    if(A.position.y - radius < 0){
        A.position.y = radius;
        if(A.body)
            A.body.velocity.y *= A.body.bounce;
    }

    return true;

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

CollisionHandler.prototype.pointToShapeCollision = function(A, B, g){

    var inside = true;

    B.getLines().forEach(function(line){

        var pointToLine = line.start.clone().subtract(A);
        var dot = pointToLine.dot(line.end.leftNormal());

        if(dot < 0)
            inside = false;

    });

    return inside;
}
