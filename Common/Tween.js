function Tween(target, property, start, end, duration, type, loop, onComplete){

    this.startTime = window.performance.now();
    this.target = target;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration || 1000;
    this.type = type || 'linear';
    this.loop = loop || false;

    this.completed = false;
    this.onComplete = onComplete;

    return this;

}
Tween.prototype.constructor = Tween;

Tween.prototype.value = function(){

    var _return = this.end;

    var t = window.performance.now() - this.startTime;
    var diff = this.end - this.start;

    if(this.startTime + this.duration > window.performance.now()){
        return this[this.type](diff, this.start, this.duration, t);
    }else{
        if(!this.completed){
            if(this.onComplete)
                this.onComplete();
            this.completed = true;
        }
        if(this.loop){
            this.startTime = window.performance.now();
            this.completed = false;
        }
    }

    return _return;
}

Tween.prototype.play = function(){

    var property = this.property.split('.');

    if(property.length > 1){
        this.target[property[0]][property[1]] = this.value();
    }else{
        this.target[this.property] = this.value();
    }
}

Tween.prototype.copy = function(){
    return new Tween(this.target, this.property, this.start, this.end, this.duration, this.type, this.loop, this.onComplete);
}

Tween.prototype.linear = function(d, s, i, t){
    return s + (d * t / i);
}

Tween.prototype.quadraticIn = function(d, s, i, t){
    var t = t / i;
    return s + (d * t * t);
}

Tween.prototype.quadraticOut = function(d, s, i, t){
    var t = t / i;
    return s + (-d * (t - 2) * t);
}

Tween.prototype.quadraticInOut = function(d, s, i, t){
    var t = t / (i * 0.5);

    if(t < 1){
        return s + (d * 0.5 * t * t);
    }

    t--;
    return s + ( (-d * 0.5) * (t * (t - 2) -1) );
}

Tween.prototype.cubicIn = function(d, s, i, t){
    var t = t / i;
    return s + (d * t * t * t);
}

Tween.prototype.cubicOut = function(d, s, i, t){
    var t = t / i;
    t--;
    return s + (d * (t * t * t + 1));
}

Tween.prototype.cubicInOut = function(d, s, i, t){
    var t = t / (i * 0.5);

    if(t < 1){
        return s + (d * 0.5 * t * t * t);
    }

    t -= 2;
    return s + ( (d * 0.5) * (t * t * t + 2) );
}

Tween.prototype.bounce = function(d, s, i, t){

    var t = t / i;

    t = t<1/2.75?
    7.5625*t*t:t<2/2.75?
    7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?
    7.5625*(t-=2.25/2.75)*t+.9375:
    7.5625*(t-=2.625/2.75)*t+.984375;

    return s + d * t

}
