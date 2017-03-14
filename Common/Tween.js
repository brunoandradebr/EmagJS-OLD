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
        var t = t / this.duration;
        if(this.type == 'quadratic'){
            _return = this.start + (diff * t * t);
        }else{
            _return = this.start + (diff * t);
        }
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
