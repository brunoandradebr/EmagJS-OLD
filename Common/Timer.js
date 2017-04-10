function Timer(interval){

    this.interval = interval || 1000;
    this.startTime = this.firstTime = window.performance.now();
    this.dt = 0;
    
    this.count = 0;

    Object.defineProperty(this, 'tick', {
        get : function(){
            this.update();
            return this.count;
        }
    });

    this.started = false;
    this.paused = true;

    this._start();

}
Timer.prototype.constructor = Timer;

Timer.prototype._start = function(){

    this.started = true;
    this.paused = false;

}

Timer.prototype.pause = function(){

    this.paused = true;

}

Timer.prototype.reset = function(){

    this.count = 0;
    this.startTime = window.performance.now();

}

Timer.prototype.resume = function(){

    this.startTime = window.performance.now();
    this.paused = false;

}

Timer.prototype.update = function(){

    if(!this.paused){

        this.dt = window.performance.now() - this.startTime;

        if(this.dt > this.interval){
            this.count++;
            this.startTime = window.performance.now();
        }

    }

}

Timer.prototype.elapsed = function(){
    return (window.performance.now() - this.firstTime | 0);
}
