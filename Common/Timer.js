function Timer(interval, repeat){

    var _interval = interval || 1000;
    Object.defineProperty(this, 'interval', {
        get : function(){ return _interval; },
        set : function(interval){
            _interval = interval > 0 ? interval : 0;
            this._iInterval = interval / 1000;
        }
    });

    this.interval = _interval;
    this.repeat = repeat || Infinity;

    this._intervalCount = 0;
    this.count = 0;

    this.started = false;
    this.paused = false;
    this.tick = false;

}
Timer.prototype.constructor = Timer;

Timer.prototype.start = function(dt){

    if(this.paused)
        return false;

    this.started = true;

    this._intervalCount += dt;

    this.tick = false;

    if(this.count == this.repeat)
        this.pause();

    if(this._intervalCount > this._iInterval){

        this._intervalCount = 0;
        this.count++;
        this.tick = true;
    }
}

Timer.prototype.pause = function(){
    this.paused = true;
}

Timer.prototype.resume = function(){
    this.paused = false;
}
