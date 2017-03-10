function Tween(start, end, duration, type, loop){

    this.startTime = window.performance.now();
    this.start = start;
    this.end = end;
    this.duration = duration || 1000;
    this.type = type || 'linear';
    this.loop = loop || false;

    return this;

}
Tween.prototype.constructor = Tween;

Tween.prototype.value = function(){

    var _return = this.end;

    var t = window.performance.now() - this.startTime;
    var diff = this.end - this.start;

    if(this.startTime + this.duration > window.performance.now()){
        var t = t / this.duration;
        _return = Math.round(this.start + (diff * t));
    }else{
        if(this.loop)
            this.startTime = window.performance.now();
    }

    return _return;
}
